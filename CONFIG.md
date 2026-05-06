**menjalankan dan mengoperasikan CMS**

---

### 1. Jalankan Semua Service

```bash
# Jalankan semua service (frontend, backend, realtime, postgres, redis)
docker compose up

# Atau jalankan di background (detached mode)
docker compose up -d

# Lihat status semua container
docker compose ps

# Lihat logs real-time
docker compose logs -f
```

---

### 2. Akses Aplikasi

| Service | URL | Keterangan |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Aplikasi utama CMS |
| **Backend API** | http://localhost:3001/api/v1 | REST API endpoint |
| **API Documentation** | http://localhost:3001/api/v1/docs | Swagger/OpenAPI docs |
| **Health Check** | http://localhost:3001/health | Status kesehatan |
| **Realtime Server** | ws://localhost:1234 | WebSocket untuk kolaborasi |

---

### 3. Login ke Aplikasi

```bash
# Default credentials (setelah running seed)
Email: admin@cms.com
Password: Admin123!

# Atau jika seed belum dijalankan, buat user baru di halaman register
URL: http://localhost:3000/register
```

---

### 4. Jalankan Database Migration (Jika Perlu)

```bash
# Jalankan migration dari dalam container
docker exec -it cms-backend npm run migration:run

# Seed data awal (roles, admin user, template kontrak)
docker exec -it cms-backend npm run seed

# Cek data di database
docker exec -it cms-postgres psql -U cms_user -d cms_db -c "SELECT * FROM users;"
```

---

### 5. Verifikasi Semua Service Berjalan

```bash
# Cek health semua service
curl http://localhost:3001/health
# Response: {"status":"ok","services":{"database":"connected","api":"running"}}

# Cek frontend
curl -I http://localhost:3000
# Response: HTTP/1.1 200 OK

# Cek WebSocket (realtime)
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://localhost:1234
```

---

## 📋 Checklist Post-Build

| No | Tugas | Perintah | Status |
|----|-------|----------|--------|
| 1 | Jalankan container | `docker compose up -d` | ☐ |
| 2 | Cek status container | `docker compose ps` | ☐ |
| 3 | Jalankan migration | `docker exec -it cms-backend npm run migration:run` | ☐ |
| 4 | Seed database | `docker exec -it cms-backend npm run seed` | ☐ |
| 5 | Test login | Buka `http://localhost:3000/login` | ☐ |
| 6 | Upload dokumen | Testing upload PDF ke S3 | ☐ |
| 7 | Test redlining | Buat 2 versi kontrak, bandingkan | ☐ |
| 8 | Test e-signature | Kirim permintaan tanda tangan | ☐ |
| 9 | Test realtime | Buka 2 browser, edit bersama | ☐ |

---

## 🧪 Testing Fitur Utama

### A. Membuat Kontrak Baru

```bash
# Via API
curl -X POST http://localhost:3001/api/v1/contracts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Perjanjian Kerja Sama",
    "type": "partnership",
    "value": 500000000,
    "effectiveDate": "2024-01-01",
    "expiryDate": "2026-12-31"
  }'
```

### B. Upload Dokumen

```bash
# Upload file PDF
curl -X POST http://localhost:3001/api/v1/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/contract.pdf" \
  -F "contractId=CONTRACT_ID"
```

### C. Kirim Tanda Tangan Elektronik

```bash
# Request signature via PrivyID
curl -X POST http://localhost:3001/api/v1/signatures/request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contractId": "CONTRACT_ID",
    "signers": [
      {"email": "signer1@example.com", "name": "Signer One"},
      {"email": "signer2@example.com", "name": "Signer Two"}
    ]
  }'
```

---

## 📊 Monitoring & Debugging

### Lihat Logs

```bash
# Semua service
docker compose logs -f

# Service tertentu
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f realtime

# Logs dengan timestamp
docker compose logs -f --timestamps

# 100 baris terakhir
docker compose logs --tail=100
```

### Masuk ke Container

```bash
# Backend container
docker exec -it cms-backend sh

# PostgreSQL container
docker exec -it cms-postgres psql -U cms_user -d cms_db

# Redis container
docker exec -it cms-redis redis-cli
```

### Cek Resource Usage

```bash
# Lihat resource container
docker stats

# Detail container
docker inspect cms-backend
```

---

## 🔧 Troubleshooting Post-Build

### Masalah: Container tidak mau start

```bash
# Cek error logs
docker compose logs backend

# Restart service spesifik
docker compose restart backend

# Rebuild ulang
docker compose build --no-cache backend
docker compose up -d backend
```

### Masalah: Database connection failed

```bash
# Cek koneksi database
docker exec -it cms-backend sh -c "nc -zv postgres 5432"

# Restart database
docker compose restart postgres

# Cek log database
docker compose logs postgres
```

### Masalah: Port sudah digunakan

```bash
# Cek port yang digunakan
lsof -i :3000
lsof -i :3001
lsof -i :5432
lsof -i :6379

# Hentikan proses yang menggunakan port
kill -9 <PID>

# Atau ganti port di docker-compose.yml
```

### Masalah: Kehabisan disk space

```bash
# Bersihkan Docker cache
docker system prune -a

# Hapus container yang tidak digunakan
docker container prune

# Hapus image yang tidak digunakan
docker image prune
```

---

## 🚀 Production Deployment (Jika Sudah Siap)

```bash
# 1. Build untuk production
docker compose -f docker-compose.prod.yml build

# 2. Jalankan production
docker compose -f docker-compose.prod.yml up -d

# 3. Setup SSL certificate (Let's Encrypt)
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com

# 4. Update nginx configuration
cp nginx/nginx.prod.conf nginx/nginx.conf
# Edit domain sesuai milik Anda

# 5. Restart nginx
docker compose -f docker-compose.prod.yml restart nginx
```

---

## 📝 Backup & Restore Database

### Backup

```bash
# Backup database
docker exec -t cms-postgres pg_dump -U cms_user -d cms_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Kompress backup
docker exec -t cms-postgres pg_dump -U cms_user -d cms_db | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Restore

```bash
# Restore dari backup
docker exec -i cms-postgres psql -U cms_user -d cms_db < backup_20240101.sql

# Restore dari compressed backup
gunzip -c backup_20240101.sql.gz | docker exec -i cms-postgres psql -U cms_user -d cms_db
```

---

## 🎯 Ringkasan Perintah Penting

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Stop and remove volumes (reset database)
docker compose down -v

# Restart services
docker compose restart

# Update services after code change
docker compose up -d --build

# View logs
docker compose logs -f

# Execute commands in container
docker exec -it cms-backend sh
docker exec -it cms-postgres psql -U cms_user -d cms_db

# Scale services
docker compose up -d --scale backend=3

# Health check
curl http://localhost:3001/health

# Check API documentation
open http://localhost:3001/api/v1/docs
```

---

## ✅ Final Checklist

Setelah semua langkah di atas, pastikan:

- [ ] Semua container berstatus `Up` atau `Healthy`
- [ ] Bisa login ke `http://localhost:3000` dengan `admin@cms.com` / `Admin123!`
- [ ] Bisa membuat kontrak baru
- [ ] Bisa upload dokumen PDF
- [ ] Fitur redlining berfungsi (perbandingan dokumen)
- [ ] Fitur realtime collaboration berfungsi (buka 2 browser)
- [ ] API documentation bisa diakses
- [ ] Health check mengembalikan status `ok`

**Selamat! CMS Indonesia Anda sudah siap digunakan! 🎉**
