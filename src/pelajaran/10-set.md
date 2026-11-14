---
judul: Set
urutan: 10
roadmap: Sets
ringkasan: Kumpulan nilai unik tanpa urutan — menghapus duplikat dan operasi himpunan.
latihan:
  perintah: Cetak berapa banyak kata yang berbeda di dalam list. Untuk list di bawah jawabannya 3.
  kode_awal: |
    kata = ["apel", "jeruk", "apel", "mangga", "jeruk"]
    # hitung kata yang berbeda, lalu cetak
  solusi: |
    kata = ["apel", "jeruk", "apel", "mangga", "jeruk"]
    print(len(set(kata)))
  contoh_keluaran: |
    3
  tes:
    - jenis: keluaran
      ganti: { kata: ["apel", "jeruk", "apel", "mangga", "jeruk"] }
      harapan: "3\n"
    - jenis: keluaran
      ganti: { kata: ["a", "a", "a"] }
      harapan: "1\n"
    - jenis: keluaran
      ganti: { kata: ["a", "b", "c", "d"] }
      harapan: "4\n"
---

**Set** adalah kumpulan nilai yang **unik** dan **tidak berurutan**. Nilai yang sama tidak bisa masuk dua kali. Set ditulis dengan kurung kurawal.

```python
angka = {3, 1, 2, 3, 1}
print(len(angka))
print(sorted(angka))
```

Meski lima nilai ditulis, isinya hanya tiga. Karena set tidak punya urutan, urutan saat dicetak bisa berbeda dari urutan saat ditulis; contoh di atas memakai `sorted` agar hasilnya pasti.

## Tidak ada indeks

Set tidak punya urutan, jadi tidak ada elemen "pertama" atau "ke-2". Meminta `angka[0]` menghasilkan `TypeError`.

## Menambah, menghapus, memeriksa

```python
buah = {"apel", "jeruk"}
buah.add("mangga")
buah.add("apel")
buah.discard("jeruk")
print(sorted(buah))
print("mangga" in buah)
```

Memeriksa keanggotaan dengan `in` pada set jauh lebih cepat daripada pada list yang panjang.

## Menghapus duplikat

Cara paling singkat membuang duplikat dari list: ubah menjadi set.

```python
nama = ["Sari", "Budi", "Sari", "Tini", "Budi"]
unik = set(nama)
print(len(unik))
print(sorted(unik))
```

## Set kosong

`{}` membuat dictionary kosong, bukan set. Set kosong dibuat dengan `set()`.

```python
kosong = set()
print(len(kosong))
print(type(kosong))
```

## Operasi himpunan

Set mendukung operasi himpunan dari matematika.

```python
futsal = {"Sari", "Budi", "Tini"}
basket = {"Budi", "Tini", "Andi"}

print(sorted(futsal.union(basket)))
print(sorted(futsal.intersection(basket)))
print(sorted(futsal.difference(basket)))
```

| Metode | Operator | Hasil |
| --- | --- | --- |
| `a.union(b)` | gabungan | Semua anggota `a` dan `b` |
| `a.intersection(b)` | irisan | Yang ada di keduanya |
| `a.difference(b)` | selisih | Yang ada di `a` tetapi tidak di `b` |
