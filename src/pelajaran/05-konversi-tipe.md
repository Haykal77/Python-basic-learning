---
judul: Konversi tipe
urutan: 5
roadmap: Type Casting
ringkasan: Mengubah nilai dari satu tipe ke tipe lain dengan int, float, str, dan bool.
latihan:
  perintah: Harga dan jumlah di bawah tersimpan sebagai teks. Ubah keduanya menjadi bilangan, lalu cetak total harganya.
  kode_awal: |
    harga_teks = "12500"
    jumlah_teks = "3"
    # ubah ke bilangan, kalikan, lalu cetak
  solusi: |
    harga_teks = "12500"
    jumlah_teks = "3"
    total = int(harga_teks) * int(jumlah_teks)
    print(total)
  contoh_keluaran: |
    37500
  tes:
    - jenis: keluaran
      ganti: { harga_teks: "12500", jumlah_teks: "3" }
      harapan: "37500\n"
    - jenis: keluaran
      ganti: { harga_teks: "2000", jumlah_teks: "4" }
      harapan: "8000\n"
---

Data sering datang dalam tipe yang tidak sesuai kebutuhan. Angka yang diketik pengguna atau dibaca dari berkas, misalnya, selalu berupa teks. **Konversi tipe** (*type casting*) mengubah nilai ke tipe lain.

## Mengapa perlu

Operator `+` berarti menjumlahkan untuk bilangan, tetapi menyambung untuk teks.

```python
print(3 + 4)
print("3" + "4")
```

Baris kedua mencetak `34`, bukan `7`. Mencampur keduanya menghasilkan galat:

```python salah
print("Umur: " + 17)
```

## Fungsi konversi

| Fungsi | Mengubah ke | Contoh | Hasil |
| --- | --- | --- | --- |
| `int()` | bilangan bulat | `int("42")` | `42` |
| `float()` | bilangan pecahan | `float("3.5")` | `3.5` |
| `str()` | teks | `str(17)` | `"17"` |
| `bool()` | benar atau salah | `bool(0)` | `False` |

```python
umur_teks = "17"
umur = int(umur_teks)
print(umur + 1)

print("Umur: " + str(umur))
```

## int membuang pecahan

`int` pada bilangan pecahan memotong bagian di belakang koma; ia tidak membulatkan. Untuk membulatkan pakai `round`.

```python
print(int(3.9))
print(round(3.9))
```

## Nilai yang dianggap salah

`bool` menganggap nilai "kosong" sebagai `False`: angka nol, teks kosong, dan `None`. Selain itu `True`.

```python
print(bool(0))
print(bool(""))
print(bool(25))
print(bool("teks"))
```

## Tidak semua bisa dikonversi

Teks yang bukan angka tidak bisa dijadikan bilangan. Python menghentikan program dengan galat `ValueError`.

```python salah
print(int("dua belas"))
```

Cara menangani galat seperti ini dibahas di pelajaran berikutnya.
