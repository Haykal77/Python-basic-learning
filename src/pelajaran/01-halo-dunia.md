---
judul: Halo, Dunia
urutan: 1
ringkasan: Program pertamamu, dan cara Python menampilkan teks ke layar.
latihan:
  perintah: Ubah program di bawah agar mencetak namamu sendiri di baris kedua.
  kode_awal: |
    print("Halo, Dunia!")
  contoh_keluaran: |
    Halo, Dunia!
    Namaku Sari
  tes:
    - jenis: keluaran_diawali
      harapan: "Halo, Dunia!\n"
    - jenis: jumlah_baris
      harapan: 2
---

Program Python dibaca dari atas ke bawah, satu baris setiap kali. Baris paling sederhana yang bisa kamu tulis adalah perintah untuk menampilkan teks.

```python
print("Halo, Dunia!")
```

`print` adalah **fungsi**: sebuah perintah yang sudah disediakan Python. Apa pun yang kamu letakkan di dalam tanda kurung akan ditampilkan ke layar.

Teks di dalam tanda kutip disebut **string**. Tanda kutip memberi tahu Python bahwa isinya adalah teks, bukan perintah.

## Lebih dari satu baris

Setiap `print` menghasilkan satu baris keluaran.

```python
print("Baris pertama")
print("Baris kedua")
```

## Komentar

Baris yang diawali `#` diabaikan Python. Gunakan untuk meninggalkan catatan bagi dirimu sendiri.

```python
# Ini tidak dijalankan
print("Ini dijalankan")
```
