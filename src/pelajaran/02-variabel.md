---
judul: Variabel dan tipe data
urutan: 2
ringkasan: Menyimpan nilai dengan nama, lalu memakainya kembali.
latihan:
  perintah: Dari variabel panjang dan lebar, hitung lalu cetak luas persegi panjangnya.
  kode_awal: |
    panjang = 8
    lebar = 5
    # hitung luas, lalu cetak hasilnya
  contoh_keluaran: |
    40
  tes:
    - jenis: keluaran
      harapan: "40\n"
---

**Variabel** adalah nama yang menunjuk ke sebuah nilai. Kamu membuatnya dengan tanda `=`.

```python
nama = "Sari"
umur = 17
print(nama)
print(umur)
```

Tanda `=` di sini berarti "simpan", bukan "sama dengan". Nilai di kanan disimpan ke nama di kiri.

## Tipe data dasar

| Tipe | Contoh | Dipakai untuk |
| --- | --- | --- |
| `int` | `17` | Bilangan bulat |
| `float` | `3.14` | Bilangan pecahan |
| `str` | `"Sari"` | Teks |
| `bool` | `True` | Benar atau salah |

## Berhitung dengan variabel

```python
harga = 12000
jumlah = 3
total = harga * jumlah
print(total)
```

Operator yang paling sering dipakai: `+` tambah, `-` kurang, `*` kali, `/` bagi.

## Menggabungkan teks dan angka

Awali string dengan huruf `f`, lalu tulis nama variabel di dalam kurung kurawal.

```python
nama = "Sari"
umur = 17
print(f"{nama} berumur {umur} tahun")
```
