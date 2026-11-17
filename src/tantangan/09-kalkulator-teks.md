---
judul: Kalkulator teks
tingkat: 5
urutan: 1
ringkasan: Hitung ekspresi seperti "12 + 7" dan tangani semua masukan yang salah.
petunjuk:
  - "`ekspresi.split()` memecah teks menjadi list menurut spasi, misalnya `[\"12\", \"+\", \"7\"]`."
  - Periksa dulu apakah hasil pecahannya tepat tiga bagian.
  - "`int()` melempar `ValueError` bila teksnya bukan angka. Tangkap dengan `try` dan `except`."
  - Periksa pembagian dengan nol sebelum membagi.
latihan:
  perintah: Hitung `ekspresi` berbentuk `angka operator angka` lalu cetak hasilnya. Untuk masukan yang salah, cetak pesan yang sesuai dengan tabel di soal.
  kode_awal: |
    ekspresi = "12 + 7"
    # tulis jawabanmu di sini
  solusi: |
    ekspresi = "12 + 7"
    bagian = ekspresi.split()
    if len(bagian) != 3:
        print("Format salah")
    else:
        kiri, operator, kanan = bagian
        try:
            a = int(kiri)
            b = int(kanan)
        except ValueError:
            print("Angka tidak valid")
        else:
            if operator == "+":
                print(a + b)
            elif operator == "-":
                print(a - b)
            elif operator == "*":
                print(a * b)
            elif operator == "/":
                if b == 0:
                    print("Tidak bisa membagi dengan nol")
                else:
                    print(a // b)
            else:
                print("Operator tidak dikenal")
  contoh_keluaran: |
    19
  tes:
    - jenis: keluaran
      ganti: { ekspresi: "12 + 7" }
      harapan: "19\n"
    - jenis: keluaran
      ganti: { ekspresi: "6 * 7" }
      harapan: "42\n"
    - jenis: keluaran
      ganti: { ekspresi: "-5 - 3" }
      harapan: "-8\n"
    - jenis: keluaran
      ganti: { ekspresi: "20 / 3" }
      harapan: "6\n"
    - jenis: keluaran
      ganti: { ekspresi: "5 / 0" }
      harapan: "Tidak bisa membagi dengan nol\n"
    - jenis: keluaran
      ganti: { ekspresi: "a * 2" }
      harapan: "Angka tidak valid\n"
    - jenis: keluaran
      ganti: { ekspresi: "3 % 2" }
      harapan: "Operator tidak dikenal\n"
    - jenis: keluaran
      ganti: { ekspresi: "10 +" }
      harapan: "Format salah\n"
---

Buat kalkulator sederhana. Variabel `ekspresi` berisi teks dengan bentuk `angka operator angka`, dipisahkan spasi, misalnya `"12 + 7"`. Angkanya bilangan bulat dan boleh negatif.

Operator yang didukung adalah `+`, `-`, `*`, dan `/`. Untuk `/`, pakai pembagian bulat (`//`), jadi `"20 / 3"` menghasilkan `6`.

Kalkulator yang baik tidak boleh berhenti karena galat. Untuk masukan yang salah, cetak pesan berikut:

| Keadaan | Contoh `ekspresi` | Keluaran |
| --- | --- | --- |
| Tidak tepat tiga bagian | `"10 +"` | `Format salah` |
| Angka bukan bilangan bulat | `"a * 2"` | `Angka tidak valid` |
| Operator lain | `"3 % 2"` | `Operator tidak dikenal` |
| Membagi dengan nol | `"5 / 0"` | `Tidak bisa membagi dengan nol` |
