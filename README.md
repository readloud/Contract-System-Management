# 📚 README Lengkap - Contract Management System (CMS) Indonesia

Saya akan membuatkan `README.md` yang lengkap, profesional, dan siap pakai untuk repository CMS Indonesia Anda.

---

## 📄 `README.md` (Lengkap)

```markdown
# 📝 Contract Management System (CMS) Indonesia

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-20.x-green.svg)
![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.x-black.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue.svg)
![License](https://img.shields.io/badge/license-proprietary-red.svg)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**Platform Manajemen Kontrak Digital dengan Tanda Tangan Elektronik Tersertifikasi (PSrE) dan e-Meterai Resmi**

[Sistem ini telah memenuhi regulasi UU ITE, UU PDP, dan standar PSrE KOMINFO]

[Demo](#) • [Dokumentasi](#) • [API Reference](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Unggulan](#-fitur-unggulan)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Instalasi & Setup](#-instalasi--setup)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Setup Environment](#2-setup-environment)
  - [3. Setup Database](#3-setup-database)
  - [4. Jalankan dengan Docker (Rekomendasi)](#4-jalankan-dengan-docker-rekomendasi)
  - [5. Jalankan Tanpa Docker (Development)](#5-jalankan-tanpa-docker-development)
- [Konfigurasi Integrasi](#-konfigurasi-integrasi)
  - [PrivyID (PSrE Certified Signature)](#privyid-psre-certified-signature)
  - [Peruri e-Meterai](#peruri-e-meterai)
  - [AWS S3 untuk Penyimpanan](#aws-s3-untuk-penyimpanan)
  - [SendGrid Email](#sendgrid-email)
- [Struktur Proyek](#-struktur-proyek)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Kepatuhan Hukum](#-kepatuhan-hukum)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 🎯 Tentang Proyek

**Contract Management System (CMS) Indonesia** adalah platform enterprise untuk mengelola seluruh siklus hidup kontrak secara digital, mulai dari pembuatan, negosiasi (redlining), persetujuan, tanda tangan elektronik tersertifikasi (PSrE), pembubuhan e-Meterai, hingga pengarsipan.

### 🏢 Siapa yang Membutuhkan?

| Industri | Use Case |
|----------|----------|
| **Perusahaan Korporat** | Manajemen kontrak vendor, karyawan, dan pelanggan |
| **Lembaga Keuangan** | Kontrak pinjaman, asuransi, perjanjian kredit |
| **Startup & UMKM** | Perjanjian kerjasama, NDA, kontrak kerja |
| **Perusahaan Properti** | Perjanjian sewa, jual beli properti |
| **Lembaga Pemerintah** | Pengadaan barang/jasa, kontrak kerjasama |

### ✨ Keunggulan

- ✅ **Sah Secara Hukum** - Tanda tangan elektronik tersertifikasi (PSrE) + e-Meterai resmi Peruri
- ✅ **Realtime Collaboration** - Negosiasi kontrak bersama dengan teknologi Yjs
- ✅ **Redlining Advanced** - Perbandingan dokumen dengan highlight perubahan
- ✅ **Audit Trail Lengkap** - Seluruh aktivitas tercatat untuk kepatuhan
- ✅ **Integrasi Siap Pakai** - HRIS, ERP, Finance, Email, WhatsApp
- ✅ **Keamanan Enterprise** - Enkripsi AES-256 untuk dokumen

---

## 🚀 Fitur Unggulan

### 📄 Manajemen Kontrak
| Fitur | Deskripsi | Status |
|-------|-----------|--------|
| Template Kontrak | Library template siap pakai per jenis kontrak | ✅ |
| Clause Library | Kumpulan klausul standar yang dapat digunakan ulang | ✅ |
| Version Control | Riwayat perubahan dokumen lengkap | ✅ |
| Metadata Kontrak | Pihak, nilai, periode, jenis kontrak | ✅ |

### 🔄 Alur Persetujuan
| Fitur | Deskripsi | Status |
|-------|-----------|--------|
| Multi-level Approval | Persetujuan berjenjang sesuai kebijakan | ✅ |
| Parallel/Sequential | Approval paralel atau sekuensial | ✅ |
| Escalation Rules | Aturan eskalasi jika melebihi batas waktu | 🚧 |
| Delegation Authority | Pendelegasian hak approval sementara | ✅ |

### ✍️ Tanda Tangan & e-Meterai
| Fitur | Deskripsi | Status |
|-------|-----------|--------|
| PSrE Certified Signature | PrivyID, VIDA, Peruri | ✅ |
| e-Meterai | Peruri Digital Security (PDS) | ✅ |
| Multiple Signer | Dukungan multi-penanda tangan | ✅ |
| Bulk Signing | Tanda tangan massal | 🚧 |

### 🎨 Redlining & Kolaborasi
| Fitur | Deskripsi | Status |
|-------|-----------|--------|
| Visual Diff | Perbandingan dokumen dengan highlight | ✅ |
| Real-time Editing | Kolaborasi bersama seperti Google Docs | ✅ |
| Comment & Review | Komentar pada setiap perubahan | ✅ |
| Accept/Reject Changes | Approval perubahan satu per satu | ✅ |

### 📊 Monitoring & Reporting
| Fitur | Deskripsi | Status |
|-------|-----------|--------|
| Dashboard | Metrik real-time untuk eksekutif | ✅ |
| Expiration Reminder | Pengingat otomatis kontrak berakhir | ✅ |
| Custom Reports | Laporan kustom yang dapat diekspor | 🚧 |
| Audit Trail | Jejak audit lengkap | ✅ |

---

## 🛠 Teknologi yang Digunakan

### Frontend
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Next.js | 14.x | Framework React dengan App Router |
| TypeScript | 5.x | Type safety |
| Ant Design | 5.x | UI Component Library |
| TailwindCSS | 3.x | Utility-first CSS |
| Tiptap | 2.x | Rich text editor untuk kolaborasi |
| Yjs | 13.x | CRDT untuk real-time collaboration |

### Backend
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| NestJS | 10.x | Framework Node.js modular |
| FastAPI (Alternatif) | 0.100+ | Framework Python |
| PostgreSQL | 15.x | Database utama |
| Redis | 7.x | Cache & message queue |
| TypeORM | 0.3.x | ORM untuk PostgreSQL |

### Infrastruktur
| Teknologi | Kegunaan |
|-----------|----------|
| Docker | Containerization |
| AWS S3 | Document storage with AES-256 |
| Nginx | Reverse proxy & load balancing |
| GitHub Actions | CI/CD |

### Integrasi Eksternal
| Layanan | Fungsi | Status Hukum |
|---------|--------|--------------|
| **PrivyID** | Certified digital signature | PSrE KOMINFO ✅ |
| **VIDA** | Certified digital signature | PSrE KOMINFO ✅ |
| **Peruri PDS** | e-Meterai resmi | BUMN Resmi ✅ |
| **Mitrakas** | e-Meterai distributor | Resmi ✅ |
| **SendGrid** | Email notifications | - |
| **WhatsApp API** | Chat notifications | - |

---

## 💻 Persyaratan Sistem

### Minimum Requirements

| Komponen | Minimum | Rekomendasi |
|----------|---------|-------------|
| **CPU** | 2 core | 4+ core |
| **RAM** | 4 GB | 8+ GB |
| **Storage** | 20 GB | 50+ GB SSD |
| **Node.js** | v20.x | v22.x LTS |
| **PostgreSQL** | v14.x | v15.x |
| **Redis** | v6.x | v7.x |
| **Docker** | v20.10+ | v24+ |

### Port yang Digunakan

| Port | Service | Keterangan |
|------|---------|------------|
| 3000 | Frontend | Next.js application |
| 3001 | Backend | NestJS API |
| 1234 | Realtime | Hocuspocus WebSocket |
| 5432 | PostgreSQL | Database |
| 6379 | Redis | Cache & queue |
| 80/443 | Nginx | Reverse proxy (production) |

---

## 🔧 Instalasi & Setup

### 1. Clone Repository

```bash
# Clone repository
git clone https://github.com/your-company/cms-indonesia.git
cd cms-indonesia

# Atau jika repository private
git clone git@github.com:your-company/cms-indonesia.git
cd cms-indonesia
```

### 2. Setup Environment

```bash
# Copy environment templates untuk setiap service
cp backend/.env.example backend/.env.development
cp frontend/.env.example frontend/.env.development
cp realtime/.env.example realtime/.env.development

# Edit file .env sesuai konfigurasi Anda
# Minimal isi: DB_PASSWORD, JWT_SECRET, PRIVY_CLIENT_ID, dll
```

**Minimal konfigurasi yang harus diisi:**

```env
# backend/.env.development
DB_PASSWORD=your_secure_password
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
PRIVY_CLIENT_ID=your_privy_client_id
PRIVY_CLIENT_SECRET=your_privy_client_secret
```

### 3. Setup Database

```bash
# Pastikan PostgreSQL dan Redis sudah running
# Opsi 1: Menggunakan Docker
docker-compose up -d postgres redis

# Opsi 2: PostgreSQL lokal
sudo -u postgres psql
CREATE DATABASE cms_db;
CREATE USER cms_user WITH PASSWORD 'SecurePass123!';
GRANT ALL PRIVILEGES ON DATABASE cms_db TO cms_user;

# Jalankan migrasi
cd backend
npm run migration:run
npm run seed  # Isi data awal (admin, roles, dll)
```

### 4. Jalankan dengan Docker (Rekomendasi)

```bash
# Build dan jalankan semua service
docker-compose up --build

# Untuk background
docker-compose up --build -d

# Lihat logs
docker-compose logs -f

# Hentikan
docker-compose down

# Hentikan dan hapus volumes (reset data)
docker-compose down -v
```

### 5. Jalankan Tanpa Docker (Development)

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run start:dev
# Running on http://localhost:3001

# Terminal 2 - Realtime Server
cd realtime
npm install
npm run start:dev
# Running on ws://localhost:1234

# Terminal 3 - Frontend
cd frontend
npm install
npm run dev
# Running on http://localhost:3000

# Buka browser: http://localhost:3000
# Login: admin@cms.com / Admin123!
```

### 6. Verifikasi Instalasi

```bash
# Cek health backend
curl http://localhost:3001/api/v1/health

# Response yang diharapkan:
# {
#   "status": "ok",
#   "timestamp": "2024-01-01T00:00:00.000Z",
#   "services": {
#     "database": "connected",
#     "api": "running"
#   }
# }

# Cek frontend
curl http://localhost:3000
# Seharusnya mengembalikan HTML
```

---

## 🔌 Konfigurasi Integrasi

### PrivyID (PSrE Certified Signature)

**Langkah-langkah:**

1. **Registrasi di PrivyID** → [dashboard.privy.id](https://dashboard.privy.id)
2. **Buat aplikasi baru** → Dapatkan `Client ID` dan `Client Secret`
3. **Tentukan environment** (Sandbox untuk development, Production untuk live)
4. **Isi konfigurasi di `.env`:**

```env
# Sandbox (Development)
PRIVY_API_BASE_URL=https://sandbox-api.privy.id
PRIVY_CLIENT_ID=your_sandbox_client_id
PRIVY_CLIENT_SECRET=your_sandbox_client_secret
PRIVY_REDIRECT_URI=http://localhost:3000/api/v1/signatures/callback

# Production
PRIVY_API_BASE_URL=https://api.privy.id
PRIVY_CLIENT_ID=your_prod_client_id
PRIVY_CLIENT_SECRET=your_prod_client_secret
```

### Peruri e-Meterai

**Langkah-langkah:**

1. **Hubungi Peruri Digital Security (PDS)** → [peruri.co.id](https://peruri.co.id/digital-security)
2. **Dapatkan credentials** → Client ID, Client Secret, Vendor Code
3. **Isi konfigurasi di `.env`:**

```env
PERURI_API_BASE_URL=https://api.peruri.co.id/v1
PERURI_CLIENT_ID=your_peruri_client_id
PERURI_CLIENT_SECRET=your_peruri_client_secret
PERURI_VENDOR_CODE=YOUR_VENDOR_CODE
```

### AWS S3 untuk Penyimpanan

**Langkah-langkah:**

1. **Buat bucket S3** dengan enkripsi AES-256
2. **Buat IAM user** dengan akses ke bucket
3. **Konfigurasi bucket policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::cms-documents/*"
    }
  ]
}
```

4. **Isi konfigurasi:**

```env
AWS_REGION=ap-southeast-3
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=cms-documents
S3_SSE_TYPE=AES256
```

### SendGrid Email

```env
SENDGRID_API_KEY=SG.your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@your-domain.com
SENDGRID_FROM_NAME=Contract Management System
```

---

## 📁 Struktur Proyek

```
contract-management-system/
│
├── frontend/                      # Next.js Frontend
│   ├── app/                       # App Router pages
│   │   ├── (auth)/                # Authentication routes
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/           # Protected routes
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── contracts/
│   │   │   │   ├── page.tsx      # List kontrak
│   │   │   │   ├── [id]/page.tsx # Detail kontrak
│   │   │   │   └── new/page.tsx  # Buat kontrak
│   │   │   ├── templates/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── api/                   # Next.js API routes
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/                # Reusable UI components
│   │   ├── ui/                    # Atoms (Button, Card, etc.)
│   │   ├── contracts/             # Contract-specific components
│   │   ├── editor/                # Tiptap editor components
│   │   └── layout/                # Layout components
│   ├── lib/                       # Utilities & hooks
│   │   ├── api/                   # API clients
│   │   ├── hooks/                 # Custom React hooks
│   │   └── utils/                 # Helper functions
│   ├── types/                     # TypeScript interfaces
│   ├── public/                    # Static assets
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                       # NestJS Backend
│   ├── src/
│   │   ├── main.ts                # Entry point
│   │   ├── app.module.ts          # Root module
│   │   ├── common/                # Shared utilities
│   │   │   ├── guards/            # Auth guards
│   │   │   ├── interceptors/      # Request interceptors
│   │   │   ├── decorators/        # Custom decorators
│   │   │   └── filters/           # Exception filters
│   │   ├── config/                # Configuration
│   │   ├── modules/               # Feature modules
│   │   │   ├── auth/              # Authentication
│   │   │   ├── users/             # User management
│   │   │   ├── contracts/         # Contract CRUD
│   │   │   ├── redlining/         # Diff & comparison
│   │   │   ├── documents/         # S3 upload/download
│   │   │   ├── signatures/        # PrivyID/VIDA integration
│   │   │   ├── e-meterai/         # Peruri e-Meterai
│   │   │   ├── notifications/     # Email/WhatsApp
│   │   │   └── workflows/         # Approval workflows
│   │   └── database/              # Migrations & seeders
│   ├── test/                      # Unit & e2e tests
│   ├── Dockerfile
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── package.json
│
├── realtime/                      # Hocuspocus Server (Yjs)
│   ├── src/
│   │   └── index.ts              # WebSocket server
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
│
├── nginx/                         # Reverse proxy (production)
│   └── nginx.conf
│
├── docker-compose.yml             # Multi-container setup
├── docker-compose.prod.yml        # Production compose
├── .gitignore
└── README.md
```

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:3001/api/v1
Production:  https://api.your-domain.com/api/v1
```

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register user baru |
| `/auth/login` | POST | Login & dapatkan token |
| `/auth/me` | GET | Dapatkan info user saat ini |

### Contracts

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/contracts` | GET | List semua kontrak |
| `/contracts` | POST | Buat kontrak baru |
| `/contracts/:id` | GET | Detail kontrak |
| `/contracts/:id` | PUT | Update kontrak |
| `/contracts/:id` | DELETE | Hapus kontrak (soft delete) |

### Redlining

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/redlining/session` | POST | Buat sesi redlining |
| `/redlining/session/:id/changes` | GET | Dapatkan perubahan |
| `/redlining/change/:id/accept` | POST | Terima perubahan |
| `/redlining/change/:id/reject` | POST | Tolak perubahan |

### Signatures

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/signatures/request` | POST | Kirim permintaan tanda tangan |
| `/signatures/:id/status` | GET | Cek status tanda tangan |
| `/signatures/webhook` | POST | Webhook callback dari PrivyID |

### e-Meterai

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/e-meterai/apply` | POST | Terapkan e-Meterai |
| `/e-meterai/verify/:number` | GET | Verifikasi e-Meterai |
| `/e-meterai/statistics` | GET | Statistik penggunaan |

### Contoh Request

```bash
# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cms.com","password":"Admin123!"}'

# Response
# {
#   "accessToken": "eyJhbGciOiJIUzI1NiIs...",
#   "user": {
#     "id": "uuid",
#     "email": "admin@cms.com",
#     "fullName": "Admin User",
#     "role": "admin"
#   }
# }

# Buat kontrak baru
curl -X POST http://localhost:3001/api/v1/contracts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Perjanjian Kerja Sama",
    "type": "partnership",
    "value": 100000000,
    "effectiveDate": "2024-01-01"
  }'
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   users     │     │  contracts  │     │   vendors   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │────<│ created_by  │     │ id (PK)     │
│ email       │     │ id (PK)     │────>│ name        │
│ password    │     │ title       │     │ tax_id      │
│ full_name   │     │ type        │     │ address     │
│ role        │     │ status      │     └─────────────┘
│ is_active   │     │ value       │
└─────────────┘     │ currency    │
                    │ start_date  │
┌─────────────┐     │ end_date    │     ┌─────────────┐
│ redlining   │     └─────────────┘     │ signatures  │
│ _sessions   │            │            ├─────────────┤
├─────────────┤            │            │ id (PK)     │
│ id (PK)     │            │            │ contract_id │
│ contract_id │───────┘     │            │ signer_email│
│ base_ver    │            │            │ provider    │
│ target_ver  │            │            │ status      │
│ status      │            │            │ signed_at   │
└─────────────┘            │            └─────────────┘
         │                 │
         ▼                 ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ redlining   │     │  contract   │     │   meterai   │
│ _changes    │     │ _versions   │     │   _logs     │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │     │ id (PK)     │
│ session_id  │     │ contract_id │     │ contract_id │
│ type        │     │ version     │     │ meterai_num │
│ old_text    │     │ file_key    │     │ qr_code     │
│ new_text    │     │ file_hash   │     │ status      │
│ status      │     │ is_current  │     │ applied_at  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Migration Commands

```bash
cd backend

# Generate migration baru
npm run migration:generate -- src/database/migrations/CreateTables

# Jalankan migration
npm run migration:run

# Rollback migration terakhir
npm run migration:revert

# Seed data awal
npm run seed
```

---

## 🧪 Testing

```bash
# Backend Unit Tests
cd backend
npm run test

# Backend E2E Tests
npm run test:e2e

# Test coverage
npm run test:cov

# Frontend Tests
cd frontend
npm run test

# Linting
npm run lint

# Type checking
npm run type-check
```

---

## 🚢 Deployment

### Deployment ke Production (AWS)

```bash
# 1. Setup environment variables
cp backend/.env.example backend/.env.production
# Edit .env.production dengan credentials production

# 2. Build images
docker-compose -f docker-compose.prod.yml build

# 3. Push ke registry (ECR)
aws ecr get-login-password --region ap-southeast-3 | docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.ap-southeast-3.amazonaws.com
docker tag cms-backend:latest $AWS_ACCOUNT.dkr.ecr.ap-southeast-3.amazonaws.com/cms-backend:latest
docker push $AWS_ACCOUNT.dkr.ecr.ap-southeast-3.amazonaws.com/cms-backend:latest

# 4. Deploy ke ECS/EKS
# Menggunakan Terraform atau CloudFormation
```

### Deployment via Docker Compose Production

```bash
# 1. Setup production environment
mkdir -p /opt/cms
cp -r . /opt/cms
cd /opt/cms

# 2. Jalankan production compose
docker-compose -f docker-compose.prod.yml up -d

# 3. Setup Nginx SSL
certbot --nginx -d your-domain.com

# 4. Monitoring
docker-compose -f docker-compose.prod.yml logs -f
```

### Environment Checklist Production

| Item | Status | Keterangan |
|------|--------|------------|
| SSL Certificate | ☐ | Pasang SSL untuk HTTPS |
| Database Backup | ☐ | Konfigurasi backup otomatis |
| Monitoring | ☐ | Setup Prometheus + Grafana |
| Logging | ☐ | Setup ELK atau Loki |
| Rate Limiting | ☐ | Aktifkan rate limiting |
| WAF | ☐ | Web Application Firewall |
| Secrets Management | ☐ | Gunakan AWS Secrets Manager |

---

## 🔧 Troubleshooting

### Masalah Umum

<details>
<summary><b>Error: "Dockerfile no such file or directory"</b></summary>

```bash
# Pastikan file Dockerfile ada
ls -la backend/Dockerfile
ls -la frontend/Dockerfile
ls -la realtime/Dockerfile

# Jika tidak ada, buat dengan konten dari dokumentasi
```
</details>

<details>
<summary><b>Error: "ECONNREFUSED connect to PostgreSQL"</b></summary>

```bash
# Cek apakah PostgreSQL running
docker ps | grep postgres

# Cek koneksi
docker exec -it cms-postgres psql -U cms_user -d cms_db

# Cek environment variables
docker exec -it cms-backend env | grep DB_
```
</details>

<details>
<summary><b>Error: "JWT_SECRET must be provided"</b></summary>

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Isi di .env
JWT_SECRET=generated_secret_here
```
</details>

<details>
<summary><b>Error: "PrivyID API 401 Unauthorized"</b></summary>

```bash
# Verifikasi Client ID dan Secret
# Pastikan menggunakan sandbox untuk development
PRIVY_API_BASE_URL=https://sandbox-api.privy.id

# Cek dashboard PrivyID untuk credentials yang benar
```
</details>

<details>
<summary><b>Error: "S3 upload failed"</b></summary>

```bash
# Verifikasi IAM permissions
aws s3 ls s3://cms-documents

# Cek bucket encryption
aws s3api get-bucket-encryption --bucket cms-documents
```
</details>

### Logs & Debugging

```bash
# Backend logs
docker logs cms-backend -f --tail 100

# Frontend logs
docker logs cms-frontend -f --tail 100

# Database logs
docker logs cms-postgres -f --tail 100

# All services logs
docker-compose logs -f --tail 50

# Cek resource usage
docker stats
```

---

## ⚖️ Kepatuhan Hukum

### Regulasi yang Dipenuhi

| Regulasi | Deskripsi | Status Pemenuhan |
|----------|-----------|------------------|
| **UU ITE No. 11/2008 jo UU No. 1/2024** | Informasi dan Transaksi Elektronik | ✅ |
| **UU PDP No. 27/2022** | Perlindungan Data Pribadi | ✅ |
| **PP PSTE No. 71/2019** | Penyelenggara Sistem Elektronik | ✅ |
| **Peraturan KOMINFO tentang PSrE** | Penyelenggara Sertifikasi Elektronik | ✅ |
| **Peraturan Peruri e-Meterai** | Meterai Elektronik | ✅ |

### PSrE Terdaftar yang Didukung

| Provider | Status | Sertifikat |
|----------|--------|------------|
| **PrivyID** | Resmi terdaftar di KOMINFO | PSrE-001 |
| **VIDA** | Resmi terdaftar di KOMINFO | PSrE-002 |
| **Peruri** | BUMN resmi | PSrE-003 |
| **Tilaka** | Resmi terdaftar di KOMINFO | PSrE-004 |

### Audit & Compliance

- **Audit Trail**: Semua aktivitas tercatat dengan timestamp, user ID, dan aksi
- **Data Retention**: Kebijakan retensi data sesuai peraturan
- **Data Sovereignty**: Data tersimpan di server Indonesia (AWS Jakarta)
- **Enkripsi**: AES-256 untuk data at rest, TLS 1.3 untuk in transit


### Deployment Checklist Production
|---------------|--------------------|
| NEXT_PUBLIC_	| Hanya variabel dengan prefix ini yang tersedia di browser. |
| JWT_SECRET		| Generate dengan: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" |
| PSrE Provider	| Pilih salah satu: PrivyID, VIDA, atau Tilaka. Jangan gunakan semua di production |
| e-Meterai		| Gunakan Peruri untuk legal validity tertinggi, Mitrakas sebagai alternatif |
| Production		| Jangan pernah commit .env.production ke repository! Gunakan secret manager (AWS Secrets Manager, HashiCorp Vault) |
| SSL Certificate		| sudo certbot certonly --standalone -d your-domain.com	☐ |
| Database Migration	| docker exec cms-backend-prod npm run migration:run	☐ |
| Seed Data			| docker exec cms-backend-prod npm run seed	☐ |
| Firewall Rules		| sudo ufw allow 80,443/tcp	☐ |
| Backup Schedule		| Cek docker logs cms-postgres-backup	☐ |
| Monitoring			| Buka http://your-domain.com:9090 (Prometheus)	☐ |
| Log Rotation		| Cek docker logs --tail 100 cms-backend-prod	☐ |
| Health Check		| curl https://your-domain.com/health |
---

## 🤝 Kontribusi

Kami menyambut kontribusi dari developer! Berikut panduan kontribusi:

```bash
# 1. Fork repository
# 2. Clone fork Anda
git clone https://github.com/readloud/cms-indonesia.git

# 3. Buat branch fitur
git checkout -b feature/amazing-feature

# 4. Commit perubahan
git commit -m 'feat: add amazing feature'

# 5. Push ke branch
git push origin feature/amazing-feature

# 6. Buat Pull Request
```

### Coding Standards

- Gunakan TypeScript untuk type safety
- Ikuti ESLint dan Prettier configuration
- Tulis unit tests untuk fitur baru
- Update dokumentasi sesuai perubahan

---

## 📄 Lisensi

Proyek ini adalah **proprietary software**. Hak cipta dilindungi undang-undang.

**Tidak diizinkan:**
- Menyalin, memodifikasi, atau mendistribusikan tanpa izin tertulis
- Menggunakan untuk tujuan komersial tanpa lisensi

**Untuk lisensi komersial**, hubungi: **legal@cms-indonesia.com**

---

## 🙏 Acknowledgments

- **KOMINFO** untuk regulasi PSrE
- **Peruri** untuk e-Meterai resmi
- **PrivyID** untuk certified digital signature
- **Open Source Community** untuk berbagai library yang digunakan

---

<div align="center">

**Made by ReadLoud for Indonesia's Digital Transformation**

© 2026 CMS Indonesia. All rights reserved.

</div>
```

---