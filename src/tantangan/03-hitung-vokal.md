---
judul: Hitung huruf vokal
tingkat: 2
urutan: 1
ringkasan: Hitung berapa banyak huruf vokal di dalam sebuah kata.
petunjuk:
  - "`for huruf in kata:` menelusuri huruf satu per satu."
  - "`kata.lower()` mengubah semua huruf menjadi huruf kecil, jadi `A` dan `a` bisa diperlakukan sama."
  - "`huruf in \"aiueo\"` bernilai `True` bila `huruf` adalah vokal."
latihan:
  perintah: Cetak jumlah huruf vokal (a, i, u, e, o) di dalam `kata`. Huruf besar dan kecil dihitung sama.
  kode_awal: |
    kata = "pemrograman"
    # tulis jawabanmu di sini
  solusi: |
    kata = "pemrograman"
    jumlah = 0
    for huruf in kata.lower():
        if huruf in "aiueo":
            jumlah = jumlah + 1
    print(jumlah)
  contoh_keluaran: |
    4
  tes:
    - jenis: keluaran
      ganti: { kata: "pemrograman" }
      harapan: "4\n"
    - jenis: keluaran
      ganti: { kata: "Python" }
      harapan: "1\n"
    - jenis: keluaran
      ganti: { kata: "AIUEO" }
      harapan: "5\n"
    - jenis: keluaran
      ganti: { kata: "xyz" }
      harapan: "0\n"
---

Hitung berapa banyak huruf vokal di dalam `kata`. Yang dihitung sebagai vokal hanya a, i, u, e, dan o, baik huruf besar maupun kecil.

| `kata` | Keluaran |
| --- | --- |
| `"pemrograman"` | `4` |
| `"Python"` | `1` |
| `"AIUEO"` | `5` |
