---
judul: Detik ke menit
tingkat: 1
urutan: 2
ringkasan: Ubah jumlah detik menjadi menit dan sisa detik.
petunjuk:
  - Satu menit sama dengan 60 detik.
  - "`//` memberikan hasil bagi bulat, `%` memberikan sisanya."
latihan:
  perintah: Ubah `total_detik` menjadi menit dan sisa detik, lalu cetak dengan format `2 menit 5 detik`.
  kode_awal: |
    total_detik = 125
    # tulis jawabanmu di sini
  solusi: |
    total_detik = 125
    menit = total_detik // 60
    detik = total_detik % 60
    print(f"{menit} menit {detik} detik")
  contoh_keluaran: |
    2 menit 5 detik
  tes:
    - jenis: keluaran
      ganti: { total_detik: 125 }
      harapan: "2 menit 5 detik\n"
    - jenis: keluaran
      ganti: { total_detik: 59 }
      harapan: "0 menit 59 detik\n"
    - jenis: keluaran
      ganti: { total_detik: 3600 }
      harapan: "60 menit 0 detik\n"
    - jenis: keluaran
      ganti: { total_detik: 0 }
      harapan: "0 menit 0 detik\n"
---

Sebuah stopwatch hanya menghitung detik. Ubah jumlah detik di `total_detik` menjadi menit dan sisa detiknya.

| `total_detik` | Keluaran |
| --- | --- |
| `125` | `2 menit 5 detik` |
| `59` | `0 menit 59 detik` |
| `3600` | `60 menit 0 detik` |
