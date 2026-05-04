# 1. Setup direktori untuk production
mkdir -p /opt/cms
cd /opt/cms

# 2. Clone repository
git clone https://github.com/your-company/cms-indonesia.git .

# 3. Buat direktori untuk SSL certificates
mkdir -p ssl

# 4. Copy SSL certificates (jika sudah punya)
# atau generate dengan Let's Encrypt setelah nginx running

# 5. Setup environment variables
cp backend/.env.production backend/.env.production
cp frontend/.env.production frontend/.env.production
cp realtime/.env.production realtime/.env.production

# 6. Edit file .env dengan credentials production Anda
nano backend/.env.production
nano frontend/.env.production
nano realtime/.env.production

# 7. Jalankan production compose
docker-compose -f docker-compose.prod.yml up -d

# 8. Jika ingin include monitoring
docker-compose -f docker-compose.prod.yml --profile monitoring up -d

# 9. Jika ingin include backup
docker-compose -f docker-compose.prod.yml --profile backup up -d

# 10. Cek status semua container
docker-compose -f docker-compose.prod.yml ps

# 11. Lihat logs
docker-compose -f docker-compose.prod.yml logs -f

# 12. Restart service tertentu
docker-compose -f docker-compose.prod.yml restart backend

# 13. Scale service (jika menggunakan swarm)
docker-compose -f docker-compose.prod.yml up -d --scale backend=3

# 14. Hentikan semua service
docker-compose -f docker-compose.prod.yml down

# 15. Hentikan dan hapus volumes (hati-hati!)
docker-compose -f docker-compose.prod.yml down -v