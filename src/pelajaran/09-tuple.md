---
judul: Tuple
urutan: 9
roadmap: Tuples
ringkasan: Urutan nilai yang tidak bisa diubah, serta cara membongkarnya ke beberapa variabel.
latihan:
  perintah: Tukar isi a dan b dalam satu baris memakai tuple, tanpa variabel ketiga. Baris print sudah disediakan.
  kode_awal: |
    a = 1
    b = 2
    # tukar a dan b di sini

    print(a, b)
  solusi: |
    a = 1
    b = 2
    a, b = b, a

    print(a, b)
  contoh_keluaran: |
    2 1
  tes:
    - jenis: keluaran
      ganti: { a: 1, b: 2 }
      harapan: "2 1\n"
    - jenis: keluaran
      ganti: { a: 10, b: 20 }
      harapan: "20 10\n"
---

**Tuple** mirip list: urutan nilai yang punya indeks. Bedanya, tuple **tidak bisa diubah** setelah dibuat. Tuple ditulis dengan kurung biasa.

```python
titik = (3, 4)
print(titik)
print(titik[0])
print(len(titik))
```

## Tidak bisa diubah

Mengganti, menambah, atau menghapus elemen tuple menghasilkan `TypeError`.

```python salah
titik = (3, 4)
titik[0] = 10
```

Itu justru kegunaannya: tuple menjamin isinya tetap. Pakai tuple untuk data yang memang satu kesatuan dan tidak berubah, seperti koordinat, tanggal, atau warna RGB. Pakai list untuk kumpulan yang isinya bertambah dan berkurang.

## Membongkar tuple

Elemen tuple bisa langsung dibagikan ke beberapa variabel. Jumlah variabel harus sama dengan jumlah elemen.

```python
titik = (3, 4)
x, y = titik
print(x)
print(y)
```

Tanda kurung boleh dihilangkan; komalah yang membuat tuple.

```python
warna = 255, 128, 0
merah, hijau, biru = warna
print(hijau)
```

## Tuple satu elemen

Tuple berisi satu elemen butuh koma di belakangnya. Tanpa koma, kurung itu hanya kurung biasa.

```python
satu = (5,)
bukan_tuple = (5)
print(type(satu))
print(type(bukan_tuple))
```

## Mengembalikan beberapa nilai

Fungsi bisa mengembalikan beberapa nilai sekaligus. Sebenarnya yang dikembalikan adalah satu tuple.

```python
def bagi(a, b):
    return a // b, a % b

hasil, sisa = bagi(17, 5)
print(hasil)
print(sisa)
```

## Tuple di dalam list

Tuple sering dipakai sebagai "baris data" di dalam list.

```python
siswa = [("Sari", 90), ("Budi", 75)]
for nama, nilai in siswa:
    print(nama, nilai)
```
