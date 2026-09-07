# Aisyrienne Fashion House — Toko Online Busana & Rangkaian Bunga

Website React + Supabase untuk toko buket bunga & fashion. Fitur: katalog produk,
rating & ulasan dari pengunjung, pemesanan lewat WhatsApp, dan panel admin
(login asli via Supabase Auth) untuk kelola produk, moderasi ulasan, dan
pengaturan toko.

Kenapa Supabase? Karena situs ini di-deploy sebagai file statis di GitHub
Pages (tidak ada server sendiri), jadi login & data admin butuh backend
terpisah supaya sandi tidak ikut ter-publish di kode. Supabase menyediakan
autentikasi + database Postgres gratis yang cocok untuk kebutuhan ini.

## 1. Buat project Supabase

1. Daftar/masuk di https://supabase.com dan buat project baru (gratis).
2. Buka **SQL Editor**, tempel seluruh isi file `supabase/schema.sql` dari
   folder ini, lalu jalankan (Run). Ini akan membuat tabel `products`,
   `reviews`, `settings`, mengatur Row Level Security, dan mengisi beberapa
   produk contoh.
3. Buka **Authentication > Users > Add user**, buat satu akun untuk admin
   (isi email & password sendiri, misalnya `admin@tokokamu.com`). Akun inilah
   yang dipakai untuk login di panel admin — bukan email publik pembeli.
4. Buka **Project Settings > API**, salin `Project URL` dan `anon public key`.

## 2. Konfigurasi project lokal

```bash
npm install
cp .env.example .env
```

Isi `.env` dengan nilai dari langkah 1.4:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

`anon key` ini memang didesain aman untuk ditaruh di frontend/publik — yang
menjaga keamanan data adalah aturan Row Level Security di database, bukan
kerahasiaan key ini.

Jalankan untuk melihat hasilnya di lokal:

```bash
npm run dev
```

## 3. Sebelum deploy ke GitHub Pages

Buka `vite.config.js` dan ganti:

```js
base: '/toko-online/',
```

menjadi `/<nama-repo-github-kamu>/` (harus sama persis dengan nama repo,
diapit garis miring). Kalau situs akan diakses dari domain custom atau dari
root `namamu.github.io`, ganti jadi `base: '/'`.

## 4. Deploy otomatis lewat GitHub Actions

Repo ini sudah menyertakan `.github/workflows/deploy.yml` yang otomatis
build & publish setiap kali kamu push ke branch `main`.

1. Push project ini ke repo GitHub kamu.
2. Di repo GitHub: **Settings > Secrets and variables > Actions > New
   repository secret**, tambahkan dua secret:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   (isinya sama seperti di file `.env` lokal kamu)
3. Di repo GitHub: **Settings > Pages**, pada "Build and deployment" pilih
   source **GitHub Actions**.
4. Push ke `main` — workflow akan build otomatis dan situs akan tersedia di
   `https://<username>.github.io/<nama-repo>/`.

Kalau lebih suka deploy manual tanpa GitHub Actions, jalankan `npm run
build` lalu publish isi folder `dist/` ke branch `gh-pages` (misalnya pakai
paket `gh-pages`), tapi pastikan `.env` sudah terisi benar sebelum build
karena nilainya ikut "dibakar" ke dalam file hasil build.

## Struktur fitur

- **Toko (publik)** — katalog produk dengan filter kategori & pencarian,
  detail produk, form ulasan (siapa saja boleh mengirim), tombol pesan yang
  membuka WhatsApp dengan pesan otomatis.
- **Admin** (`Masuk sebagai admin` di pojok kanan atas, login pakai email +
  password dari langkah 1.3):
  - Tambah / ubah / hapus produk
  - Hapus ulasan yang tidak pantas
  - Ubah nama toko, tagline, nomor WhatsApp
  - Ganti kata sandi admin sendiri
- Aturan akses (siapa boleh apa) diatur di `supabase/schema.sql` lewat Row
  Level Security — bukan di kode frontend — jadi aman dipublikasikan sebagai
  situs statis.

## Batasan yang masih ada

- Belum ada keranjang/checkout — pemesanan sepenuhnya lewat WhatsApp sesuai
  permintaan awal.
- Produk tanpa `image_url` akan memakai ilustrasi placeholder otomatis —
  isi `image_url` di form produk dengan link foto asli untuk hasil terbaik.
- Kalau butuh lebih dari satu akun admin, tambahkan user lagi lewat
  Authentication > Users di dashboard Supabase — semua yang berhasil login
  otomatis punya akses admin penuh.
