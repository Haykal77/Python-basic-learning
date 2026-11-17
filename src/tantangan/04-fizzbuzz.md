---
judul: FizzBuzz
tingkat: 2
urutan: 2
ringkasan: Soal klasik wawancara programmer, memadukan perulangan dan percabangan.
petunjuk:
  - "`range(1, n + 1)` menghasilkan 1 sampai `n`."
  - Periksa kelipatan 15 lebih dulu. Kalau kelipatan 3 diperiksa duluan, angka 15 tidak akan pernah mencetak `FizzBuzz`.
latihan:
  perintah: Cetak bilangan 1 sampai `n`, satu per baris, dengan aturan FizzBuzz.
  kode_awal: |
    n = 15
    # tulis jawabanmu di sini
  solusi: |
    n = 15
    for i in range(1, n + 1):
        if i % 15 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)
  contoh_keluaran: |
    1
    2
    Fizz
    4
    Buzz
    Fizz
    7
    8
    Fizz
    Buzz
    11
    Fizz
    13
    14
    FizzBuzz
  tes:
    - jenis: keluaran
      ganti: { n: 15 }
      harapan: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n"
    - jenis: keluaran
      ganti: { n: 5 }
      harapan: "1\n2\nFizz\n4\nBuzz\n"
    - jenis: keluaran
      ganti: { n: 1 }
      harapan: "1\n"
---

Cetak bilangan dari 1 sampai `n`, satu bilangan per baris, tetapi:

- bila bilangannya kelipatan 3, cetak `Fizz` sebagai gantinya;
- bila kelipatan 5, cetak `Buzz`;
- bila kelipatan 3 **dan** 5, cetak `FizzBuzz`.

Untuk `n = 5`, keluarannya lima baris: `1`, `2`, `Fizz`, `4`, `Buzz`.
