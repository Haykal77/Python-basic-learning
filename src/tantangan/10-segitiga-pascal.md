---
judul: Segitiga Pascal
tingkat: 5
urutan: 2
ringkasan: Bangun segitiga Pascal baris demi baris dengan list.
petunjuk:
  - Simpan baris yang sedang dibuat sebagai list, dimulai dari `[1]`.
  - "Baris berikutnya selalu diawali dan diakhiri 1. Di antaranya, setiap angka adalah `baris[j] + baris[j + 1]` dari baris sebelumnya."
  - Untuk mencetak list angka dipisahkan spasi, ubah dulu setiap angka menjadi teks lalu gabungkan dengan `" ".join(...)`.
latihan:
  perintah: Cetak `baris` baris pertama segitiga Pascal. Setiap baris berisi angka-angka yang dipisahkan spasi.
  kode_awal: |
    baris = 5
    # tulis jawabanmu di sini
  solusi: |
    baris = 5
    sekarang = [1]
    for i in range(baris):
        teks = []
        for x in sekarang:
            teks.append(str(x))
        print(" ".join(teks))

        berikut = [1]
        for j in range(len(sekarang) - 1):
            berikut.append(sekarang[j] + sekarang[j + 1])
        berikut.append(1)
        sekarang = berikut
  contoh_keluaran: |
    1
    1 1
    1 2 1
    1 3 3 1
    1 4 6 4 1
  tes:
    - jenis: keluaran
      ganti: { baris: 5 }
      harapan: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1\n"
    - jenis: keluaran
      ganti: { baris: 1 }
      harapan: "1\n"
    - jenis: keluaran
      ganti: { baris: 7 }
      harapan: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1\n1 5 10 10 5 1\n1 6 15 20 15 6 1\n"
---

**Segitiga Pascal** adalah susunan angka yang setiap barisnya dibangun dari baris di atasnya. Baris pertama hanya berisi `1`. Setiap baris berikutnya diawali dan diakhiri `1`, dan setiap angka di antaranya adalah jumlah dua angka yang berdampingan di baris atasnya.

```text
1
1 1
1 2 1
1 3 3 1
1 4 6 4 1
```

Angka `6` di baris kelima berasal dari `3 + 3` di baris keempat. Cetak `baris` baris pertama segitiga ini; nilai `baris` selalu paling sedikit 1.
