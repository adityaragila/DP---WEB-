# Dokumentasi Jobsheet 3 (Versi Bootstrap)

Dokumentasi ini menjelaskan implementasi desain responsif pada proyek SIMPUS-Mini menggunakan framework **Bootstrap 5.3**, serta membandingkannya secara langsung dengan versi CSS murni.

---

## 1. Konsep Dasar Bootstrap

### 1.1 Apa itu Bootstrap?
Bootstrap adalah framework CSS dan JavaScript yang menyediakan komponen siap pakai (*pre-built*), utilitas tata letak, dan sistem grid responsif. Jika CSS murni mengharuskan kita menulis semua aturan dari awal, Bootstrap menyediakan *class-class* siap tempel pada elemen HTML.

### 1.2 Memuat Bootstrap via CDN
Bootstrap dimuat melalui Content Delivery Network (jsDelivr):
```html
<!-- Di dalam <head> sebelum style.css -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">

<!-- Di akhir <body> sebelum </body> -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

### 1.3 Breakpoint Bawaan Bootstrap (Mobile-First)
Bootstrap menggunakan pendekatan *Mobile-First* dengan 6 breakpoint standar:
- **Extra Small (xs)**: `<576px` (tanpa infix)
- **Small (sm)**: `≥576px`
- **Medium (md)**: `≥768px`
- **Large (lg)**: `≥992px`
- **Extra Large (xl)**: `≥1200px`
- **Extra Extra Large (xxl)**: `≥1400px`

---

## 2. Navbar Responsif ala Bootstrap

Berbeda dengan versi CSS murni yang mengandalkan trik *checkbox hack*, Bootstrap menyediakan komponen navbar resmi yang digerakkan oleh JavaScript bawaan (`bootstrap.bundle.min.js`).

```html
<header class="navbar navbar-expand-lg navbar-dark" style="background-color:#1d5b8a;">
    <div class="container">
        <a class="navbar-brand fw-semibold" href="index.html">SIMPUS-Mini</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <nav class="collapse navbar-collapse" id="navMenu">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item"><a class="nav-link active" href="index.html">Beranda</a></li>
                ...
            </ul>
        </nav>
    </div>
</header>
```

### Penjelasan Elemen Penting:
- `.navbar-expand-lg`: Menu terbuka horizontal pada layar `≥992px`. Di bawah itu, menu melipat ke tombol hamburger.
- `data-bs-toggle="collapse"` & `data-bs-target="#navMenu"`: Data attribute yang dibaca JavaScript Bootstrap untuk membuka/menutup navigasi dengan ID `#navMenu`.
- `.navbar-toggler-icon`: Ikon hamburger garis tiga bawaan Bootstrap berbasis SVG background.
- `.ms-auto`: Menggeser menu ke sisi kanan (*margin-inline-start: auto*).

---

## 3. Grid System & Komponen Card

### 3.1 Komponen Card
Tag `<section>` dibungkus dengan komponen `.card`:
```html
<section class="card shadow-sm mb-4">
    <div class="card-body">
        <h2 class="card-title mb-3" style="color:#1d5b8a;">Ringkasan</h2>
        ...
    </div>
</section>
```
- `.card`: Menggantikan properti `background`, `border`, dan `border-radius`.
- `.card-body`: Memberikan *padding* dalam kartu.
- `.shadow-sm`: Memberikan bayangan lembut (*box-shadow*).

### 3.2 Grid 12 Kolom untuk Kartu Statistik
```html
<div class="row g-3 text-center">
    <div class="col-12 col-md-4">
        <div class="p-3 rounded-3" style="background-color:#eef4fa;">
            <h3 class="h6 text-secondary">Total Buku</h3>
            <p class="fs-2 fw-bold mb-0" style="color:#1d5b8a;">12</p>
        </div>
    </div>
    <!-- Kartu lainnya -->
</div>
```
- `.row`: Baris grid (12 kolom virtual).
- `.col-12`: Melebar penuh (12/12 bagian) pada layar `<768px` (Mobile).
- `.col-md-4`: Melebar sepertiga (4/12 bagian) pada layar `≥768px` (Tablet ke atas).
- `.g-3`: *Gutter* jarak antar kolom sebesar `1rem`.

---

## 4. Tabel & Form dengan Utility Class Bootstrap

### 4.1 Tabel
```html
<div class="table-responsive">
    <table class="table table-striped table-hover align-middle">
        <thead style="background-color:#1d5b8a;">
            <tr class="text-white">...</tr>
        </thead>
        <tbody>
            <tr>
                <td>...</td>
                <td>
                    <button type="button" class="btn btn-warning btn-sm text-white">Edit</button>
                    <button type="button" class="btn btn-danger btn-sm">Hapus</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
```
- `.table`: Dasar penataan tabel Bootstrap.
- `.table-striped`: Garis belang selang-seling (zebra).
- `.table-hover`: Efek sorot saat kursor berada di atas baris.
- `.align-middle`: Menyelaraskan teks dan tombol rata tengah secara vertikal.
- `.btn-warning` & `.btn-danger`: Skema warna tombol semantik.

### 4.2 Form
Setiap pasangan label dan input dibungkus dengan `<div class="mb-3">`:
```html
<div class="mb-3">
    <label for="judul" class="form-label fw-semibold">Judul</label>
    <input type="text" class="form-control" id="judul" name="judul" required>
</div>
```
- `.form-label`: Jarak margin bawah yang konsisten untuk label.
- `.form-control`: Gaya input responsif dengan padding nyaman dan efek *focus ring* biru otomatis.
- `.form-select`: Gaya kustom untuk dropdown `<select>`.

---

## 5. Tabel Perbandingan Lengkap: Bootstrap vs CSS Murni

| Kebutuhan | CSS Murni (`Jobsheet_3`) | Bootstrap 5 (`Jobsheet_3_bootstrap_`) |
|---|---|---|
| **Membatasi lebar konten** | `main { max-width: 1000px; margin: 0 auto; }` | `.container` |
| **Kartu putih & bayangan** | `section { border-radius: 8px; box-shadow: ...; }` | `.card` + `.card-body` + `.shadow-sm` |
| **Grid kartu statistik** | `display: grid; grid-template-columns: repeat(3, 1fr);` | `.row` + `.col-12 .col-md-4` |
| **Navbar hamburger** | Checkbox hack (`:checked` + `~`) murni CSS | `.navbar-toggler` + `.collapse` (JavaScript) |
| **Tabel belang & hover** | `tbody tr:nth-child(even)`, `tbody tr:hover` | `.table-striped`, `.table-hover` |
| **Scroll horizontal tabel** | `.table-responsive { overflow-x: auto; }` | `.table-responsive` (bawaan Bootstrap) |
| **Tombol aksi berwarna** | `td button:first-of-type { background: ... }` | `.btn .btn-warning`, `.btn .btn-danger` |
| **Input & select form** | `form input { width: 100%; border: ...; }` | `.form-control`, `.form-select` |
| **Media Query / Breakpoint** | `@media (max-width: 768px)` & `480px` manual | Infix bawaan: `sm`, `md`, `lg`, `xl`, `xxl` |
| **Total baris CSS kustom** | **~245 baris** (`style.css`) | **~15 baris** (`style.css` override brand) |
| **Ketergantungan Eksternal** | Nol (Murni file lokal) | Membutuhkan CDN Bootstrap CSS & JS |
