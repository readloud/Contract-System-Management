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

# 1. Cek versi npm
npm --version
# Output: 11.13.0

# 2. Install dependencies untuk setiap service
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd realtime && npm install && cd ..

# 3. Cek file: package-lock.json di folder
ls -la backend/package-lock.json
ls -la frontend/package-lock.json
ls -la realtime/package-lock.json

# 4. Setup backend
#cd backend
#rm -rf node_modules package-lock.json
#npm install

# 3. Setup frontend
#cd ../frontend
#rm -rf node_modules package-lock.json
#npm install

# 6. Setup realtime
#cd ../realtime
#rm -rf node_modules package-lock.json
#npm install
# package-lock.json akan terbuat otomatis dengan lockfileVersion: 3

# 7. Jika ingin langsung development tanpa Docker
#cd backend && npm run start:dev &
#cd frontend && npm run dev &
#cd realtime && npm run start:dev &

# Cek lockfileVersion di package-lock.json
head -10 backend/package-lock.json | grep lockfileVersion
# Harusnya: "lockfileVersion": 3

# Cek npm version di container
docker run --rm node:20-alpine npm --version

# 6. Jalankan
#cd ..
#docker compose up

# 5. Kembali ke root dan build Docker
#cd ..
#docker compose build --no-cache

# Build tanpa error
cd ..
docker compose build --progress=plain 2>&1 | grep -i "error" || echo "✅ No errors!"
