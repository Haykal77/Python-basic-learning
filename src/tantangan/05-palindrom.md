---
judul: Palindrom
tingkat: 3
urutan: 1
ringkasan: Periksa apakah sebuah kata atau kalimat sama bila dibaca dari belakang.
petunjuk:
  - "`teks.lower()` mengubah huruf menjadi kecil, `teks.replace(\" \", \"\")` membuang semua spasi."
  - "`\"\".join(reversed(teks))` membalik urutan huruf: `reversed` menelusuri dari belakang, `join` menyambungnya lagi menjadi teks."
  - Di Python biasa `teks[::-1]` juga membalik teks, tetapi Python ringan yang menjalankan kode di halaman ini belum mendukung irisan teks dengan langkah -1.
latihan:
  perintah: Cetak `Palindrom` bila `kalimat` sama dibaca dari depan maupun belakang, atau `Bukan palindrom` bila tidak. Abaikan huruf besar/kecil dan spasi.
  kode_awal: |
    kalimat = "katak"
    # tulis jawabanmu di sini
  solusi: |
    kalimat = "katak"
    rapi = kalimat.lower().replace(" ", "")
    if rapi == "".join(reversed(rapi)):
        print("Palindrom")
    else:
        print("Bukan palindrom")
  contoh_keluaran: |
    Palindrom
  tes:
    - jenis: keluaran
      ganti: { kalimat: "katak" }
      harapan: "Palindrom\n"
    - jenis: keluaran
      ganti: { kalimat: "Kasur Rusak" }
      harapan: "Palindrom\n"
    - jenis: keluaran
      ganti: { kalimat: "python" }
      harapan: "Bukan palindrom\n"
    - jenis: keluaran
      ganti: { kalimat: "A" }
      harapan: "Palindrom\n"
---

**Palindrom** adalah kata atau kalimat yang sama bila dibaca dari depan maupun dari belakang, seperti "katak" atau "kodok". Periksa apakah `kalimat` adalah palindrom.

Huruf besar dan kecil dianggap sama, dan spasi diabaikan. Jadi "Kasur Rusak" termasuk palindrom, karena tanpa spasi dan dalam huruf kecil bunyinya "kasurrusak".

| `kalimat` | Keluaran |
| --- | --- |
| `"katak"` | `Palindrom` |
| `"Kasur Rusak"` | `Palindrom` |
| `"python"` | `Bukan palindrom` |
