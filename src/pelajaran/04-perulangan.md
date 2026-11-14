---
judul: Perulangan
urutan: 4
roadmap: Loops
ringkasan: Mengulang perintah dengan for dan while, serta break dan continue.
latihan:
  perintah: Jumlahkan semua bilangan bulat dari 1 sampai batas, lalu cetak hasilnya. Untuk batas 5 hasilnya 15.
  kode_awal: |
    batas = 5
    total = 0
    # tambahkan 1, 2, ... sampai batas ke total

    print(total)
  solusi: |
    batas = 5
    total = 0
    for i in range(1, batas + 1):
        total = total + i

    print(total)
  contoh_keluaran: |
    15
  tes:
    - jenis: keluaran
      ganti: { batas: 5 }
      harapan: "15\n"
    - jenis: keluaran
      ganti: { batas: 1 }
      harapan: "1\n"
    - jenis: keluaran
      ganti: { batas: 10 }
      harapan: "55\n"
    - jenis: keluaran
      ganti: { batas: 100 }
      harapan: "5050\n"
---

Perulangan menjalankan blok kode yang sama berkali-kali. Python punya dua jenis: `for` dan `while`.

## for dengan range

`range(5)` menghasilkan bilangan 0 sampai 4. Bilangan terakhir **tidak** ikut.

```python
for i in range(5):
    print(i)
```

Dengan dua angka, `range(awal, akhir)` mulai dari `awal` dan berhenti sebelum `akhir`. Angka ketiga adalah langkahnya.

```python
for i in range(1, 6):
    print(i)

for i in range(0, 10, 2):
    print(i)
```

## for pada teks

`for` bisa menelusuri apa pun yang berisi banyak elemen, termasuk huruf-huruf sebuah string.

```python
for huruf in "Python":
    print(huruf)
```

## while

`while` mengulang selama syaratnya benar. Pakai `while` saat kamu tidak tahu di awal berapa kali harus mengulang.

```python
hitung = 3
while hitung > 0:
    print(hitung)
    hitung = hitung - 1
print("Meluncur!")
```

Pastikan ada sesuatu di dalam blok yang akhirnya membuat syarat menjadi salah. Kalau tidak, perulangan tidak pernah berhenti. Di halaman ini program seperti itu dihentikan otomatis setelah 5 detik.

## break dan continue

`break` keluar dari perulangan saat itu juga. `continue` melompat ke putaran berikutnya.

```python
for i in range(1, 10):
    if i == 6:
        break
    if i % 2 == 0:
        continue
    print(i)
```

Program di atas mencetak 1, 3, 5: bilangan genap dilewati, dan perulangan berhenti saat `i` mencapai 6.

## Mengumpulkan hasil

Pola yang sangat sering dipakai: siapkan variabel di luar perulangan, lalu perbarui di dalamnya.

```python
total = 0
for i in range(1, 4):
    total = total + i
print(total)
```
