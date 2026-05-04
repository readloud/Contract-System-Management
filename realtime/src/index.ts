import { Server } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import { Logger } from '@hocuspocus/extension-logger';
import { Redis as RedisExtension } from '@hocuspocus/extension-redis';
import { Pool } from 'pg';
import { createClient } from 'redis';
import jwt from 'jsonwebtoken';

// PostgreSQL connection for Yjs document persistence
const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://cms_user:SecurePass123!@postgres:5432/cms_db',
  max: 20,
  idleTimeoutMillis: 30000,
});

// Redis client for awareness and message brokering
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`,
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

// Connect to Redis
await redisClient.connect();

// Create table for Yjs documents if not exists
async function initializeDatabase() {
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS yjs_documents (
      document_name VARCHAR(255) PRIMARY KEY,
      state BYTEA NOT NULL,
      version INTEGER DEFAULT 1,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await dbPool.query(`
    CREATE INDEX IF NOT EXISTS idx_yjs_documents_updated 
    ON yjs_documents(updated_at)
  `);
  
  console.log('📦 Database initialized');
}

// Save Yjs document state to PostgreSQL
async function saveDocument(documentName: string, state: Uint8Array) {
  const client = await dbPool.connect();
  try {
    await client.query(
      `INSERT INTO yjs_documents (document_name, state, version, updated_at)
       VALUES ($1, $2, COALESCE((SELECT version + 1 FROM yjs_documents WHERE document_name = $1), 1), NOW())
       ON CONFLICT (document_name)
       DO UPDATE SET 
         state = $2, 
         version = yjs_documents.version + 1,
         updated_at = NOW()`,
      [documentName, Buffer.from(state)],
    );
  } finally {
    client.release();
  }
}

// Load Yjs document state from PostgreSQL
async function loadDocument(documentName: string): Promise<Uint8Array | null> {
  const client = await dbPool.connect();
  try {
    const result = await client.query(
      'SELECT state FROM yjs_documents WHERE document_name = $1',
      [documentName],
    );
    if (result.rows.length > 0 && result.rows[0].state) {
      return new Uint8Array(result.rows[0].state);
    }
    return null;
  } finally {
    client.release();
  }
}

// Verify JWT token from frontend
function verifyToken(token: string): any {
  try {
    const secret = process.env.JWT_SECRET || 'default_secret_change_me';
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return null;
  }
}

// Configure Hocuspocus server
const server = Server.configure({
  port: parseInt(process.env.PORT || '1234'),

  // Extensions
  extensions: [
    new Logger(),
    new Database({
      fetch: async ({ documentName }) => {
        console.log(`📄 Loading document: ${documentName}`);
        const state = await loadDocument(documentName);
        return state;
      },
      store: async ({ documentName, state }) => {
        console.log(`💾 Saving document: ${documentName}, size: ${state?.length || 0} bytes`);
        if (state) {
          await saveDocument(documentName, state);
        }
      },
    }),
    new RedisExtension({
      redis: redisClient,
      prefix: 'hocuspocus',
    }),
  ],

  // Authentication middleware
  async onAuthenticate(data) {
    const token = data.requestHeaders.authorization?.split(' ')[1];
    
    if (!token) {
      throw new Error('Unauthorized: No token provided');
    }

    const user = verifyToken(token);
    if (!user) {
      throw new Error('Unauthorized: Invalid token');
    }

    console.log(`✅ User ${user.email || user.sub} authenticated`);
    
    return {
      user: {
        id: user.sub || user.id,
        email: user.email,
        role: user.role,
      },
    };
  },

  // Called when a user connects
  async onConnect(data) {
    console.log(`🔌 User connected to document: ${data.documentName}`);
    return data;
  },

  // Called when a user disconnects
  async onDisconnect(data) {
    console.log(`🔌 User disconnected from document: ${data.documentName}`);
    return data;
  },
});

// Initialize database and start server
async function start() {
  await initializeDatabase();
  server.listen();
  console.log(`🚀 Hocuspocus server running on port ${process.env.PORT || 1234}`);
}

start().catch(console.error);