---
judul: Dictionary
urutan: 11
roadmap: Dictionaries
ringkasan: Menyimpan pasangan kunci dan nilai — mengambil, mengubah, dan menelusuri isinya.
latihan:
  perintah: Cetak stok untuk buah yang diminta. Bila buah itu tidak ada di dalam dictionary, cetak "Tidak ada". Perhatikan bahwa stok 0 tetap harus dicetak sebagai 0.
  kode_awal: |
    stok = {"apel": 5, "jeruk": 0, "mangga": 12}
    buah = "apel"
    # cetak stok buah, atau "Tidak ada"
  solusi: |
    stok = {"apel": 5, "jeruk": 0, "mangga": 12}
    buah = "apel"
    if buah in stok:
        print(stok[buah])
    else:
        print("Tidak ada")
  contoh_keluaran: |
    5
  tes:
    - jenis: keluaran
      ganti: { buah: "apel" }
      harapan: "5\n"
    - jenis: keluaran
      ganti: { buah: "mangga" }
      harapan: "12\n"
    - jenis: keluaran
      ganti: { buah: "jeruk" }
      harapan: "0\n"
    - jenis: keluaran
      ganti: { buah: "durian" }
      harapan: "Tidak ada\n"
---

**Dictionary** menyimpan pasangan **kunci** dan **nilai**. Kalau list dicari lewat nomor urut, dictionary dicari lewat kunci, seperti kamus: cari katanya, dapat artinya.

```python
siswa = {"nama": "Sari", "umur": 17, "kelas": "11A"}
print(siswa["nama"])
print(siswa["umur"])
print(len(siswa))
```

Setiap kunci hanya boleh muncul sekali. Kunci biasanya berupa teks atau angka.

## Mengambil nilai dengan aman

Meminta kunci yang tidak ada lewat kurung siku menghasilkan `KeyError`. Metode `get` mengembalikan `None`, atau nilai cadangan yang kamu tentukan.

```python
siswa = {"nama": "Sari", "umur": 17}
print(siswa.get("umur"))
print(siswa.get("alamat"))
print(siswa.get("alamat", "belum diisi"))
```

`in` memeriksa apakah sebuah **kunci** ada.

```python
siswa = {"nama": "Sari", "umur": 17}
print("umur" in siswa)
print("alamat" in siswa)
```

## Menambah, mengubah, menghapus

Menulis ke kunci yang belum ada akan menambahkannya; menulis ke kunci yang sudah ada akan menggantinya.

```python
stok = {"apel": 5}
stok["jeruk"] = 8
stok["apel"] = stok["apel"] + 1
print(stok["apel"])
print(stok["jeruk"])

del stok["jeruk"]
print("jeruk" in stok)
```

## Menelusuri dictionary

`items()` memberikan pasangan kunci dan nilai, yang bisa langsung dibongkar ke dua variabel.

```python
harga = {"apel": 3000, "jeruk": 2500}
for buah, rupiah in sorted(harga.items()):
    print(buah, rupiah)
```

| Metode | Memberikan |
| --- | --- |
| `keys()` | Semua kunci |
| `values()` | Semua nilai |
| `items()` | Semua pasangan (kunci, nilai) |

```python
harga = {"apel": 3000, "jeruk": 2500}
print(sorted(harga.keys()))
print(sum(harga.values()))
```

Contoh di halaman ini memakai `sorted` saat menelusuri, supaya urutan keluarannya selalu sama. Python di komputermu menjaga urutan sesuai saat kunci dimasukkan, tetapi Python ringan yang menjalankan kode di halaman ini tidak menjamin hal itu.

## Menghitung dengan dictionary

Pola yang sering dipakai: kunci adalah benda yang dihitung, nilai adalah jumlahnya.

```python
huruf = "banana"
hitung = {}
for h in huruf:
    hitung[h] = hitung.get(h, 0) + 1

for h, n in sorted(hitung.items()):
    print(h, n)
```

## Dictionary di dalam list

Gabungan list dan dictionary cocok untuk data berbentuk tabel.

```python
daftar = [
    {"nama": "Sari", "nilai": 90},
    {"nama": "Budi", "nilai": 75},
]
for s in daftar:
    print(s["nama"], s["nilai"])
```
