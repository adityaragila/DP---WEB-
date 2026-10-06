<?php
$page_title = "Beranda";
include __DIR__ . '/includes/header.php';

$totalBuku = count($_SESSION['buku'] ?? []);
$totalAnggota = count($_SESSION['anggota'] ?? []);
?>

<section>
    <h2>Selamat Datang di Sistem Perpustakaan Mini</h2>
    <p>Aplikasi sederhana untuk mengelola data buku dan anggota perpustakaan.</p>
</section>

<section>
    <h2>Ringkasan</h2>
    <article>
        <h3>Total Buku</h3>
        <p><?php echo $totalBuku; ?></p>
    </article>
    <article>
        <h3>Total Anggota</h3>
        <p><?php echo $totalAnggota; ?></p>
    </article>
    <article>
        <h3>Sedang Dipinjam</h3>
        <p>0</p>
    </article>
</section>

<!-- Tambahan: kotak pencarian -->
<section class="search-box">
    <label for="search">Cari Buku:</label>
    <input type="text" id="search" name="search" placeholder="Masukkan judul buku...">
</section>

<!-- Tambahan: contoh flash message -->
<?php 
if (isset($_SESSION['flash'])): 
    $flash = $_SESSION['flash'];
    unset($_SESSION['flash']);
    $flashType = is_array($flash) ? ($flash['type'] ?? 'success') : 'success';
    $flashPesan = is_array($flash) ? ($flash['pesan'] ?? '') : $flash;
?>
    <div class="flash flash-<?php echo htmlspecialchars($flashType); ?>">
        <?php echo htmlspecialchars($flashPesan); ?>
    </div>
<?php endif; ?>

<?php include __DIR__ . '/includes/footer.php'; ?>
