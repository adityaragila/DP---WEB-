# Dokumentasi Jobsheet 3 — Responsive Design (CSS Murni)

---

## 1. Konsep Dasar Responsive Design

### 1.1 Apa itu Responsive Web Design?
Responsive Web Design (RWD) adalah pendekatan perancangan web di mana tata letak halaman menyesuaikan secara otomatis dengan lebar layar perangkat (layar ponsel, tablet, laptop, hingga monitor desktop) menggunakan satu basis kode HTML/CSS yang sama.

### 1.2 Tag `<meta name="viewport">`
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```
- `width=device-width`: Menyesuaikan lebar viewport dengan lebar fisik perangkat.
- `initial-scale=1`: Mengatur level perbesaran (zoom) awal pada skala 1:1.
Tanpa tag ini, peramban mobile akan menganggap halaman berukuran desktop (sekitar 980px) dan memperkecil seluruh halaman (*zoom-out*).

### 1.3 Pendekatan "Desktop-First"
Jobsheet ini memakai strategi *Desktop-First*: gaya dasar ditulis untuk layar lebar terlebih dahulu, kemudian ditimpa menggunakan blok `@media (max-width: ...)` untuk ukuran layar yang lebih kecil. Penulisan blok `@media` diletakkan di bagian paling bawah file CSS agar menang berdasarkan urutan aturan CSS (*cascade*).

---

## 2. Perubahan pada Struktur HTML

1. **Tag Viewport**: Disematkan di dalam `<head>` pada seluruh dokumen HTML.
2. **Elemen Hamburger Menu**:
   ```html
   <header>
       <h1>SIMPUS-Mini</h1>
       <input type="checkbox" id="nav-toggle" class="nav-toggle">
       <label for="nav-toggle" class="nav-toggle-label">&#9776;</label>
       <nav>...</nav>
   </header>
   ```
   Ketiga elemen (`h1`, `input`, `label`, `nav`) diletakkan sejajar sebagai *sibling* langsung di dalam `<header>`.
3. **Pembungkus Tabel**:
   ```html
   <div class="table-responsive">
       <table>...</table>
   </div>
   ```

---

## 3. Hamburger Menu dengan Checkbox Hack

Teknik ini menciptakan interaktivitas buka/tutup menu navigasi tanpa memerlukan JavaScript.

### Mekanisme Kerja:
1. Checkbox `#nav-toggle` disembunyikan menggunakan `display: none;`.
2. Label `<label for="nav-toggle" class="nav-toggle-label">&#9776;</label>` bertindak sebagai tombol pengganti ikon hamburger (☰).
3. Saat label diklik, status centang pada checkbox berubah.
4. CSS memanfaatkan selector *General Sibling Combinator* (`~`):
   ```css
   .nav-toggle:checked ~ nav {
       display: block;
   }
   ```
   Ketika checkbox dalam keadaan `:checked`, elemen `<nav>` yang posisinya merupakan saudara selevel setelah checkbox akan ditampilkan.

---

## 4. Tabel Responsif (`table-responsive`)

Tabel data dengan banyak kolom dapat memicu kerusakan tata letak pada layar kecil jika dipaksa mengecil. Solusinya adalah membungkus tabel ke dalam `<div>` dengan properti:
```css
.table-responsive {
    overflow-x: auto;
}
```
Ketika ukuran tabel melebihi pembungkusnya, bilah gulir (*scrollbar*) horizontal akan aktif hanya pada area tabel tersebut.

---

## 5. Media Queries & Breakpoints

File `style.css` mendefinisikan dua breakpoint:
```css
/* Tablet ke bawah (<= 768px) */
@media (max-width: 768px) {
    main section:nth-of-type(2) {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Layar Ponsel (<= 480px) */
@media (max-width: 480px) {
    header { position: relative; }
    .nav-toggle-label { display: block; }
    header nav {
        display: none;
        width: 100%;
        order: 3;
        margin-top: 1rem;
    }
    .nav-toggle:checked ~ nav { display: block; }
    header nav ul {
        flex-direction: column;
        gap: 0.75rem;
    }
    main section:nth-of-type(2) {
        grid-template-columns: 1fr;
    }
    form input,
    form select {
        max-width: 100%;
    }
}
```
