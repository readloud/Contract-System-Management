# 1. Copy template ke file environment yang sesuai

# Backend - Development
cd backend
cp .env.example .env.development
# Edit .env.development dengan credentials development Anda

# Backend - Production
cp .env.example .env.production
# Edit .env.production dengan credentials production Anda

# Frontend - Development
cd ../frontend
cp .env.example .env.development
# Edit .env.development dengan URL yang sesuai

# Frontend - Production
cp .env.example .env.production
# Edit .env.production dengan URL production Anda

# 2. Untuk Docker
cp .env.example .env.docker
# Pastikan DB_HOST=postgres, REDIS_HOST=redis, dan lainnya sesuai service name

# Akses aplikasi
# Frontend: http://localhost:3000
# Login: admin@cms.com / Admin123!

# Backup database manual
docker exec cms-postgres-prod pg_dump -U cms_user cms_db > backup_$(date +%Y%m%d).sql

# Restore database
docker exec -i cms-postgres-prod psql -U cms_user cms_db < backup_20240101.sql

# Clear Redis cache
docker exec cms-redis-prod redis-cli FLUSHALL

# View real-time logs
docker-compose -f docker-compose.prod.yml logs -f --tail=100

# Check resource usage
docker stats

# Execute command in container
docker exec -it cms-backend-prod sh

# Update application (pull latest image)
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d --force-recreate

# Rollback to previous version
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
