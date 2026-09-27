// ===== buku.js =====
// Latihan Tambahan Jobsheet 6 (Tugas 1, 2, 3, 5)

// Definisi fallback fungsi generik jika app.js tidak dimuat lebih dulu (Tugas 2 & Tugas 5)
if (typeof muatDataTabel !== "function") {
    async function muatDataTabel(urlJson, daftarKunci) {
        const tbody = document.querySelector(".table-responsive table tbody");
        const loading = document.getElementById("loading-indicator");
        if (!tbody) return;

        if (loading) loading.style.display = "block";
        tbody.innerHTML = "";

        try {
            // Tugas 5: Delay simulasi 3000 ms (3 detik)
            await new Promise((resolve) => setTimeout(resolve, 3000));

            const res = await fetch(urlJson);
            if (!res.ok) {
                throw new Error("Gagal mengambil data (status " + res.status + ")");
            }
            const dataList = await res.json();

            dataList.forEach(function (item) {
                const tr = document.createElement("tr");

                let kolomHtml = "";
                daftarKunci.forEach(function (kunci) {
                    const val = item[kunci] !== undefined ? item[kunci] : "-";
                    kolomHtml += "<td>" + val + "</td>";
                });

                kolomHtml +=
                    "<td>" +
                    "<button type=\"button\">Edit</button> " +
                    "<button type=\"button\" class=\"btn-hapus\">Hapus</button>" +
                    "</td>";

                tr.innerHTML = kolomHtml;
                tbody.appendChild(tr);
            });
        } catch (err) {
            const totalKolom = daftarKunci.length + 1;
            tbody.innerHTML =
                "<tr><td colspan=\"" + totalKolom + "\">Gagal memuat data: " + err.message + "</td></tr>";
        } finally {
            if (loading) loading.style.display = "none";
        }
    }
}

// ===== Tugas 2 & Tugas 3: muatDaftarBuku memanggil fungsi generik muatDataTabel =====
// Ditambahkan kolom baru "kategori" sesuai Tugas 3
function muatDaftarBuku() {
    return muatDataTabel("../data/buku.json", ["judul", "pengarang", "tahun", "kategori", "stok"]);
}

document.addEventListener("DOMContentLoaded", function () {
    // Muat data saat halaman pertama kali dibuka
    muatDaftarBuku();

    // ===== Tugas 1: Tombol "Muat Ulang" yang memanggil ulang muatDaftarBuku() =====
    const btnMuatUlang = document.getElementById("btn-muat-ulang");
    if (btnMuatUlang) {
        btnMuatUlang.addEventListener("click", function () {
            muatDaftarBuku();
        });
    }
});