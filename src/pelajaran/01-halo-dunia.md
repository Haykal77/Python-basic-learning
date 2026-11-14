---
judul: Sintaks dasar
urutan: 1
roadmap: Basic Syntax
ringkasan: Aturan menulis program Python — baris, komentar, indentasi, dan print.
latihan:
  perintah: Ubah program di bawah agar mencetak namamu sendiri di baris kedua.
  kode_awal: |
    print("Halo, Dunia!")
  solusi: |
    print("Halo, Dunia!")
    print("Namaku Sari")
  contoh_keluaran: |
    Halo, Dunia!
    Namaku Sari
  tes:
    - jenis: keluaran_diawali
      harapan: "Halo, Dunia!\n"
    - jenis: jumlah_baris
      harapan: 2
---

Sintaks adalah aturan menulis program agar Python bisa memahaminya. Aturan Python sedikit dan mudah dibaca; pelajaran ini mencakup yang paling dasar.

## Program pertama

```python
print("Halo, Dunia!")
```

`print` adalah **fungsi**: perintah yang sudah disediakan Python. Apa pun di dalam tanda kurung ditampilkan ke layar. Teks di dalam tanda kutip disebut **string**.

## Satu baris, satu perintah

Python menjalankan program dari atas ke bawah, satu baris setiap kali. Tidak perlu titik koma di akhir baris.

```python
print("Baris pertama")
print("Baris kedua")
```

`print` bisa menerima beberapa nilai sekaligus, dipisahkan koma. Python menyisipkan spasi di antaranya.

```python
print("Umur:", 17)
```

## Komentar

Semua yang ditulis setelah `#` diabaikan Python. Komentar ditujukan untuk manusia yang membaca kodemu.

```python
# Baris ini tidak dijalankan
print("Ini dijalankan")  # komentar juga boleh di akhir baris
```

## Indentasi

Di banyak bahasa lain, spasi di awal baris hanya soal kerapian. Di Python, spasi itu **bagian dari sintaks**: baris yang menjorok ke dalam termasuk ke blok di atasnya. Kesepakatannya empat spasi.

```python
if True:
    print("Baris ini ada di dalam if")
print("Baris ini di luar if")
```

Indentasi yang tidak pada tempatnya menghasilkan galat:

```python salah
print("Halo")
    print("Kenapa menjorok?")
```

## Huruf besar dan kecil berbeda

`print` dan `Print` adalah dua nama berbeda bagi Python. Hanya yang pertama yang ada.

```python salah
Print("Halo")
```
