---
judul: Bilangan prima
tingkat: 4
urutan: 2
ringkasan: Temukan semua bilangan prima sampai batas tertentu.
petunjuk:
  - Sebuah bilangan `n` prima bila tidak ada bilangan dari 2 sampai `n - 1` yang membaginya habis.
  - Perulangan di dalam perulangan diperlukan, dan `break` berguna untuk berhenti begitu ditemukan pembagi.
  - Kumpulkan bilangan prima sebagai teks di sebuah list, lalu gabungkan dengan `" ".join(daftar)`.
latihan:
  perintah: Cetak semua bilangan prima dari 2 sampai `batas` dalam satu baris, dipisahkan spasi. Bila tidak ada, cetak `Tidak ada`.
  kode_awal: |
    batas = 20
    # tulis jawabanmu di sini
  solusi: |
    batas = 20
    prima = []
    for n in range(2, batas + 1):
        punya_pembagi = False
        for p in range(2, n):
            if n % p == 0:
                punya_pembagi = True
                break
        if not punya_pembagi:
            prima.append(str(n))
    if prima:
        print(" ".join(prima))
    else:
        print("Tidak ada")
  contoh_keluaran: |
    2 3 5 7 11 13 17 19
  tes:
    - jenis: keluaran
      ganti: { batas: 20 }
      harapan: "2 3 5 7 11 13 17 19\n"
    - jenis: keluaran
      ganti: { batas: 2 }
      harapan: "2\n"
    - jenis: keluaran
      ganti: { batas: 1 }
      harapan: "Tidak ada\n"
    - jenis: keluaran
      ganti: { batas: 30 }
      harapan: "2 3 5 7 11 13 17 19 23 29\n"
---

**Bilangan prima** adalah bilangan bulat lebih dari 1 yang hanya habis dibagi 1 dan dirinya sendiri. Contohnya 2, 3, 5, 7, dan 11. Angka 1 bukan bilangan prima.

Cetak semua bilangan prima dari 2 sampai `batas` (termasuk `batas` itu sendiri bila prima), dalam satu baris dipisahkan spasi.

| `batas` | Keluaran |
| --- | --- |
| `20` | `2 3 5 7 11 13 17 19` |
| `2` | `2` |
| `1` | `Tidak ada` |
