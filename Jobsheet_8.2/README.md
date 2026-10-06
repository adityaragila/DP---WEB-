# Jobsheet 8 — Koneksi PostgreSQL (SIMPUS-Mini)

Sub-CPMK: Menghubungkan aplikasi dengan basis data PostgreSQL.

## Ringkasan Perubahan dari Jobsheet 7
Pada Jobsheet 8, penyimpanan data yang sebelumnya bersifat sementara di sesi browser (`$_SESSION`) kini diintegrasikan secara penuh dan permanen menggunakan basis data **PostgreSQL** melalui driver **PDO (PHP Data Objects)**.

1. **Skema Database (`sql/01_buku_anggota.sql`)**:
   - DDL untuk tabel `buku` (`id SERIAL PRIMARY KEY`, `judul`, `pengarang`, `tahun`, `isbn`, `stok`, `kategori`).
   - DDL untuk tabel `anggota` (`id SERIAL PRIMARY KEY`, `nama`, `no_anggota` dengan batasan `UNIQUE`, `alamat`, `no_hp`).
2. **Koneksi Database (`includes/koneksi.php`)**:
   - Menghubungkan aplikasi PHP ke PostgreSQL menggunakan `PDO("pgsql:host=...;port=...;dbname=...")`.
   - Konfigurasi penanganan kesalahan berbasis exception (`PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION`).
3. **Penyimpanan Data Menggunakan Prepared Statement**:
   - `buku/proses_tambah.php`: Mengganti penyimpanan array `$_SESSION` dengan `INSERT INTO buku (...) VALUES (...) RETURNING id` menggunakan prepared statement (`prepare` & `execute`) demi mencegah celah SQL Injection.
   - `anggota/proses_tambah.php`: Mengganti penyimpanan `$_SESSION` dengan `INSERT INTO anggota (...) VALUES (...) RETURNING id` disertai penanganan exception untuk pelanggaran batasan `UNIQUE` pada `no_anggota`.
4. **Pembacaan Data Dinamis dari Database**:
   - `buku/list.php` & `anggota/list.php`: Mengambil data dari database dengan query `SELECT * FROM ... ORDER BY id DESC` via PDO `fetchAll(PDO::FETCH_ASSOC)`.
   - `index.php`: Statistik "Total Buku" dan "Total Anggota" diambil secara dinamis dan efisien menggunakan fungsi agregat SQL `SELECT COUNT(*) FROM ...` via PDO `fetchColumn()`.
5. **Desain & Antarmuka**:
   - Desain CSS, pewarnaan, dan layout sepenuhnya konsisten dan dipertahankan dari Jobsheet 7 (`assets/css/style.css`).

---

## Struktur Folder
```
Jobsheet_8.2/
├── index.php                # Beranda & kartu statistik dari SELECT COUNT(*)
├── includes/
│   ├── header.php           # Navigasi & header terpadu (path otomatis relatif)
│   ├── footer.php           # Penutup HTML & pemuatan script JS
│   └── koneksi.php          # Koneksi PDO driver pgsql ke PostgreSQL
├── sql/
│   └── 01_buku_anggota.sql  # DDL skema tabel buku dan anggota
├── buku/
│   ├── list.php             # Tabel data buku (SELECT * ORDER BY id DESC)
│   ├── tambah.php           # Form penambahan data buku
│   └── proses_tambah.php    # Pemrosesan INSERT buku via Prepared Statement
├── anggota/
│   ├── list.php             # Tabel data anggota (SELECT * ORDER BY id DESC)
│   ├── tambah.php           # Form penambahan data anggota
│   └── proses_tambah.php    # Pemrosesan INSERT anggota via Prepared Statement
├── assets/
│   ├── css/
│   │   └── style.css        # Desain stylesheet utama (konsisten dari Jobsheet 7)
│   └── js/
│       └── app.js           # Script client-side interaktif (toggle nav, pencarian)
├── docs/
│   └── wireframe.md         # Rancangan wireframe dan user flow SIMPUS-Mini
├── README.md                # Dokumentasi petunjuk jobsheet ini
└── Dokumentasi/
    └── README.md            # Penjelasan modul materi teoritis & teknis
```

---

## Persiapan Basis Data (PostgreSQL)

Sebelum menjalankan aplikasi di browser, pastikan database dan tabel sudah dibuat:

### 1. Pastikan Ekstensi `pdo_pgsql` Aktif di PHP
Periksa file `php.ini` (misal di Laragon `bin/php/php-8.x.x/php.ini`):
Hilangkan tanda titik koma (`;`) pada baris:
```ini
extension=pdo_pgsql
extension=pgsql
```
Lalu restart web server (Apache / Laragon).

### 2. Buat Database
Buka terminal / CMD / psql lalu buat database baru:
```bash
createdb -U postgres simpus_mini
```
*(atau jalankan `CREATE DATABASE simpus_mini;` di pgAdmin / HeidiSQL / psql)*.

### 3. Eksekusi Skema Tabel SQL
Jalankan file skema SQL ke database `simpus_mini`:
```bash
psql -U postgres -d simpus_mini -f sql/01_buku_anggota.sql
```
*(atau impor/jalankan isi file `sql/01_buku_anggota.sql` lewat query tool di pgAdmin / DBeaver / HeidiSQL)*.

### 4. Sesuaikan Kredensial di `includes/koneksi.php`
Buka `includes/koneksi.php` dan sesuaikan `$user` dan `$pass` jika password PostgreSQL di komputer Anda berbeda:
```php
$host = "localhost";
$port = "5432";
$db   = "simpus_mini";
$user = "postgres";  // sesuaikan dengan user Anda
$pass = "postgres";  // sesuaikan dengan password Anda
```

---

## Cara Menjalankan

### Opsi 1 — Melalui Laragon (Apache)
Akses melalui browser di URL virtual host atau folder projek:
```
http://localhost/Dasweb2026/Jobsheet_8.2/index.php
```

### Opsi 2 — Melalui PHP Built-in Server
Jalankan terminal di dalam direktori `Jobsheet_8.2`:
```bash
php -S localhost:8000
```
Lalu buka di browser:
```
http://localhost:8000/index.php
```
