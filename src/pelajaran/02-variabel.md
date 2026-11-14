---
judul: Variabel dan tipe data
urutan: 2
roadmap: Variables and Data Types
ringkasan: Menyimpan nilai dengan nama, dan mengenal int, float, str, dan bool.
latihan:
  perintah: Dari variabel panjang dan lebar, hitung lalu cetak luas persegi panjangnya.
  kode_awal: |
    panjang = 8
    lebar = 5
    # hitung luas, lalu cetak hasilnya
  solusi: |
    panjang = 8
    lebar = 5
    luas = panjang * lebar
    print(luas)
  contoh_keluaran: |
    40
  tes:
    - jenis: keluaran
      ganti: { panjang: 8, lebar: 5 }
      harapan: "40\n"
    - jenis: keluaran
      ganti: { panjang: 12, lebar: 3 }
      harapan: "36\n"
---

**Variabel** adalah nama yang menunjuk ke sebuah nilai. Kamu membuatnya dengan tanda `=`.

```python
nama = "Sari"
umur = 17
print(nama)
print(umur)
```

Tanda `=` di sini berarti "simpan", bukan "sama dengan". Nilai di kanan disimpan ke nama di kiri. Nilai sebuah variabel boleh diganti kapan saja.

```python
skor = 10
skor = skor + 5
print(skor)
```

## Aturan nama variabel

- Hanya huruf, angka, dan garis bawah; tidak boleh diawali angka.
- Huruf besar dan kecil berbeda: `umur` dan `Umur` adalah dua variabel.
- Kesepakatan Python: huruf kecil dengan garis bawah, misalnya `nilai_rata_rata`.

## Tipe data dasar

Setiap nilai punya **tipe**. Tipe menentukan apa yang bisa dilakukan terhadap nilai itu.

| Tipe | Contoh | Dipakai untuk |
| --- | --- | --- |
| `int` | `17` | Bilangan bulat |
| `float` | `3.5` | Bilangan pecahan |
| `str` | `"Sari"` | Teks |
| `bool` | `True` | Benar atau salah |

Fungsi `type` memberi tahu tipe sebuah nilai.

```python
print(type(17))
print(type(3.5))
print(type("Sari"))
print(type(True))
```

Kamu tidak perlu menyebutkan tipe saat membuat variabel; Python menentukannya dari nilainya.

## Berhitung dengan variabel

```python
harga = 12000
jumlah = 3
total = harga * jumlah
print(total)
```

| Operator | Arti | Contoh | Hasil |
| --- | --- | --- | --- |
| `+` `-` `*` | tambah, kurang, kali | `7 * 2` | `14` |
| `/` | bagi (hasilnya selalu `float`) | `7 / 2` | `3.5` |
| `//` | bagi, dibulatkan ke bawah | `7 // 2` | `3` |
| `%` | sisa bagi | `7 % 2` | `1` |
| `**` | pangkat | `7 ** 2` | `49` |

## Menggabungkan teks dan angka

Awali string dengan huruf `f`, lalu tulis nama variabel di dalam kurung kurawal.

```python
nama = "Sari"
umur = 17
print(f"{nama} berumur {umur} tahun")
```
