---
judul: Percabangan
urutan: 3
ringkasan: Membuat program mengambil keputusan dengan if, elif, dan else.
latihan:
  perintah: Lengkapi program agar mencetak "Lulus" bila nilai 75 atau lebih, dan "Belum lulus" bila kurang dari 75. Programmu diuji dengan beberapa nilai, termasuk tepat 75.
  kode_awal: |
    nilai = 80
    # tulis percabanganmu di sini
  contoh_keluaran: |
    Lulus
  tes:
    - jenis: keluaran
      ganti: { nilai: 90 }
      harapan: "Lulus\n"
    - jenis: keluaran
      ganti: { nilai: 75 }
      harapan: "Lulus\n"
    - jenis: keluaran
      ganti: { nilai: 74 }
      harapan: "Belum lulus\n"
    - jenis: keluaran
      ganti: { nilai: 40 }
      harapan: "Belum lulus\n"
---

Dengan `if`, sebuah blok kode hanya dijalankan bila syaratnya benar.

```python
suhu = 34
if suhu > 30:
    print("Panas")
```

Perhatikan dua hal: titik dua di akhir baris `if`, dan **indentasi** empat spasi di baris berikutnya. Indentasi itulah yang memberi tahu Python baris mana yang termasuk di dalam `if`.

## Jika tidak

`else` menangani semua keadaan ketika syarat tidak terpenuhi.

```python
suhu = 24
if suhu > 30:
    print("Panas")
else:
    print("Tidak panas")
```

`else` tidak punya syarat sendiri: suhu 24 maupun suhu 5 sama-sama masuk ke sini.

## Lebih dari dua pilihan

`elif` menambahkan syarat berikutnya. Python memeriksa dari atas dan berhenti di syarat pertama yang benar.

```python
suhu = 18
if suhu > 30:
    print("Panas")
elif suhu > 20:
    print("Sejuk")
else:
    print("Dingin")
```

## Operator pembanding

| Operator | Arti |
| --- | --- |
| `==` | sama dengan |
| `!=` | tidak sama dengan |
| `>` dan `<` | lebih besar, lebih kecil |
| `>=` dan `<=` | lebih besar atau sama, lebih kecil atau sama |
