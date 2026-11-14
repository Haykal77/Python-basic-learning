---
judul: Eksepsi
urutan: 6
roadmap: Exceptions
ringkasan: Menangani galat saat program berjalan dengan try, except, else, dan finally.
latihan:
  perintah: Ubah teks menjadi bilangan bulat lalu cetak dua kalinya. Bila teks bukan angka, cetak "Bukan angka" dan jangan biarkan program berhenti karena galat.
  kode_awal: |
    teks = "21"
    # pakai try dan except ValueError
  solusi: |
    teks = "21"
    try:
        angka = int(teks)
        print(angka * 2)
    except ValueError:
        print("Bukan angka")
  contoh_keluaran: |
    42
  tes:
    - jenis: keluaran
      ganti: { teks: "21" }
      harapan: "42\n"
    - jenis: keluaran
      ganti: { teks: "7" }
      harapan: "14\n"
    - jenis: keluaran
      ganti: { teks: "abc" }
      harapan: "Bukan angka\n"
---

**Eksepsi** adalah galat yang terjadi saat program sedang berjalan. Sintaksnya benar, tetapi ada sesuatu yang tidak bisa dikerjakan: membagi dengan nol, mengubah `"abc"` menjadi angka, dan sebagainya. Bila tidak ditangani, program berhenti di baris itu.

```python salah
print(10 / 0)
print("Baris ini tidak pernah dijalankan")
```

## try dan except

Letakkan kode yang berisiko di dalam `try`. Bila terjadi eksepsi, Python melompat ke blok `except` dan program tetap berjalan.

```python
try:
    hasil = 10 / 0
    print(hasil)
except ZeroDivisionError:
    print("Tidak bisa membagi dengan nol")

print("Program lanjut")
```

## Sebutkan jenis eksepsinya

Tulis jenis eksepsi yang kamu perkirakan, dan tangani masing-masing dengan caranya sendiri. `except` tanpa jenis akan menelan semua galat, termasuk salah ketik di kodemu sendiri, sehingga kesalahan sulit ditemukan.

```python
teks = "dua belas"
try:
    angka = int(teks)
    print(100 / angka)
except ValueError:
    print("Itu bukan angka")
except ZeroDivisionError:
    print("Angkanya tidak boleh nol")
```

| Eksepsi | Terjadi saat |
| --- | --- |
| `ValueError` | Nilainya tidak cocok, misalnya `int("abc")` |
| `ZeroDivisionError` | Membagi dengan nol |
| `TypeError` | Tipenya tidak cocok, misalnya `"a" + 1` |
| `NameError` | Memakai nama yang belum dibuat |
| `IndexError` | Indeks di luar panjang list |
| `KeyError` | Kunci tidak ada di dictionary |

## Melihat pesan galatnya

`as` menyimpan eksepsi ke sebuah variabel, sehingga pesannya bisa ditampilkan.

```python
try:
    int("abc")
except ValueError as galat:
    print("Gagal:", galat)
```

## else dan finally

`else` dijalankan bila **tidak** ada eksepsi. `finally` selalu dijalankan, apa pun yang terjadi.

```python
try:
    angka = int("25")
except ValueError:
    print("Bukan angka")
else:
    print("Berhasil:", angka)
finally:
    print("Selesai")
```

## Membuat eksepsi sendiri

`raise` memunculkan eksepsi dengan sengaja, biasanya saat sebuah nilai tidak masuk akal bagi programmu.

```python
umur = -3
try:
    if umur < 0:
        raise ValueError("Umur tidak boleh negatif")
    print(umur)
except ValueError as galat:
    print("Gagal:", galat)
```
