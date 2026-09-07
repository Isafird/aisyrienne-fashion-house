-- ============================================================
-- Skema database untuk Toko Online (Buket Bunga & Fashion)
-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor
-- ============================================================

-- 1) TABEL PRODUK
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('buket', 'fashion')),
  price numeric not null check (price >= 0),
  description text not null default '',
  image_url text not null default '',
  created_at timestamptz not null default now()
);

-- 2) TABEL ULASAN
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now()
);

-- 3) TABEL PENGATURAN TOKO (hanya 1 baris, id selalu 1)
create table if not exists settings (
  id int primary key default 1,
  store_name text not null default 'Aisyrienne Fashion House',
  tagline text not null default 'Buket segar dan pilihan fashion favorit, pesan langsung lewat WhatsApp.',
  wa_number text not null default '6281234567890',
  constraint settings_singleton check (id = 1)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Semua orang boleh membaca produk/ulasan/pengaturan, dan boleh
-- mengirim ulasan baru. Hanya user yang login (admin) yang boleh
-- menambah/ubah/hapus produk, menghapus ulasan, dan mengubah
-- pengaturan toko.
-- ============================================================

alter table products enable row level security;
alter table reviews enable row level security;
alter table settings enable row level security;

-- Produk: baca publik, tulis khusus admin (user login)
create policy "products_public_read" on products
  for select using (true);
create policy "products_admin_write" on products
  for insert with check (auth.role() = 'authenticated');
create policy "products_admin_update" on products
  for update using (auth.role() = 'authenticated');
create policy "products_admin_delete" on products
  for delete using (auth.role() = 'authenticated');

-- Ulasan: baca publik, kirim publik (siapa saja boleh review), hapus khusus admin
create policy "reviews_public_read" on reviews
  for select using (true);
create policy "reviews_public_insert" on reviews
  for insert with check (true);
create policy "reviews_admin_delete" on reviews
  for delete using (auth.role() = 'authenticated');

-- Pengaturan: baca publik, ubah khusus admin
create policy "settings_public_read" on settings
  for select using (true);
create policy "settings_admin_update" on settings
  for update using (auth.role() = 'authenticated');
create policy "settings_admin_insert" on settings
  for insert with check (auth.role() = 'authenticated');

-- ============================================================
-- DATA AWAL (contoh produk, boleh dihapus/diubah dari panel admin)
-- ============================================================

insert into settings (id, store_name, tagline, wa_number)
values (1, 'Aisyrienne Fashion House', 'Koleksi busana dan rangkaian bunga pilihan untuk momen-momen terbaik kamu — lihat ulasan pelanggan lain, lalu pesan langsung lewat WhatsApp.', '6281234567890')
on conflict (id) do nothing;

insert into products (name, category, price, description, image_url) values
  ('Buket Mawar Merah Klasik', 'buket', 185000, 'Dua belas tangkai mawar merah segar dibungkus kertas kraft dan pita satin, cocok untuk hari jadi atau ungkapan cinta.', ''),
  ('Buket Bunga Matahari Ceria', 'buket', 165000, 'Rangkaian bunga matahari cerah dengan daun eukaliptus, pas untuk hadiah ulang tahun atau selamat wisuda.', ''),
  ('Buket Pastel Mix Flower', 'buket', 210000, 'Kombinasi mawar, baby breath, dan bunga lokal warna pastel, terlihat lembut dan elegan.', ''),
  ('Outer Rajut Rosa', 'fashion', 139000, 'Outer rajut warna dusty rose, bahan adem, cocok dipakai kerja maupun santai.', ''),
  ('Dress Linen Sage', 'fashion', 189000, 'Dress linen potongan longgar warna sage, nyaman untuk cuaca panas dan gampang dipadukan.', ''),
  ('Tote Bag Kanvas Motif Bunga', 'fashion', 79000, 'Tote bag kanvas tebal dengan sablon motif bunga, muat laptop 13 inci.', '')
on conflict do nothing;
