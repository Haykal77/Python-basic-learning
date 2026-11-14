---
judul: List
urutan: 8
roadmap: Lists
ringkasan: Menyimpan banyak nilai secara berurutan — indeks, irisan, dan mengubah isi list.
latihan:
  perintah: Hitung berapa banyak nilai di dalam list yang 75 atau lebih, lalu cetak jumlahnya.
  kode_awal: |
    nilai = [70, 85, 90, 60]
    lulus = 0
    # periksa setiap nilai, tambah lulus bila 75 atau lebih

    print(lulus)
  solusi: |
    nilai = [70, 85, 90, 60]
    lulus = 0
    for n in nilai:
        if n >= 75:
            lulus = lulus + 1

    print(lulus)
  contoh_keluaran: |
    2
  tes:
    - jenis: keluaran
      ganti: { nilai: [70, 85, 90, 60] }
      harapan: "2\n"
    - jenis: keluaran
      ganti: { nilai: [75, 74, 100] }
      harapan: "2\n"
    - jenis: keluaran
      ganti: { nilai: [10, 20] }
      harapan: "0\n"
    - jenis: keluaran
      ganti: { nilai: [] }
      harapan: "0\n"
---

**List** menyimpan banyak nilai dalam satu variabel, secara berurutan. List ditulis dengan kurung siku, elemennya dipisahkan koma.

```python
buah = ["apel", "jeruk", "mangga"]
print(buah)
print(len(buah))
```

## Indeks

Setiap elemen punya nomor urut yang disebut **indeks**, dan hitungannya mulai dari **0**. Indeks negatif menghitung dari belakang.

```python
buah = ["apel", "jeruk", "mangga"]
print(buah[0])
print(buah[2])
print(buah[-1])
```

Meminta indeks yang tidak ada menghasilkan `IndexError`.

## Irisan

`list[awal:akhir]` mengambil sebagian list, mulai dari indeks `awal` sampai sebelum `akhir`. Hasilnya list baru.

```python
angka = [10, 20, 30, 40, 50]
print(angka[1:3])
print(angka[:2])
print(angka[3:])
```

## Mengubah isi list

List bisa diubah setelah dibuat.

```python
buah = ["apel", "jeruk"]
buah[0] = "anggur"
buah.append("mangga")
buah.insert(1, "pisang")
print(buah)

buah.remove("jeruk")
terakhir = buah.pop()
print(buah)
print(terakhir)
```

| Perintah | Kegunaan |
| --- | --- |
| `list[i] = x` | Mengganti elemen di indeks `i` |
| `append(x)` | Menambah `x` di akhir |
| `insert(i, x)` | Menyisipkan `x` di indeks `i` |
| `remove(x)` | Menghapus `x` yang pertama ditemukan |
| `pop()` | Mengambil dan menghapus elemen terakhir |
| `sort()` | Mengurutkan list itu sendiri |

## Memeriksa dan menelusuri

`in` memeriksa apakah sebuah nilai ada di dalam list. `for` menelusuri elemennya satu per satu.

```python
buah = ["apel", "jeruk", "mangga"]
print("jeruk" in buah)
print("durian" in buah)

for b in buah:
    print(b)
```

## Mengurutkan

`sort()` mengubah list aslinya. `sorted()` membiarkan list asli dan mengembalikan salinan yang terurut.

```python
angka = [30, 10, 20]
print(sorted(angka))
print(angka)

angka.sort()
print(angka)
```
