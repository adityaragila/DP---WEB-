<?php
require 'includes/koneksi.php';
$sql = file_get_contents('sql/02.user_sql');
$pdo->exec($sql);
echo "Tabel users berhasil dibuat.";
