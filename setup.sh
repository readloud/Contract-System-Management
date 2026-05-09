# 1. Masuk ke direktori proyek
cd contract-management-system

# 2. Buat struktur direktori yang diperlukan
mkdir -p backend/src backend/src/database backend/src/database/seeders
mkdir -p frontend/app frontend/app/login frontend/app/dashboard frontend/app/contracts frontend/components
mkdir -p realtime/src
mkdir -p nginx

# 3. Buat file .env.docker untuk setiap service
cat > backend/.env.docker << 'EOF'
NODE_ENV=production
PORT=3001
API_PREFIX=/api/v1
DB_HOST=postgres
DB_PORT=5432
DB_USER=cms_user
DB_PASSWORD=SecurePass123!
DB_NAME=cms_db
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=SecureRedis123!
JWT_SECRET=super_secret_jwt_key_min_32_chars_here
JWT_EXPIRES_IN=7d
EOF

cat > frontend/.env.docker << 'EOF'
NEXT_PUBLIC_APP_NAME=CMS Indonesia
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:1234
NEXTAUTH_SECRET=docker_nextauth_secret_32chars
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_REDLINING=true
NEXT_PUBLIC_ENABLE_REALTIME_COLLAB=true
EOF

cat > realtime/.env.docker << 'EOF'
PORT=1234
NODE_ENV=production
DATABASE_URL=postgresql://cms_user:SecurePass123!@postgres:5432/cms_db
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=SecureRedis123!
JWT_SECRET=super_secret_jwt_key_min_32_chars_here
EOF

# 4. Install dependencies untuk setiap service
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd realtime && npm install && cd ..

# 5. Build dan jalankan dengan Docker
docker-compose up --build

# 6. Atau jika ingin langsung development tanpa Docker
# Backend
cd backend && npm run start:dev &
# Frontend
cd frontend && npm run dev &
# Realtime
cd realtime && npm run start:dev &