---
judul: Genap atau ganjil
tingkat: 1
urutan: 1
ringkasan: Tentukan apakah sebuah bilangan bulat genap atau ganjil.
petunjuk:
  - Bilangan genap habis dibagi 2, artinya sisa baginya 0.
  - Operator `%` memberikan sisa bagi.
latihan:
  perintah: Cetak `Genap` bila `angka` genap, atau `Ganjil` bila ganjil.
  kode_awal: |
    angka = 7
    # tulis jawabanmu di sini
  solusi: |
    angka = 7
    if angka % 2 == 0:
        print("Genap")
    else:
        print("Ganjil")
  contoh_keluaran: |
    Ganjil
  tes:
    - jenis: keluaran
      ganti: { angka: 7 }
      harapan: "Ganjil\n"
    - jenis: keluaran
      ganti: { angka: 10 }
      harapan: "Genap\n"
    - jenis: keluaran
      ganti: { angka: 0 }
      harapan: "Genap\n"
    - jenis: keluaran
      ganti: { angka: -3 }
      harapan: "Ganjil\n"
---

Diberikan sebuah bilangan bulat di variabel `angka`. Tentukan apakah bilangan itu genap atau ganjil.

| `angka` | Keluaran |
| --- | --- |
| `7` | `Ganjil` |
| `10` | `Genap` |
| `0` | `Genap` |

Jawabanmu diuji dengan beberapa nilai `angka`, termasuk nol dan bilangan negatif.
