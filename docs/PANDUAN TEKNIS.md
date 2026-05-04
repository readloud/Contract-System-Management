---

### 🅰️ Bagian Satu: Binary Diff untuk PDF

**Binary diff** adalah teknologi yang membandingkan file di level biner, bukan teks. Untuk PDF (yang berisi teks, font, gambar, dll.), kemampuan ini menjadi penting untuk melacak dan menyorot perubahan pada kontrak secara akurat.

#### 1.0 Memahami Kebutuhan Binary Diff PDF

Untuk CMS Anda, setidaknya ada dua level kebutuhan binary diff:

1.  **Visual Diff untuk Review (User Facing):** Ini adalah fitur yang dilihat oleh pengguna (Legal, Client). Mereka ingin melihat dua versi PDF (v1 vs v2) bersebelahan, dengan perbedaan (tambahan, hapusan, perubahan gaya) disorot dengan warna-warni. Sasarannya adalah memberikan visualisasi yang jelas dan intuitif bagi manusia.
2.  **Incremental Diff untuk Storage & Sync (System Backend):** Ini adalah mekanisme internal untuk menyimpan dan menyinkronkan dokumen secara efisien. Daripada menyimpan seluruh berkas PDF setiap kali ada revisi ("Apakah ini versi final? Tidak, yang ini..."), sistem hanya menyimpan *perubahannya saja* (`delta`), mirip seperti cara kerja Git.

Untuk mencapai kedua hal ini, Anda bisa mengintegrasikan beberapa pustaka, baik dari sisi klien (browser) maupun server (back-end).

#### 2.0 Pendekatan: Client-Side (Browser) vs Server-Side

| Pendekatan | Skenario & Kelebihan | Kekurangan |
|:---|:---|:---|
| **100% Client-side (Recommended)** | Cocok untuk **Visual Diff**: Proses perbandingan terjadi di browser, dokumen tidak perlu di-upload ke server. Aman, cepat, dan menjaga privasi. Sangat ideal untuk tahap review. | Tidak menghasilkan delta untuk penyimpanan. Kinerja bisa melambat pada dokumen berukuran sangat besar (>50MB) atau saat membuka banyak tab. |
| **Server-side** | Cocok untuk membuat **Incremental Storage (Delta)** atau **Visualisasi untuk arsip**. Tersedia beragam tools andal seperti tool C++ CLI `vslavik/diff-pdf` dan `pdf-diff` Python untuk teks dan layout. | Membutuhkan resource server yang besar, privasi data bergantung pada server, dan perlu proses upload/download. |

Saya sarankan untuk menggabungkan kedua pendekatan: gunakan metode *client-side* untuk fitur yang langsung dilihat pengguna, dan metode *server-side* untuk kebutuhan internal sistem. Dengan kata lain, manfaatkan yang client-side untuk visual, dan yang server-side untuk storage yang efisien.

##### ✨ Rekomendasi Pustaka Client-Side (Browser)

Pustaka **client-side** adalah pilihan utama untuk fitur Visual Diff:

- **BentoPDF (WebAssembly, Open Source):** Sebuah *standout* di kategori ini. Pustaka ini berjalan sepenuhnya di browser, menawarkan *word-level diff engine* dengan *bounding-box* yang akurat dan deteksi perubahan gaya (font, ukuran). Sempurna untuk antarmuka yang responsif dan modern.
- **@sqiu123/diff (NPM):** Alternatif yang bagus untuk perbandingan dasar. Memproses PDF langsung di klien, menjamin privasi dan keamanan data.

##### 🖥️ Opsi Server-Side

Jika Anda membutuhkan delta untuk penyimpanan, gunakan pendekatan server-side dengan pustaka-pustaka berikut:

- **xdelta3:** Alat command line yang menggunakan format VCDIFF (RFC 3284). Ini adalah pilihan standar industri.
- **librsync:** Mengimplementasikan algoritma rsync untuk delta biner, sangat baik untuk sinkronisasi yang efisien.
- **xpatch:** Pustaka modern yang dapat menghasilkan delta berukuran sangat kecil (~2 byte untuk perubahan kecil).

> **Rekomendasi Top:**
> - **Untuk kebutuhan tampilan (visual diff)**: Gunakan **BentoPDF (via WebAssembly)**.
> - **Untuk kebutuhan penyimpanan (incremental diff)**: Gunakan **xdelta3** atau **librsync**.

---

### 👥 Bagian Dua: Real-time Collaborative Editing

Fitur ini memungkinkan banyak pengguna mengedit dokumen yang sama secara bersamaan dengan perubahan yang langsung terlihat satu sama lain—seperti yang dilakukan di Google Docs. Ini akan mengubah pengalaman negosiasi kontrak Anda.

#### 1.0 Landasan Teknis: CRDT

Jantung dari real-time collaborative editing adalah struktur data yang dikenal sebagai **Conflict-Free Replicated Data Type (CRDT)**. CRDT memungkinkan setiap pengguna mengedit secara lokal, dan perubahan mereka akan "digabung" secara otomatis di latar belakang. Ini berbeda dengan pendekatan *Operational Transformation (OT)* (yang digunakan Google Docs) yang memerlukan server pusat untuk menentukan urutan operasi.

**Kesimpulan:** **CRDT** (diwakili oleh **Yjs**) adalah fondasi modern, andal, dan lebih mudah diimplementasikan untuk kasus penggunaan kontrak daripada harus membangun sistem OT dari awal.

#### 2.0 Pilihan Library & Framework

1.  **Yjs (Y.js):** Ini adalah pustaka CRDT paling populer dan matang dengan performa tinggi. Ini adalah pilihan utama untuk mengimplementasikan real-time editing.
2.  **Automerge:** Alternatif CRDT yang sangat baik dengan API yang lebih sederhana, bisa menjadi pilihan jika Anda menginginkan kemudahan implementasi.
3.  **@dabble/patches:** Pustaka TypeScript yang menyediakan OT, menjadi pilihan jika skenario kasus penggunaan Anda lebih kompleks atau Anda lebih familiar dengannya.

#### 3.0 Arsitektur Starndar untuk CMS

Berikut arsitektur yang direkomendasikan untuk fitur ini:

*   **Rich-Text Editor Frontend**: **Tiptap** atau **ProseMirror**. Tiptap adalah wrapper modern dari ProseMirror yang didesain untuk kolaborasi real-time.
*   **Real-time Backend**: **Hocuspocus**. Ini adalah backend kolaborasi yang secara native terintegrasi dengan Yjs, menangani otentikasi dan persistence.
*   **Komunikasi**: **WebSockets**. WebSockets menyediakan koneksi dua arah yang persisten, ideal untuk mentransmisikan operasi Yjs secara real-time dengan overhead yang minimal.
*   **Data Source**: **Shared Datatype (`Y.Text`, `Y.Array`, `Y.Map`)**. Yjs akan menyinkronkan struktur data ini secara otomatis ke semua klien yang terhubung.

#### 4.0 Alur Data Kolaborasi

1.  **Pengguna A & B membuka dokumen yang sama →** Keduanya terhubung ke server **Hocuspocus** via **WebSocket**.
2.  **Pengguna A mengetik "Halo" →** Editor (Tiptap) menangkap perubahan dan mengirimkannya ke **Yjs**.
3.  **Yjs menghasilkan sebuah "op" (operasi) →** "op" ini dikirim ke **Hocuspocus**.
4.  **Hocuspocus menyiarkan "op" ini ke Pengguna B →** **Yjs** di sisi Pengguna B menerima **CRDT** 'op' tersebut, menggabungkannya secara otomatis ke dokumen lokal tanpa konflik.
5.  **Awareness (Kursor & Kehadiran) →** **Yjs** juga mengirimkan data "awareness" (posisi kursor, nama pengguna, dll.), sehingga Pengguna B bisa melihat dengan tepat di mana Pengguna A sedang mengedit.

#### 5.0 Integrasi dengan CMS & Simpanan Legal

*   **Dokumen Final:** Setelah sesi kolaborasi selesai, konten dari editor dapat diekspor ke format PDF, ditandatangani dengan PSrE (Integrasi yang pernah kita bahas), dan dibubuhi e-meterai.
*   **Riwayat Versi:** Setiap **checkpoint** yang disimpan oleh Hocuspocus atau state dari Yjs dapat disimpan sebagai versi dokumen di database Anda, menciptakan jejak audit yang kaya layaknya sebuah revisi kontrak.
*   **Keamanan:** Pastikan koneksi WebSocket Anda diamankan dengan autentikasi yang sama dengan yang digunakan oleh API Anda, untuk memastikan hanya pengguna yang sah yang dapat bergabung ke sesi kolaborasi.

---

### 📝 Deskripsi Singkat untuk Spesifikasi Teknis

Jika Anda ingin mencantumkan fitur ini dalam dokumen spesifikasi, berikut adalah contoh deskripsi singkat yang bisa Anda gunakan:

> **Fitur 1: Advanced PDF Redlining & Versioning**
> Tingkatkan akurasi review kontrak dengan sistem perbandingan dokumen biner canggih. Sistem kami mengimplementasikan mesin perbandingan tingkat kata (*word-level diff engine*) untuk menyorot perubahan teks, gambar, dan format secara tepat di browser (*client-side*), memastikan privasi dan kecepatan. Untuk efisiensi penyimpanan, teknologi *binary delta encoding* (VCDIFF) digunakan untuk menyimpan hanya perbedaan antar versi, mengurangi kebutuhan ruang penyimpanan hingga lebih dari 90% dibandingkan dengan menyimpan seluruh dokumen utuh.
>
> **Fitur 2: Real-time Collaborative Editing Framework**
> Ciptakan ruang negosiasi kontrak yang dinamis dengan kemampuan edit waktu-nyata (*real-time*). Dibangun di atas *Conflict-free Replicated Data Type* (CRDT) Yjs, arsitektur ini memungkinkan banyak pengguna (Legal, Klien, Rekanan) untuk mengedit dokumen yang sama secara bersamaan, dengan setiap perubahan langsung disinkronkan secara otomatis dan bebas konflik. Platform ini menggunakan editor modern (Tiptap) untuk pengalaman menyerupai Google Docs, didukung oleh backend Hocuspocus untuk manajemen sesi, serta dilengkapi fitur 'awareness' (kursor bersama) untuk koordinasi tim yang lebih baik.

---

Berikut adalah struktur file dan folder lengkap untuk Contract Management System (CMS) dengan frontend **Next.js (App Router)** , backend **NestJS** (opsi utama) atau **FastAPI** (opsi alternatif), database **PostgreSQL**, serta fitur *redlining*, *binary diff PDF*, dan *real-time collaborative editing* (Yjs + Hocuspocus).

Struktur ini dirancang agar mudah dikembangkan, diuji, dan di-deploy.

---

## 📁 Root Project (Monorepo-style)

```
contract-management-system/
├── frontend/                 # Next.js 14+ (App Router)
├── backend/                  # NestJS (TypeScript) atau FastAPI (Python)
├── realtime/                 # Hocuspocus server untuk Yjs collaborative editing (Node.js)
├── shared/                   # Shared types, interfaces (opsional, jika monorepo)
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🎨 Frontend (Next.js) – `frontend/`

```
frontend/
├── public/                   # Static assets (favicon, images, etc.)
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Group routes untuk authentication
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/      # Dashboard setelah login
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── contracts/
│   │   │   │   ├── page.tsx          # List kontrak
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx      # Detail kontrak
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   └── page.tsx  # Edit kontrak (redlining)
│   │   │   │   │   ├── collaborate/
│   │   │   │   │   │   └── page.tsx  # Real-time collaborative edit
│   │   │   │   │   └── sign/
│   │   │   │   │       └── page.tsx  # Halaman tanda tangan
│   │   │   │   └── new/
│   │   │   │       └── page.tsx      # Buat kontrak baru
│   │   │   ├── templates/            # Template kontrak
│   │   │   │   └── page.tsx
│   │   │   ├── reports/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── api/              # Next.js API routes (proxy ke backend)
│   │   │   ├── auth/[...nextauth]/
│   │   │   │   └── route.ts          # NextAuth.js config
│   │   │   ├── contracts/
│   │   │   │   └── route.ts          # Proxy ke backend contract service
│   │   │   └── redlining/
│   │   │       └── route.ts
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # Shadcn/ui or custom atoms
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   ├── contracts/
│   │   │   ├── ContractList.tsx
│   │   │   ├── ContractDetail.tsx
│   │   │   ├── ContractForm.tsx
│   │   │   └── RedliningViewer.tsx   # Komponen diff viewer
│   │   ├── editor/
│   │   │   ├── CollaborativeEditor.tsx  # Wrapper Tiptap + Yjs
│   │   │   ├── YjsProvider.tsx          # Hocuspocus WebSocket provider
│   │   │   └── Awareness.tsx            # Menampilkan cursor kolaborator
│   │   ├── signature/
│   │   │   ├── SigningModal.tsx
│   │   │   └── MeteraiStamp.tsx
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       └── ProtectedRoute.tsx
│   ├── lib/                  # Utilities, hooks, API clients
│   │   ├── api-client.ts     # Axios/Fetch wrapper ke backend
│   │   ├── auth.ts           # JWT helper, session
│   │   ├── realtime-client.ts # Yjs / Hocuspocus config
│   │   ├── pdf-diff.ts       # Wrapper untuk BentoPDF atau @sqiu123/diff
│   │   ├── utils.ts
│   │   └── hooks/
│   │       ├── useContracts.ts
│   │       ├── useRedlining.ts
│   │       └── useCollaboration.ts
│   ├── types/                # TypeScript interfaces
│   │   ├── contract.ts
│   │   ├── user.ts
│   │   └── redlining.ts
│   └── styles/
│       └── tailwind.css
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── middleware.ts             # Auth middleware (protected routes)
```

---

## ⚙️ Backend (NestJS) – `backend/`

> **Alternatif FastAPI** akan diberikan setelah struktur NestJS.

```
backend/
├── src/
│   ├── main.ts               # Entry point (NestFactory)
│   ├── app.module.ts         # Root module
│   ├── common/               # Shared utilities
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── logging.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── decorators/
│   │       └── current-user.decorator.ts
│   ├── config/               # Konfigurasi (database, env)
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── app.config.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── dto/
│   │   │       └── update-user.dto.ts
│   │   ├── contracts/
│   │   │   ├── contracts.module.ts
│   │   │   ├── contracts.service.ts
│   │   │   ├── contracts.controller.ts
│   │   │   ├── entities/
│   │   │   │   ├── contract.entity.ts
│   │   │   │   ├── contract-version.entity.ts
│   │   │   │   └── contract-metadata.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-contract.dto.ts
│   │   │   │   └── update-contract.dto.ts
│   │   │   └── repositories/
│   │   ├── redlining/
│   │   │   ├── redlining.module.ts
│   │   │   ├── redlining.service.ts      # Business logic untuk redlining
│   │   │   ├── redlining.controller.ts
│   │   │   ├── entities/
│   │   │   │   ├── redlining-session.entity.ts
│   │   │   │   ├── redlining-change.entity.ts
│   │   │   │   └── redlining-comment.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-session.dto.ts
│   │   │   │   └── resolve-change.dto.ts
│   │   │   └── services/
│   │   │       ├── diff.service.ts      # Binary diff (xdelta3/librsync)
│   │   │       └── pdf-text-extractor.ts # Ekstrak teks dari PDF untuk diff
│   │   ├── documents/
│   │   │   ├── documents.module.ts
│   │   │   ├── documents.service.ts     # Upload ke S3/GCS, enkripsi
│   │   │   ├── documents.controller.ts
│   │   │   └── entities/
│   │   │       └── document.entity.ts
│   │   ├── signatures/
│   │   │   ├── signatures.module.ts
│   │   │   ├── signatures.service.ts    # Integrasi PrivyID/Peruri/Tilaka
│   │   │   ├── signatures.controller.ts
│   │   │   ├── entities/
│   │   │   │   └── signature-request.entity.ts
│   │   │   └── providers/
│   │   │       ├── privy.provider.ts
│   │   │       ├── peruri.provider.ts
│   │   │       └── tilaka.provider.ts
│   │   ├── e-meterai/
│   │   │   ├── e-meterai.module.ts
│   │   │   ├── e-meterai.service.ts     # Integrasi Mitrakas/Peruri API
│   │   │   ├── e-meterai.controller.ts
│   │   │   └── entities/
│   │   │       └── meterai-log.entity.ts
│   │   ├── notifications/
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.service.ts # SendGrid + WhatsApp
│   │   │   └── notifications.controller.ts
│   │   └── workflows/
│   │       ├── workflows.module.ts
│   │       ├── workflows.service.ts     # Approval workflow engine
│   │       └── entities/
│   │           ├── approval-workflow.entity.ts
│   │           └── approval-history.entity.ts
│   └── database/
│       ├── migrations/        # TypeORM migrations
│       ├── seeders/
│       └── data-source.ts     # TypeORM config
├── test/                      # Unit & e2e tests
├── .env
├── .env.example
├── Dockerfile
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

### 🔹 Alternatif Backend FastAPI (Python) – Struktur Ringkas

```
backend-fastapi/
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── database.py         # SQLAlchemy + asyncpg
│   │   ├── security.py         # JWT, hashing
│   │   └── dependencies.py
│   ├── api/
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── contracts.py
│   │   │   ├── redlining.py
│   │   │   ├── signatures.py
│   │   │   ├── e_meterai.py
│   │   │   └── notifications.py
│   │   └── deps.py
│   ├── models/                 # SQLAlchemy models
│   │   ├── user.py
│   │   ├── contract.py
│   │   ├── contract_version.py
│   │   ├── redlining_session.py
│   │   └── redlining_change.py
│   ├── schemas/                # Pydantic schemas
│   │   ├── contract.py
│   │   ├── redlining.py
│   │   └── user.py
│   ├── services/               # Business logic
│   │   ├── contract_service.py
│   │   ├── redlining_service.py
│   │   ├── diff_service.py      # Wrapper xdelta3, pdf-diff
│   │   ├── signature_service.py
│   │   └── meterai_service.py
│   ├── utils/
│   │   ├── s3_client.py
│   │   ├── email_sender.py
│   │   └── whatsapp.py
│   └── worker/                 # Background tasks (Celery/RQ)
│       └── tasks.py
├── alembic/                    # Migrations
├── requirements.txt
├── Dockerfile
└── .env
```

---

## 🔌 Real-time Collaborative Editing (Hocuspocus + Yjs) – `realtime/`

```
realtime/
├── src/
│   ├── index.ts               # Entry point Hocuspocus server
│   ├── server.ts              # Konfigurasi server
│   ├── database.ts            # Database adapter (PostgreSQL/Redis untuk persistence)
│   ├── auth.ts                # Authentication middleware (validasi JWT)
│   └── document.ts            # Custom document hooks (onLoad, onStore, etc.)
├── package.json
├── tsconfig.json
└── Dockerfile
```

Contoh minimal `realtime/src/index.ts`:

```typescript
import { Server } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import { PostgresDB } from './database';

const server = Server.configure({
  port: 1234,
  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        // Ambil state Yjs dari PostgreSQL
        return await PostgresDB.getYjsState(documentName);
      },
      store: async ({ documentName, state }) => {
        // Simpan state ke database
        await PostgresDB.saveYjsState(documentName, state);
      },
    }),
  ],
  async onAuthenticate(data) {
    // Verifikasi token JWT dari header Authorization
    const token = data.requestHeaders.authorization?.split(' ')[1];
    if (!token) throw new Error('Unauthorized');
    const payload = verifyJwt(token);
    return { user: payload };
  },
});

server.listen();
```

---

## 🐳 Docker Compose (`docker-compose.yml`)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: cms_user
      POSTGRES_PASSWORD: cms_pass
      POSTGRES_DB: cms_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cms_user"]
      interval: 5s

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    env_file:
      - ./backend/.env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started

  realtime:
    build: ./realtime
    ports:
      - "1234:1234"
    env_file:
      - ./realtime/.env
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env
    depends_on:
      - backend
      - realtime

volumes:
  postgres_data:
  redis_data:
```

---

## 📄 Catatan Penting untuk Tim Developer

1. **Binary Diff PDF** – Di backend, gunakan `xdelta3` (CLI) dipanggil via `child_process` atau library Node `node-xdelta`. Di frontend, gunakan **BentoPDF** via WebAssembly untuk visual diff.

2. **Real-time Collaboration** – Pastikan `realtime` service terhubung ke database yang sama dengan backend untuk menyimpan state Yjs. Gunakan **Yjs** dengan **Tiptap** di frontend.

3. **Enkripsi Dokumen** – Semua file PDF/docx yang diupload ke S3/GCS harus dienkripsi **AES-256** server-side (S3 default) atau client-side sebelum upload.

4. **Environment Variables** – Siapkan `.env` untuk masing-masing service (database URL, API keys PrivyID, SendGrid, dll.).

#

🛠️ Panduan Lengkap Instalasi & Konfigurasi CMS untuk Pasar Indonesia

Berikut adalah panduan langkah demi langkah untuk menginstal, mengonfigurasi, dan menjalankan Contract Management System (CMS) yang telah kita rancang, dengan fokus pada integrasi PSrE, e-Meterai, dan fitur kolaborasi real-time. Panduan ini akan membantu tim developer Anda memulai implementasi dengan cepat dan terstruktur.

---

## 📋 1. Persyaratan Sistem & Persiapan Lingkungan

Sebelum memulai, pastikan lingkungan pengembangan Anda memenuhi persyaratan berikut:

| Komponen | Minimum | Direkomendasikan | Keterangan |
|----------|---------|------------------|-------------|
| **Node.js** | v20.x | v22.x LTS | Untuk backend NestJS, frontend Next.js, dan realtime server |
| **Python** | 3.10 (opsional, jika pakai FastAPI) | 3.12+ | Hanya jika menggunakan backend FastAPI |
| **PostgreSQL** | 14.x | 15.x atau 16.x | Database utama |
| **Redis** | 6.x | 7.x | Untuk caching dan queue (Bull/RabbitMQ) |
| **Docker & Docker Compose** | v20.10+ | v24+ | Untuk development environment terisolasi |
| **Git** | 2.x | 2.40+ | Version control |

### 🔑 Akun & Kredensial yang Diperlukan

Sebelum memulai pengembangan, siapkan akun/API key berikut:

| Layanan | Kegunaan | Persiapan |
|---------|----------|------------|
| **PrivyID** atau **VIDA** atau **Peruri** | Certified digital signature | Registrasi sebagai merchant/partner di portal mereka |
| **Mitrakas** atau **Peruri Digital Security** | e-Meterai API | Daftar sebagai partner resmi di [peruri.co.id](https://www.peruri.co.id) atau mitrakas.com |
| **AWS** (S3) atau **Google Cloud Storage** | Upload & enkripsi dokumen | Buat bucket dengan enkripsi AES-256 |
| **SendGrid** | Email notifications | Daftar di sendgrid.com, verifikasi domain pengirim |
| **WhatsApp Business API** | WhatsApp notifications | Daftar di Meta Business Platform |

> **Poin Penting e-Meterai**: Gunakan Peruri Digital Security (PDS) untuk e-Meterai yang sah secara legal. Alternatif lain: PrivyID, VIDA, atau Mekari Sign sebagai mitra resmi Peruri.

---

## 🚀 2. Langkah Awal: Setup Proyek

### 🔧 2.1 Clone & Install Dependencies

```bash
# 1. Buat folder proyek
mkdir contract-management-system
cd contract-management-system

# 2. Clone struktur dasar (atau buat dari awal)
git clone <repository-url> .

# 3. Install dependencies untuk setiap service
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
cd realtime && npm install && cd ..
```

### 🐳 2.2 Setup Database & Container menggunakan Docker Compose

File `docker-compose.yml` telah disediakan sebelumnya. Jalankan dengan perintah:

```bash
# Start semua service (PostgreSQL, Redis)
docker-compose up -d postgres redis

# Tunggu hingga database siap (~10 detik)
sleep 10

# Jalankan migrasi database
cd backend
npm run migration:run  # atau: npx typeorm migration:run
cd ..
```

### 📄 2.3 Setup Environment Variables

Salin file `.env.example` menjadi `.env` untuk setiap service dan isi nilai yang sesuai.

**Root `.env` (untuk docker-compose, opsional):**
```env
# Database
POSTGRES_USER=cms_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=cms_db

# Redis
REDIS_PORT=6379

# Backend API
API_PORT=3001

# Next.js App
APP_PORT=3000

# Realtime Server (Hocuspocus)
REALTIME_PORT=1234
```

---

## 🖥️ 3. Konfigurasi Backend NestJS

### 📄 3.1 File Konfigurasi Utama (`backend/.env`)

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=development
PORT=3001
APP_NAME=CMS-Backend
API_PREFIX=/api/v1

# ============================================
# DATABASE (PostgreSQL)
# ============================================
DB_HOST=localhost          # Gunakan 'postgres' jika via docker-compose
DB_PORT=5432
DB_USER=cms_user
DB_PASSWORD=your_secure_password
DB_NAME=cms_db
DB_SYNC=false              # JANGAN true di production! Pakai migration
DB_LOGGING=true

# ============================================
# REDIS (untuk queue & cache)
# ============================================
REDIS_HOST=localhost       # Gunakan 'redis' jika via docker-compose
REDIS_PORT=6379
REDIS_PASSWORD=

# ============================================
# JWT AUTHENTICATION
# ============================================
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=30d

# ============================================
# AWS S3 / CLOUD STORAGE (untuk dokumen kontrak)
# ============================================
AWS_REGION=ap-southeast-3   # Jakarta region
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=cms-documents
AWS_S3_ENDPOINT=https://s3.ap-southeast-3.amazonaws.com
S3_SSE_TYPE=AES256          # Server-Side Encryption AES-256
```

> **Poin Penting Enkripsi S3**: Gunakan SSE-S3 (AES-256) untuk enkripsi default pada semua dokumen. Anda dapat mengaktifkannya di bucket properties atau melalui parameter `ServerSideEncryption: 'AES256'` pada setiap upload.

### 🔐 3.2 Integrasi PSrE (PrivyID / VIDA / Peruri)

Ada tiga opsi PSrE yang tersertifikasi di Indonesia: PrivyID (direkomendasikan untuk integrasi API yang matang), VIDA (cocok untuk enterprise skala besar), dan Peruri PDS (khusus untuk instansi pemerintah/BUMN). PrivyID telah dipercaya oleh lebih dari 156 juta dokumen yang ditandatangani secara digital di Indonesia.

**Pilih salah satu penyedia PSrE di bawah ini:**

#### Opsi 1: Konfigurasi PrivyID (Direkomendasikan)

```env
# backend/.env - Tambahkan
# ============================================
# PRIVYID INTEGRATION (Certified Electronic Signature)
# ============================================
PRIVY_API_BASE_URL=https://api.privy.id
PRIVY_CLIENT_ID=your_privy_client_id
PRIVY_CLIENT_SECRET=your_privy_client_secret
PRIVY_API_VERSION=v1
PRIVY_REDIRECT_URI=https://your-domain.com/api/v1/signatures/callback
```

**Integrasi PrivyID di NestJS (`backend/src/modules/signatures/providers/privy.provider.ts`):**

```typescript
import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class PrivyProvider {
  constructor(private http: HttpService) {}

  async createSigningRequest(
    documentUrl: string,
    signers: Array<{ email: string; name: string }>,
  ) {
    const auth = Buffer.from(
      `${process.env.PRIVY_CLIENT_ID}:${process.env.PRIVY_CLIENT_SECRET}`,
    ).toString('base64');

    const response = await this.http.axiosRef.post(
      `${process.env.PRIVY_API_BASE_URL}/api/${process.env.PRIVY_API_VERSION}/signing-requests`,
      {
        document_url: documentUrl,
        signers: signers.map((s) => ({
          email: s.email,
          name: s.name,
          method: 'digital_signature',
        })),
        redirect_url: process.env.PRIVY_REDIRECT_URI,
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  }

  async getSigningStatus(requestId: string) {
    const auth = Buffer.from(
      `${process.env.PRIVY_CLIENT_ID}:${process.env.PRIVY_CLIENT_SECRET}`,
    ).toString('base64');
    const response = await this.http.axiosRef.get(
      `${process.env.PRIVY_API_BASE_URL}/api/${process.env.PRIVY_API_VERSION}/signing-requests/${requestId}`,
      { headers: { Authorization: `Basic ${auth}` } },
    );
    return response.data;
  }
}
```

#### Opsi 2: Peruri Digital Security (PDS) untuk e-Meterai

```env
# backend/.env - Tambahkan untuk e-Meterai via Peruri
# ============================================
# PERURI E-METERAI INTEGRATION
# ============================================
PERURI_API_BASE_URL=https://api.peruri.co.id/v1
PERURI_CLIENT_ID=your_peruri_client_id
PERURI_CLIENT_SECRET=your_peruri_client_secret
PERURI_VENDOR_CODE=YOUR_VENDOR_CODE
```

> **Catatan Penting e-Meterai**: Peruri Digital Security (PDS) adalah distributor resmi e-Meterai yang ditunjuk secara resmi. Untuk integrasi yang lebih mudah, Anda juga dapat menggunakan **Mekari Sign** sebagai mitra resmi Peruri yang menyediakan API e-Meterai yang dapat diintegrasikan langsung.

### 📧 3.3 Konfigurasi Notifikasi (SendGrid & WhatsApp)

```env
# backend/.env - Tambahkan
# ============================================
# SENDGRID EMAIL NOTIFICATIONS
# ============================================
SENDGRID_API_KEY=SG.your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@your-domain.com
SENDGRID_FROM_NAME=Contract Management System

# ============================================
# WHATSAPP BUSINESS API
# ============================================
WHATSAPP_API_BASE_URL=https://graph.facebook.com/v18.0
WHATSAPP_ACCESS_TOKEN=EAA...
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_BUSINESS_ACCOUNT_ID=456789012345678
```

**Contoh implementasi email di NestJS (`backend/src/modules/notifications/notifications.service.ts`):**

```typescript
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class NotificationsService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendContractNotification(to: string, contractTitle: string, status: string) {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `Contract Update: ${contractTitle}`,
      templateId: 'd-xxxxxx', // Gunakan Dynamic Template ID
      dynamicTemplateData: {
        contract_title: contractTitle,
        status: status,
        dashboard_url: `${process.env.APP_URL}/contracts`,
      },
    };
    await sgMail.send(msg);
  }
}
```

---

## 🎨 4. Konfigurasi Frontend (Next.js)

### 📄 4.1 Environment Variables (`frontend/.env`)

```env
# ============================================
# NEXT.JS CONFIGURATION
# ============================================
NEXT_PUBLIC_APP_NAME=CMS
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ============================================
# REALTIME COLLABORATION (Hocuspocus)
# ============================================
NEXT_PUBLIC_REALTIME_WS_URL=ws://localhost:1234

# ============================================
# AUTHENTICATION (NextAuth.js)
# ============================================
NEXTAUTH_SECRET=your_nextauth_secret_key_min_32_chars
NEXTAUTH_URL=http://localhost:3000
```

### 🔐 4.2 Setup Middleware untuk Proteksi Route (`frontend/middleware.ts`)

Berikut adalah konfigurasi middleware lengkap dengan proteksi JWT menggunakan cookies, yang disusun berdasarkan best practice modern untuk Next.js App Router:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Daftar route yang bisa diakses tanpa login
const publicRoutes = ['/login', '/register', '/forgot-password', '/api/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati middleware untuk asset statis
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Cek apakah route termasuk public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const token = request.cookies.get('token')?.value;

  // Jika belum login mencoba akses protected route
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah login mencoba akses halaman login
  if (token && isPublicRoute && pathname !== '/api/auth') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Verifikasi JWT jika ada token
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
      await jwtVerify(token, secret);
    } catch (error) {
      // Token invalid, hapus cookie dan redirect ke login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

> **Best Practice**: Untuk production, gunakan library `next-auth` dengan Prisma adapter untuk autentikasi yang lebih lengkap. Contoh implementasi lengkap bisa ditemukan di repositori [auth-nextjs-prisma](https://github.com/Kehinde13/auth-nextjs-prisma) yang mencakup sign-up, login, logout, dan protected routes.

---

## 🔄 5. Konfigurasi Realtime Collaborative Editing

### 📄 5.1 Environment Variables (`realtime/.env`)

```env
# ============================================
# HOCUSPOCUS REALTIME SERVER
# ============================================
PORT=1234
NODE_ENV=development

# Database untuk persistence Yjs state
DATABASE_URL=postgresql://cms_user:your_secure_password@localhost:5432/cms_db

# Redis untuk awareness & message brokering
REDIS_URL=redis://localhost:6379

# JWT Secret (sama dengan backend untuk verifikasi)
JWT_SECRET=your_super_secret_jwt_key_change_this
```

### 📝 5.2 Hocuspocus Server Setup (`realtime/src/index.ts`)

Berdasarkan dokumentasi Tiptap dan Hocuspocus, arsitektur ini menggunakan **Yjs untuk menangani konsistensi data** melalui algoritma CRDT (Conflict-free Replicated Data Type), sementara **Hocuspocus berfungsi sebagai server kolaborasi untuk jaringan sinkronisasi**.

```typescript
import { Server } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import { Logger } from '@hocuspocus/extension-logger';
import { Redis } from '@hocuspocus/extension-redis';
import { Pool } from 'pg';

const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Simpan Yjs document state ke PostgreSQL
async function saveDocument(documentName: string, state: Uint8Array) {
  await dbPool.query(
    `INSERT INTO yjs_documents (document_name, state, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (document_name)
     DO UPDATE SET state = $2, updated_at = NOW()`,
    [documentName, state],
  );
}

// Ambil Yjs document state dari database
async function loadDocument(documentName: string): Promise<Uint8Array | null> {
  const result = await dbPool.query(
    'SELECT state FROM yjs_documents WHERE document_name = $1',
    [documentName],
  );
  return result.rows[0]?.state || null;
}

const server = Server.configure({
  port: parseInt(process.env.PORT || '1234'),
  extensions: [
    new Logger(),
    new Database({
      fetch: async ({ documentName }) => {
        return await loadDocument(documentName);
      },
      store: async ({ documentName, state }) => {
        await saveDocument(documentName, state);
      },
    }),
    new Redis({
      prefix: 'hocuspocus',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
  ],
  async onAuthenticate(data) {
    // Verifikasi token JWT dari frontend
    const token = data.requestHeaders.authorization?.split(' ')[1];
    if (!token) throw new Error('Unauthorized');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { user: decoded };
    } catch {
      throw new Error('Invalid token');
    }
  },
  async onConnect(data) {
    console.log(`User ${data.context.user?.id} connected to document ${data.documentName}`);
    return data;
  },
});

server.listen();
console.log(`Hocuspocus server running on port ${process.env.PORT}`);
```

### 🗃️ 5.3 Tabel Database untuk Yjs State

Jalankan migration berikut di PostgreSQL:

```sql
-- Tabel untuk menyimpan Yjs document state (binary/bytea)
CREATE TABLE IF NOT EXISTS yjs_documents (
    document_name VARCHAR(255) PRIMARY KEY,
    state BYTEA NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk query yang lebih cepat
CREATE INDEX idx_yjs_documents_updated ON yjs_documents(updated_at);
```

---

## 🔄 6. Migrasi Database & Seeding

### 📝 6.1 Membuat Migration di NestJS

```bash
cd backend

# Generate migration baru (TypeORM)
npm run migration:generate -- -n CreateInitialTables

# Atau jika menggunakan TypeORM CLI langsung
npx typeorm migration:generate src/database/migrations/CreateInitialTables -d src/database/data-source.ts

# Jalankan migration
npm run migration:run

# Rollback migration jika perlu
npm run migration:revert
```

### 🌱 6.2 Seeding Data Awal

Buat file seeder untuk data dasar (role, template kontrak, clause library):

```typescript
// backend/src/database/seeders/seed.ts
import { DataSource } from 'typeorm';
import { dataSource } from '../data-source';

async function seed() {
  await dataSource.initialize();

  // Seed roles
  const roles = ['admin', 'legal', 'procurement', 'hr', 'finance', 'signer'];
  for (const role of roles) {
    await dataSource.query(
      `INSERT INTO roles (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
      [role],
    );
  }

  // Seed admin user (password: Admin123!)
  await dataSource.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ('admin@cms.com', '$2b$10$...', 'System Administrator', 'admin')
     ON CONFLICT (email) DO NOTHING`,
  );

  console.log('✅ Seeding completed');
  await dataSource.destroy();
}

seed().catch(console.error);
```

Jalankan seeder:
```bash
npm run seed
```

---

## 🚢 7. Deployment ke Production

### ☁️ 7.1 Build & Optimasi

```bash
# Build semua service
cd frontend && npm run build && cd ..
cd backend && npm run build && cd ..
cd realtime && npm run build && cd ..
```

### 🐳 7.2 Production Docker Compose

File `docker-compose.prod.yml` untuk environment live:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - cms_network
    restart: always

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - cms_network
    restart: always

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    env_file:
      - ./backend/.env.production
    depends_on:
      - postgres
      - redis
    networks:
      - cms_network
    restart: always

  realtime:
    build: ./realtime
    ports:
      - "1234:1234"
    env_file:
      - ./realtime/.env.production
    depends_on:
      - postgres
      - redis
    networks:
      - cms_network
    restart: always

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env.production
    depends_on:
      - backend
      - realtime
    networks:
      - cms_network
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
      - realtime
    networks:
      - cms_network
    restart: always

networks:
  cms_network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

### 📦 7.3 Checklist Deployment Production

| ✅ | Item | Aktivitas |
|----|------|-----------|
| ☐ | **Security** | Ganti semua secret keys (JWT, API keys) dengan nilai production yang kuat |
| ☐ | **Database** | Gunakan managed database (RDS, Cloud SQL) untuk production, bukan container |
| ☐ | **SSL/TLS** | Pasang SSL certificate untuk domain (gunakan Let's Encrypt) |
| ☐ | **CDN** | Konfigurasi CloudFront atau Cloud CDN untuk asset statis |
| ☐ | **Monitoring** | Setup logging (ELK/Loki) dan alerting (Prometheus + Grafana) |
| ☐ | **Backup** | Jadwalkan backup database & S3 bucket secara otomatis |
| ☐ | **Rate Limiting** | Aktifkan rate limiting di API gateway (Nginx/Kong) |
| ☐ | **WAF** | Pasang Web Application Firewall untuk proteksi dari serangan |

---

## 🧪 8. Testing & Verifikasi

### 🔬 8.1 Cek End-to-End Flow

Setelah semua service berjalan, verifikasi:

1. **Frontend**: Buka `http://localhost:3000` → Halaman login muncul
2. **Backend Health**: `curl http://localhost:3001/api/v1/health` → `{ "status": "ok" }`
3. **Realtime Server**: Cek koneksi WebSocket ke `ws://localhost:1234`
4. **Upload Dokumen**: Upload PDF → Cek file tersimpan di S3 dengan enkripsi
5. **Redlining**: Bandingkan dua versi dokumen → Diff tampil dengan highlight
6. **e-Sign**: Kirim kontrak ke PrivyID → Link signature valid
7. **e-Meterai**: Tempel e-Meterai melalui API Peruri → Verifikasi sah secara hukum
8. **Collaboration**: Buka dokumen di dua browser berbeda → Perubahan terlihat real-time

---

## ❓ 9. Troubleshooting Umum

| Masalah | Kemungkinan Penyebab | Solusi |
|---------|---------------------|--------|
| `ECONNREFUSED` connect to PostgreSQL | Database belum ready atau credential salah | Cek `docker-compose logs postgres`, pastikan environment variable DB_PASSWORD sesuai |
| JWT signature invalid | Secret key tidak match antara frontend & backend | Pastikan `JWT_SECRET` sama di semua service |
| Upload file gagal ke S3 | IAM role/permission kurang | Verifikasi IAM user memiliki `s3:PutObject` dan `s3:GetObject` |
| WebSocket connection failed | Port 1234 diblokir firewall atau CORS | Buka port 1234 (TCP), tambahkan CORS headers di frontend |
| e-Meterai gagal diterapkan | API key Peruri expired atau quota habis | Login dashboard Peruri, cek sisa quota dan regenerasi API key |

---
