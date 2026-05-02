# Forum API

REST API untuk aplikasi forum diskusi, dibangun dengan Hapi.js dan PostgreSQL. Mendukung autentikasi JWT, thread, komentar, balasan, like, dan notifikasi.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Hapi.js v20
- **Database**: PostgreSQL (Supabase)
- **Auth**: JWT (`@hapi/jwt`)
- **Deploy**: Railway
- **Lainnya**: bcrypt, nanoid, rate-limiter-flexible

---

## Prasyarat

- Node.js >= 14
- PostgreSQL (atau akun Supabase)
- Akun Railway (untuk deploy)

---

## Instalasi

```bash
# Clone repo
git clone https://github.com/username/forum-api.git
cd forum-api

# Install dependensi
npm install

# Salin file environment
cp .env.example .env
```

---

## Konfigurasi Environment

Buat file `.env` di root project:

```env
# Server
HOST=localhost
PORT=5000

# Database (Supabase)
PGHOST=db.xxxx.supabase.co
PGPORT=5432
PGDATABASE=postgres
PGUSER=postgres
PGPASSWORD=your_password

# JWT
ACCESS_TOKEN_KEY=your_access_token_secret_key
REFRESH_TOKEN_KEY=your_refresh_token_secret_key
ACCESS_TOKEN_AGE=1800
```

---

## Migrasi Database

```bash
# Jalankan migrasi
npm run migrate up

# Rollback migrasi
npm run migrate down
```

---

## Menjalankan Aplikasi

```bash
# Development (dengan nodemon)
npm run dev

# Production
npm start

# Menjalankan test
npm test
```

---

## Endpoint API

Base URL: `https://your-app.railway.app`

> Endpoint yang ditandai 🔒 memerlukan header `Authorization: Bearer <accessToken>`.

### Authentication

| Method   | Endpoint           | Auth | Deskripsi                                 |
| -------- | ------------------ | ---- | ----------------------------------------- |
| `POST`   | `/authentications` | —    | Login, mendapatkan access & refresh token |
| `PUT`    | `/authentications` | —    | Refresh access token                      |
| `DELETE` | `/authentications` | —    | Logout, menghapus refresh token           |

### Users

| Method | Endpoint    | Auth | Deskripsi                               |
| ------ | ----------- | ---- | --------------------------------------- |
| `POST` | `/users`    | —    | Registrasi pengguna baru                |
| `GET`  | `/users/me` | 🔒   | Ambil profil pengguna yang sedang login |

### Threads

| Method | Endpoint              | Auth | Deskripsi                                      |
| ------ | --------------------- | ---- | ---------------------------------------------- |
| `POST` | `/threads`            | 🔒   | Buat thread baru                               |
| `GET`  | `/threads`            | —    | Ambil semua thread                             |
| `GET`  | `/threads/{threadId}` | —    | Ambil detail thread beserta komentar & balasan |
| `GET`  | `/threads/me`         | 🔒   | Ambil thread milik pengguna yang sedang login  |

### Comments

| Method   | Endpoint                                   | Auth | Deskripsi                      |
| -------- | ------------------------------------------ | ---- | ------------------------------ |
| `POST`   | `/threads/{threadId}/comments`             | 🔒   | Tambah komentar ke thread      |
| `DELETE` | `/threads/{threadId}/comments/{commentId}` | 🔒   | Hapus komentar (hanya pemilik) |

### Replies

| Method   | Endpoint                                                     | Auth | Deskripsi                     |
| -------- | ------------------------------------------------------------ | ---- | ----------------------------- |
| `POST`   | `/threads/{threadId}/comments/{commentId}/replies`           | 🔒   | Balas komentar                |
| `DELETE` | `/threads/{threadId}/comments/{commentId}/replies/{replyId}` | 🔒   | Hapus balasan (hanya pemilik) |

### Likes

| Method | Endpoint                                         | Auth | Deskripsi                     |
| ------ | ------------------------------------------------ | ---- | ----------------------------- |
| `PUT`  | `/threads/{threadId}/comments/{commentId}/likes` | 🔒   | Toggle like / unlike komentar |

### Notifications

| Method  | Endpoint                               | Auth | Deskripsi                              |
| ------- | -------------------------------------- | ---- | -------------------------------------- |
| `GET`   | `/notifications`                       | 🔒   | Ambil semua notifikasi milik pengguna  |
| `PATCH` | `/notifications/{notificationId}/read` | 🔒   | Tandai satu notifikasi sebagai dibaca  |
| `PATCH` | `/notifications/read-all`              | 🔒   | Tandai semua notifikasi sebagai dibaca |

---

## Contoh Request

### Login

```bash
curl -X POST https://your-app.railway.app/authentications \
  -H "Content-Type: application/json" \
  -d '{"username": "johndoe", "password": "rahasia123"}'
```

Response:

```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### Buat Thread

```bash
curl -X POST https://your-app.railway.app/threads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"title": "Judul Thread", "body": "Isi thread..."}'
```

---

## Lisensi

MIT
