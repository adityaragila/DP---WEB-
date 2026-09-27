// ===== Hamburger menu (JS-driven, menggantikan checkbox hack) =====
// Tugas 2: Nav toggle dengan animasi transisi CSS halus
function initNavToggle() {
    const toggleBtn = document.getElementById("nav-toggle-btn");
    const nav = document.querySelector("header nav");
    if (!toggleBtn || !nav) return;

    toggleBtn.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("nav-open");
        toggleBtn.setAttribute("aria-expanded", isOpen);
    });
}

// ===== Counter jumlah baris tersisa (Tugas 4) =====
// Menghitung dan menampilkan baris tersisa setelah difilter atau dihapus
function updateTableCounter() {
    const table = document.querySelector(".table-responsive table");
    if (!table) return;

    let counter = document.getElementById("table-counter");
    if (!counter) {
        // Jika belum ada elemen #table-counter di HTML, buat secara dinamis di atas tabel
        const wrapper = document.querySelector(".table-responsive");
        if (!wrapper) return;
        counter = document.createElement("p");
        counter.id = "table-counter";
        counter.className = "table-counter";
        wrapper.insertAdjacentElement("beforebegin", counter);
    }

    const rows = table.querySelectorAll("tbody tr");
    const totalCount = rows.length;
    let visibleCount = 0;

    rows.forEach(function (row) {
        if (row.style.display !== "none") {
            visibleCount++;
        }
    });

    // Deteksi nama entitas (misal: "buku" atau "anggota")
    let entitas = counter.dataset.entity;
    if (!entitas) {
        const h2 = document.querySelector("main section h2");
        const judul = h2 ? h2.textContent.toLowerCase() : "";
        if (judul.includes("buku")) {
            entitas = "buku";
        } else if (judul.includes("anggota")) {
            entitas = "anggota";
        } else {
            entitas = "data";
        }
    }

    counter.textContent = "Menampilkan " + visibleCount + " dari " + totalCount + " " + entitas;
}

// ===== Konfirmasi hapus (front-end only, belum ke server) =====
// Tugas 4: Perbarui counter setiap kali data dihapus
function initHapusConfirm() {
    document.querySelectorAll(".btn-hapus").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const row = btn.closest("tr");
            const nama = row ? row.querySelector("td")?.textContent : "data ini";
            const yakin = confirm("Yakin ingin menghapus \"" + nama + "\"?");
            if (yakin && row) {
                row.remove();
                // Tugas 4: Perbarui counter setelah baris dihapus
                updateTableCounter();
            }
        });
    });
}

// ===== Filter/pencarian tabel real-time =====
// Tugas 3: Pencarian bisa dibatasi ke satu kolom saja (misalnya kolom "Judul") menggunakan row.querySelector("td")
// Tugas 4: Perbarui counter setelah penyaringan berjalan
function initTableFilter() {
    const input = document.getElementById("search-input");
    const table = document.querySelector(".table-responsive table");
    if (!input || !table) return;

    const colSelect = document.getElementById("search-column");

    function jalankanFilter() {
        const keyword = input.value.toLowerCase().trim();
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(function (row) {
            let teks = "";

            if (colSelect && colSelect.value !== "all") {
                // Jika user memilih kolom tertentu dari dropdown
                const colIdx = parseInt(colSelect.value, 10);
                const cells = row.querySelectorAll("td");
                teks = cells[colIdx] ? cells[colIdx].textContent.toLowerCase() : "";
            } else if (!colSelect) {
                // Tugas 3: Sesuai petunjuk jobsheet, gunakan row.querySelector("td") alih-alih row.textContent
                // untuk membatasi pencarian ke kolom pertama saja (kolom Judul)
                const firstTd = row.querySelector("td");
                teks = firstTd ? firstTd.textContent.toLowerCase() : "";
            } else {
                // Dropdown diset ke "all" (semua kolom)
                teks = row.textContent.toLowerCase();
            }

            const cocok = teks.includes(keyword);
            row.style.display = cocok ? "" : "none";
        });

        // Tugas 4: Perbarui counter setelah filter
        updateTableCounter();
    }

    input.addEventListener("keyup", jalankanFilter);
    if (colSelect) {
        colSelect.addEventListener("change", jalankanFilter);
    }

    // Tampilkan counter awal saat inisialisasi
    updateTableCounter();
}

// ===== Validasi form (client-side) =====
function tampilkanError(input, pesan) {
    hapusError(input);
    const span = document.createElement("span");
    span.className = "error";
    span.textContent = pesan;
    input.insertAdjacentElement("afterend", span);
}

function hapusError(input) {
    const next = input.nextElementSibling;
    if (next && next.classList.contains("error")) {
        next.remove();
    }
}

function initValidasiForm() {
    const form = document.getElementById("form-tambah");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        let valid = true;

        // ===== Tugas 5: Refactor validasi menggunakan array & forEach =====
        // Daftar nama field yang wajib diisi (required)
        const fieldWajib = ["judul", "nama", "pengarang", "no_anggota"];

        fieldWajib.forEach(function (namaField) {
            const input = form.querySelector("[name='" + namaField + "']");
            if (input) {
                if (input.value.trim() === "") {
                    const label = form.querySelector("label[for='" + input.id + "']");
                    const labelText = label ? label.textContent.trim() : "Field ini";
                    tampilkanError(input, labelText + " wajib diisi.");
                    valid = false;
                } else {
                    hapusError(input);
                }
            }
        });

        // ===== Tugas 1: Validasi field ISBN =====
        // Field ISBN opsional (tidak wajib), tetapi jika diisi hanya boleh berisi angka dan tanda hubung
        const isbn = form.querySelector("[name='isbn']");
        if (isbn) {
            const nilaiIsbn = isbn.value.trim();
            if (nilaiIsbn !== "") {
                const regexIsbn = /^[0-9-]+$/;
                if (!regexIsbn.test(nilaiIsbn)) {
                    tampilkanError(isbn, "ISBN hanya boleh berisi angka dan tanda hubung.");
                    valid = false;
                } else {
                    hapusError(isbn);
                }
            } else {
                hapusError(isbn);
            }
        }

        // ===== Validasi tahun (1900 - 2026) =====
        const tahun = form.querySelector("[name='tahun']");
        if (tahun) {
            const nilaiTahun = parseInt(tahun.value, 10);
            if (isNaN(nilaiTahun) || nilaiTahun < 1900 || nilaiTahun > 2026) {
                tampilkanError(tahun, "Tahun harus di antara 1900-2026.");
                valid = false;
            } else {
                hapusError(tahun);
            }
        }

        // ===== Validasi stok (tidak boleh negatif) =====
        const stok = form.querySelector("[name='stok']");
        if (stok) {
            const nilaiStok = parseInt(stok.value, 10);
            if (isNaN(nilaiStok) || nilaiStok < 0) {
                tampilkanError(stok, "Stok tidak boleh negatif.");
                valid = false;
            } else {
                hapusError(stok);
            }
        }

        if (!valid) {
            e.preventDefault();
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initHapusConfirm();
    initTableFilter();
    initValidasiForm();
});
