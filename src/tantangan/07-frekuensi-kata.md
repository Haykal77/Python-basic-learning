---
judul: Frekuensi kata
tingkat: 4
urutan: 1
ringkasan: Hitung berapa kali setiap kata muncul di dalam kalimat.
petunjuk:
  - "`kalimat.lower().split()` memecah kalimat menjadi list kata dalam huruf kecil."
  - Simpan hitungan di dictionary. `hitung.get(kata, 0) + 1` menambah hitungan, juga untuk kata yang baru pertama kali muncul.
  - "`sorted(hitung.items())` mengurutkan pasangan kata dan jumlahnya menurut abjad."
latihan:
  perintah: Cetak setiap kata yang berbeda di dalam `kalimat` beserta berapa kali kata itu muncul, satu kata per baris, urut abjad. Huruf besar dan kecil dianggap sama.
  kode_awal: |
    kalimat = "saya suka python dan saya suka kopi"
    # tulis jawabanmu di sini
  solusi: |
    kalimat = "saya suka python dan saya suka kopi"
    hitung = {}
    for kata in kalimat.lower().split():
        hitung[kata] = hitung.get(kata, 0) + 1
    for kata, jumlah in sorted(hitung.items()):
        print(kata, jumlah)
  contoh_keluaran: |
    dan 1
    kopi 1
    python 1
    saya 2
    suka 2
  tes:
    - jenis: keluaran
      ganti: { kalimat: "saya suka python dan saya suka kopi" }
      harapan: "dan 1\nkopi 1\npython 1\nsaya 2\nsuka 2\n"
    - jenis: keluaran
      ganti: { kalimat: "Ayo ayo AYO" }
      harapan: "ayo 3\n"
    - jenis: keluaran
      ganti: { kalimat: "satu" }
      harapan: "satu 1\n"
---

Hitung berapa kali setiap kata muncul di dalam `kalimat`. Kata dipisahkan spasi, dan huruf besar dan kecil dianggap sama, jadi "Ayo" dan "ayo" adalah kata yang sama.

Cetak setiap kata yang berbeda beserta jumlahnya, satu per baris, diurutkan menurut abjad. Untuk `kalimat = "Ayo ayo AYO"`, keluarannya satu baris: `ayo 3`.
