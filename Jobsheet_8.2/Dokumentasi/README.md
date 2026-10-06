# Dokumentasi Praktikum Jobsheet 8 — Koneksi PostgreSQL

## 1. Konsep Dasar Database & SQL
Pada praktikum-praktikum sebelumnya:
- **Jobsheet 1–5**: Data statis ditulis manual di kode HTML.
- **Jobsheet 6**: Data dibaca dari file format JSON (`data/*.json`), namun belum bisa ditambahkan dinamis dari formulir web.
- **Jobsheet 7**: Data dikelola secara dinamis lewat `$_SESSION`, namun data akan hilang setiap kali browser ditutup atau sesi berakhir.
- **Jobsheet 8**: Data dikelola secara persisten dan permanen di basis data relasional **PostgreSQL**.

### Apa itu DBMS dan Database Relasional?
PostgreSQL merupakan sistem manajemen basis data relasional (*Relational Database Management System* / RDBMS). Data disimpan dalam bentuk tabel yang terdiri atas kolom (*columns*) dengan tipe data tertentu dan baris (*rows/records*).

### Apa itu SQL?
SQL (*Structured Query Language*) adalah bahasa deklaratif standar untuk berinteraksi dengan database relasional:
- `CREATE TABLE`: Mendefinisikan tabel baru dan struktur kolomnya.
- `INSERT`: Menambahkan rekaman baris data baru ke dalam tabel.
- `SELECT`: Membaca dan mengambil rekaman data dari tabel.
- `COUNT(*)`: Menghitung total jumlah rekaman baris dalam tabel secara efisien di sisi database.

---

## 2. Struktur Skema Database (`sql/01_buku_anggota.sql`)
Skema tabel yang dibangun untuk aplikasi SIMPUS-Mini:

### Tabel `buku`
| Kolom | Tipe Data | Batasan | Keterangan |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Kunci utama bilangan bulat yang bertambah otomatis (*auto-increment*) |
| `judul` | `VARCHAR(255)` | `NOT NULL` | Judul buku (wajib diisi) |
| `pengarang` | `VARCHAR(255)` | `NOT NULL` | Nama pengarang buku (wajib diisi) |
| `tahun` | `INTEGER` | `NOT NULL` | Tahun terbit buku |
| `isbn` | `VARCHAR(50)` | - | Nomor ISBN buku (opsional) |
| `stok` | `INTEGER` | `NOT NULL DEFAULT 0` | Kuantitas persediaan buku |
| `kategori` | `VARCHAR(50)` | - | Kategori buku |

### Tabel `anggota`
| Kolom | Tipe Data | Batasan | Keterangan |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Kunci utama auto-increment |
| `nama` | `VARCHAR(255)` | `NOT NULL` | Nama lengkap anggota (wajib diisi) |
| `no_anggota` | `VARCHAR(50)` | `NOT NULL UNIQUE` | Nomor identitas anggota (wajib unik dan tidak boleh ganda) |
| `alamat` | `VARCHAR(255)` | - | Alamat anggota |
| `no_hp` | `VARCHAR(30)` | - | Nomor handphone anggota |

---

## 3. Koneksi PDO ke PostgreSQL (`includes/koneksi.php`)
PDO (*PHP Data Objects*) adalah antarmuka abstraksi basis data bawaan PHP yang fleksibel dan aman.
```php
<?php
$host = "localhost";
$port = "5432";
$db   = "simpus_mini";
$user = "postgres";
$pass = "postgres";

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Koneksi database gagal: " . $e->getMessage());
}
```
- **DSN (Data Source Name)**: `pgsql:host=$host;port=$port;dbname=$db` menentukan driver `pgsql` beserta target host dan nama database.
- **Error Mode Exception**: Mengaktifkan lemparan error `PDOException` saat query database mengalami kegagalan, memudahkan pelacakan bug dan penanganan eror.

---

## 4. Keamanan: Mengapa Menggunakan Prepared Statement?
Pada `buku/proses_tambah.php` dan `anggota/proses_tambah.php`, kita tidak menggabungkan string mentah (*string concatenation*):
```php
// CONTOH TIDAK AMAN (Rentan SQL Injection):
// $pdo->query("INSERT INTO buku (judul) VALUES ('" . $judul . "')");

// CARA AMAN (Prepared Statement):
$stmt = $pdo->prepare(
    "INSERT INTO buku (judul, pengarang, tahun, isbn, stok, kategori)
    VALUES (:judul, :pengarang, :tahun, :isbn, :stok, :kategori)
    RETURNING id"
);
$stmt->execute([...]);
```
### Keunggulan:
1. **Mencegah SQL Injection**: Placeholder seperti `:judul` memisahkan instruksi SQL dari data masukan pengguna. Nilai yang dimasukkan diperlakukan murni sebagai teks/data, bukan sebagai perintah SQL executable.
2. **Klausa `RETURNING id`**: Fitur spesifik PostgreSQL untuk langsung mengembalikan nilai ID baris yang baru terbuat.

---

## 5. Pengambilan Data (`SELECT`)
- Pada `buku/list.php` dan `anggota/list.php`:
  ```php
  $daftarBuku = $pdo->query("SELECT * FROM buku ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
  ```
  Data diurutkan terbalik berdasarkan `id DESC` sehingga data terbaru yang baru diinput langsung berada di urutan paling atas.
- Pada `index.php`:
  ```php
  $totalBuku = $pdo->query("SELECT COUNT(*) FROM buku")->fetchColumn();
  ```
  Fungsi SQL `COUNT(*)` dieksekusi langsung oleh mesin database sehingga server PHP tidak perlu menarik seluruh baris data ke dalam memori aplikasi hanya untuk menghitung jumlah total.
