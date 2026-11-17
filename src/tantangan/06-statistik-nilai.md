---
judul: Statistik nilai
tingkat: 3
urutan: 2
ringkasan: Hitung nilai tertinggi, terendah, dan rata-rata dari sebuah list.
petunjuk:
  - Fungsi bawaan `max`, `min`, `sum`, dan `len` bekerja langsung pada list.
  - Rata-rata adalah jumlah dibagi banyaknya nilai. Pakai `//` agar hasilnya bilangan bulat yang dibulatkan ke bawah.
latihan:
  perintah: Cetak nilai tertinggi, terendah, dan rata-rata (dibulatkan ke bawah) dari list `nilai`, masing-masing di barisnya sendiri dengan format seperti contoh.
  kode_awal: |
    nilai = [80, 65, 90, 75]
    # tulis jawabanmu di sini
  solusi: |
    nilai = [80, 65, 90, 75]
    print(f"Tertinggi: {max(nilai)}")
    print(f"Terendah: {min(nilai)}")
    print(f"Rata-rata: {sum(nilai) // len(nilai)}")
  contoh_keluaran: |
    Tertinggi: 90
    Terendah: 65
    Rata-rata: 77
  tes:
    - jenis: keluaran
      ganti: { nilai: [80, 65, 90, 75] }
      harapan: "Tertinggi: 90\nTerendah: 65\nRata-rata: 77\n"
    - jenis: keluaran
      ganti: { nilai: [100] }
      harapan: "Tertinggi: 100\nTerendah: 100\nRata-rata: 100\n"
    - jenis: keluaran
      ganti: { nilai: [1, 2] }
      harapan: "Tertinggi: 2\nTerendah: 1\nRata-rata: 1\n"
---

Guru menyimpan nilai ulangan satu kelas di list `nilai`. Buat ringkasannya: nilai tertinggi, nilai terendah, dan rata-rata yang dibulatkan ke bawah. List tidak pernah kosong.

Untuk `nilai = [80, 65, 90, 75]`, jumlahnya 310 dan banyaknya 4, jadi rata-ratanya 77,5, dibulatkan ke bawah menjadi 77. Keluarannya:

```text
Tertinggi: 90
Terendah: 65
Rata-rata: 77
```
