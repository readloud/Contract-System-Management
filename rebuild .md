### 1. Clean Up Semua Container, Images, dan Volumes

```bash
# ============================================
# CLEAN UP SEMUA DATA
# ============================================

# 1. Hentikan semua container yang berjalan
docker compose down -v
docker compose -f docker-compose.prod.yml down -v 2>/dev/null || true

# 2. Hentikan semua container yang terkait dengan CMS
docker stop $(docker ps -aq --filter "name=cms-") 2>/dev/null || true

# 3. Hapus semua container yang sudah berhenti
docker rm $(docker ps -aq --filter "name=cms-") 2>/dev/null || true

# 4. Hapus volume yang terkait (opsional, hati-hati!)
docker volume rm $(docker volume ls -q --filter "name=cms_") 2>/dev/null || true

# 5. Hapus image yang terkait
docker rmi $(docker images -q --filter "reference=cms-*") 2>/dev/null || true
docker rmi $(docker images -q --filter "reference=backend") 2>/dev/null || true
docker rmi $(docker images -q --filter "reference=frontend") 2>/dev/null || true
docker rmi $(docker images -q --filter "reference=realtime") 2>/dev/null || true

# 6. Bersihkan Docker system (cache, dangling images, dll)
docker system prune -a -f --volumes
```

---

### 2. Clean Up Node Modules dan Lock Files

```bash
# ============================================
# CLEAN UP NODE MODULES
# ============================================

# Hapus semua node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
rm -rf realtime/node_modules

# Hapus semua package-lock.json
rm -f backend/package-lock.json
rm -f frontend/package-lock.json
rm -f realtime/package-lock.json

# Hapus direktori dist/build
rm -rf backend/dist
rm -rf frontend/.next
rm -rf frontend/out
rm -rf realtime/dist

# Hapus cache npm
rm -rf ~/.npm/_cacache 2>/dev/null || true
npm cache clean --force
```

---

### 3. Clean Up Database (PostgreSQL)

```bash
# ============================================
# CLEAN UP DATABASE (Opsional - Hati-hati!)
# ============================================

# Jika menggunakan Docker volume, hapus volume database
docker volume rm cms_postgres_data 2>/dev/null || true
docker volume rm cms_postgres_prod_data 2>/dev/null || true

# Atau jika ingin reset database di container yang sedang berjalan
docker exec -it cms-postgres psql -U cms_user -d cms_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" 2>/dev/null || true
```

---

### 4. Reinstall Dependencies

```bash
# ============================================
# REINSTALL DEPENDENCIES
# ============================================

# Backend
cd backend
npm install --legacy-peer-deps
npm run build
cd ..

# Frontend
cd frontend
npm install --legacy-peer-deps
cd ..

# Realtime
cd realtime
npm install --legacy-peer-deps
cd ..

echo "Semua dependencies berhasil diinstall!"
```

---

### 5. Rebuild Docker Images

```bash
# ============================================
# REBUILD DOCKER IMAGES
# ============================================

# Build semua service tanpa cache
docker compose build --no-cache

# Build service tertentu
docker compose build --no-cache backend
docker compose build --no-cache frontend
docker compose build --no-cache realtime

# Lihat hasil build
docker images | grep -E "cms-|backend|frontend|realtime"
```

---

### 6. Jalankan Database Migration

```bash
# ============================================
# DATABASE MIGRATION
# ============================================

# Jalankan semua service terlebih dahulu (tanpa backend dulu agar database siap)
docker compose up -d postgres redis

# Tunggu database siap
sleep 10

# Jalankan migration dari container
docker exec -it cms-postgres psql -U cms_user -d cms_db -c "SELECT 1" > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "Database ready, running migrations..."
else
  echo "⚠️ Database not ready, creating..."
fi

# Jalankan backend terpisah untuk migration
docker compose up -d backend
sleep 5

# Run migrations
docker exec -it cms-backend npm run migration:run 2>/dev/null || echo "Migration not configured yet"

# Seed data
docker exec -it cms-backend npm run seed 2>/dev/null || echo "Seed not configured yet"
```

---

### 7. Jalankan Semua Service

```bash
# ============================================
# RUN ALL SERVICES
# ============================================

# Jalankan semua service
docker compose up -d

# Lihat status
docker compose ps

# Lihat logs
docker compose logs -f --tail=50
```

---

## 📝 Satu Perintah Clean Up & Rebuild (All-in-One)

```bash
#!/bin/bash
# ============================================
# CLEAN UP & REBUILD SCRIPT
# Contract Management System
# ============================================

set -e

echo "🔥 Starting Clean Up & Rebuild Process..."

# 1. Stop semua container
echo "Stopping containers..."
docker compose down -v 2>/dev/null || true

# 2. Hapus node_modules
echo "🗑️ Removing node_modules..."
rm -rf backend/node_modules frontend/node_modules realtime/node_modules

# 3. Hapus lock files
echo "🗑️ Removing lock files..."
rm -f backend/package-lock.json frontend/package-lock.json realtime/package-lock.json

# 4. Hapus build folders
echo "🗑️ Removing build folders..."
rm -rf backend/dist frontend/.next realtime/dist

# 5. Hapus Docker images
echo "🗑️ Removing Docker images..."
docker rmi $(docker images -q --filter "reference=cms-*") 2>/dev/null || true

# 6. Bersihkan Docker system
echo "🧹 Cleaning Docker system..."
docker system prune -a -f --volumes

# 7. Install dependencies
echo "Installing dependencies..."
cd backend && npm install --legacy-peer-deps && npm run build && cd ..
cd frontend && npm install --legacy-peer-deps && cd ..
cd realtime && npm install --legacy-peer-deps && cd ..

# 8. Build Docker images
echo "🐳 Building Docker images..."
docker compose build --no-cache

# 9. Jalankan service
echo "🚀 Starting services..."
docker compose up -d

# 10. Cek status
echo "Done! Checking status..."
sleep 5
docker compose ps

echo ""
echo "==========================================="
echo "🎉 Clean Up & Rebuild Complete!"
echo "==========================================="
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:3001"
echo "Realtime:  ws://localhost:1234"
echo "==========================================="
```

Simpan script di atas sebagai `rebuild.sh` dan jalankan:

```bash
chmod +x rebuild.sh
./rebuild.sh
```

---

## 🔧 Perintah Cepat (One-Liner)

```bash
# Clean up & rebuild dalam satu baris
docker compose down -v && rm -rf backend/node_modules frontend/node_modules realtime/node_modules backend/package-lock.json frontend/package-lock.json realtime/package-lock.json backend/dist frontend/.next realtime/dist && docker system prune -a -f --volumes && cd backend && npm install --legacy-peer-deps && npm run build && cd .. && cd frontend && npm install --legacy-peer-deps && cd .. && cd realtime && npm install --legacy-peer-deps && cd .. && docker compose build --no-cache && docker compose up -d
```

---

## Verifikasi Setelah Rebuild

```bash
# 1. Cek semua container running
docker compose ps

# 2. Cek health backend
curl http://localhost:3001/health

# 3. Cek frontend
curl -I http://localhost:3000

# 4. Cek logs
docker compose logs --tail=30

# 5. Cek resource usage
docker stats --no-stream
```

---

## ⚠️ Catatan Penting

| Perintah | Fungsi | Risiko |
|----------|--------|--------|
| `docker compose down -v` | Hapus semua container dan volume | **Data database hilang** |
| `docker system prune -a` | Hapus semua image yang tidak digunakan | Image akan didownload ulang |
| `rm -rf node_modules` | Hapus dependencies | Harus install ulang |
| `rm -rf package-lock.json` | Hapus lock file | Versi dependency bisa berubah |

**Jika ingin menyimpan data database**, jangan gunakan flag `-v` pada `docker compose down`:

```bash
# Hanya stop container, data database tetap ada
docker compose down

# Hapus container DAN volume (data hilang)
docker compose down -v
```

---
