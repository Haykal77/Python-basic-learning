---
judul: Fungsi dan fungsi bawaan
urutan: 7
roadmap: Functions, Builtin Functions
ringkasan: Membungkus kode dalam fungsi dengan def, parameter, dan return, serta memakai fungsi bawaan Python.
latihan:
  perintah: Buat fungsi luas yang menerima dua sisi persegi panjang dan mengembalikan (return) luasnya. Baris print di bawah sudah memanggilnya.
  kode_awal: |
    sisi_a = 8
    sisi_b = 5

    # definisikan fungsi luas di sini

    print(luas(sisi_a, sisi_b))
  solusi: |
    sisi_a = 8
    sisi_b = 5

    def luas(panjang, lebar):
        return panjang * lebar

    print(luas(sisi_a, sisi_b))
  contoh_keluaran: |
    40
  tes:
    - jenis: keluaran
      ganti: { sisi_a: 8, sisi_b: 5 }
      harapan: "40\n"
    - jenis: keluaran
      ganti: { sisi_a: 3, sisi_b: 7 }
      harapan: "21\n"
    - jenis: keluaran
      ganti: { sisi_a: 10, sisi_b: 0 }
      harapan: "0\n"
---

**Fungsi** adalah sekumpulan perintah yang diberi nama. Sekali ditulis, ia bisa dipanggil berkali-kali, sehingga kode yang sama tidak perlu diulang.

## Membuat fungsi

Fungsi dibuat dengan `def`, diikuti nama, tanda kurung, dan titik dua. Isinya menjorok ke dalam.

```python
def sapa():
    print("Halo!")

sapa()
sapa()
```

Mendefinisikan fungsi tidak menjalankannya. Fungsi baru berjalan saat **dipanggil** dengan menulis namanya diikuti tanda kurung.

## Parameter

Parameter adalah variabel yang nilainya diisi saat fungsi dipanggil.

```python
def sapa(nama):
    print(f"Halo, {nama}!")

sapa("Sari")
sapa("Budi")
```

## Mengembalikan nilai

`return` mengirim hasil keluar dari fungsi, sehingga bisa disimpan atau dipakai dalam perhitungan lain.

```python
def kuadrat(angka):
    return angka * angka

hasil = kuadrat(4)
print(hasil)
print(kuadrat(3) + kuadrat(4))
```

`print` dan `return` sering tertukar. `print` hanya menampilkan ke layar; `return` memberikan nilai kepada pemanggil. Fungsi tanpa `return` mengembalikan `None`.

```python
def kuadrat_cetak(angka):
    print(angka * angka)

hasil = kuadrat_cetak(4)
print(hasil)
```

## Nilai bawaan parameter

Parameter boleh punya nilai bawaan, yang dipakai bila pemanggil tidak mengisinya.

```python
def sapa(nama, salam="Halo"):
    print(f"{salam}, {nama}!")

sapa("Sari")
sapa("Budi", "Selamat pagi")
sapa(salam="Hai", nama="Tini")
```

## Variabel di dalam fungsi

Variabel yang dibuat di dalam fungsi hanya ada di dalam fungsi itu.

```python
def hitung():
    sementara = 99
    return sementara

print(hitung())
```

Mencoba memakai `sementara` di luar fungsi menghasilkan `NameError`.

## Fungsi bawaan

Python sudah menyediakan banyak fungsi siap pakai. Kamu sudah bertemu `print`, `type`, `range`, `int`, dan `str`. Beberapa lainnya yang sering dipakai:

| Fungsi | Kegunaan | Contoh | Hasil |
| --- | --- | --- | --- |
| `len` | Panjang teks atau jumlah elemen | `len("Python")` | `6` |
| `max` | Nilai terbesar | `max(3, 9, 5)` | `9` |
| `min` | Nilai terkecil | `min(3, 9, 5)` | `3` |
| `sum` | Jumlah semua elemen | `sum([1, 2, 3])` | `6` |
| `abs` | Nilai mutlak | `abs(-7)` | `7` |
| `round` | Pembulatan | `round(3.7)` | `4` |
| `sorted` | Salinan yang sudah diurutkan | `sorted([3, 1, 2])` | `[1, 2, 3]` |

```python
print(len("Python"))
print(max(3, 9, 5))
print(sum([1, 2, 3]))
print(sorted([3, 1, 2]))
```

Sebelum menulis fungsi sendiri, periksa dulu apakah Python sudah punya fungsi bawaan untuk itu.
