# Belajar Python

Situs statis untuk belajar Python, sesuai ADR-001. Isinya sebelas pelajaran dasar yang mengikuti bagian *Learn the Basics* roadmap Python dari roadmap.sh, sepuluh tantangan dalam lima tingkat kesulitan, dan daftar materi lanjutan (Struktur Data dan Algoritma) yang ditandai "Akan Datang".

## Menjalankan

```bash
npm install
npm run dev      # server lokal dengan muat ulang otomatis
npm run build    # hasil ke _site/
npm run pratinjau # build lalu sajikan _site/ di http://localhost:8081 (dengan service worker)
npm run ukuran   # periksa anggaran ukuran (jalankan setelah build)
npm run uji      # jalankan semua contoh kode di materi pada MicroPython
```

Butuh Node.js 18 atau lebih baru.

## Struktur

```
src/
  _data/situs.json        nama dan deskripsi situs
  _includes/dasar.njk     kerangka HTML semua halaman
  _includes/pelajaran.njk tata letak pelajaran: materi + latihan
  css/gaya.css            satu-satunya berkas CSS
  js/latihan.js           halaman: tombol Jalankan, panel hasil, batas waktu
  editor/editor.js        editor kode (CodeMirror); dibundel esbuild menjadi js/editor.js
  js/progres.js           baca/tulis progres dan draf di localStorage
  js/beranda.js           tanda selesai, ekspor dan impor progres
  js/daftar-sw.js         mendaftarkan service worker
  sw.njk                  service worker; menjadi /sw.js saat build
  _data/bangun.js         versi build (nama cache) dan penanda mode dev
  js/tes.js               aturan penilaian latihan (dipakai worker dan `npm run uji`)
  js/pekerja.js           Web Worker: memuat runtime, menjalankan kode dan tes
  index.njk               beranda: pelajaran dasar, tantangan, materi lanjutan
  pelajaran/*.md          satu berkas per pelajaran
  tantangan/*.md          satu berkas per tantangan
  _data/namaTingkat.json  nama kelima tingkat tantangan
  _data/lanjutan.json     daftar materi lanjutan "Akan Datang"
  _includes/tantangan.njk tata letak tantangan (dengan gerbang)
  _includes/bagian/       potongan templat: latihan dan bilah tab
  css/tanpa-js.css        dimuat hanya bila JavaScript mati
  js/gerbang.js           memeriksa apakah halaman tantangan boleh dibuka
skrip/cek-ukuran.js       pemeriksa anggaran ukuran
skrip/python.js           menjalankan Python di Node (dipakai build dan penguji)
skrip/uji-contoh.js       penguji contoh kode dan latihan di materi
.github/workflows/        deploy ke GitHub Pages
```

## Menambah pelajaran

Buat berkas baru di `src/pelajaran/`, misalnya `04-perulangan.md`:

```yaml
---
judul: Perulangan
urutan: 4
ringkasan: Satu kalimat yang tampil di daftar pelajaran.
latihan:
  perintah: Apa yang harus dikerjakan pelajar (teks polos).
  kode_awal: |
    # kode yang sudah terisi di editor
  solusi: |
    # jawaban acuan; tidak ditampilkan di situs, dipakai `npm run uji`
  contoh_keluaran: |
    keluaran yang ditampilkan saat pelajar membuka "Lihat keluaran"
  tes:
    - jenis: keluaran
      harapan: "teks persis\n"
---

Isi materi dalam Markdown.
```

`urutan` menentukan posisi di daftar dan tautan sebelum/sesudah. `roadmap` (opsional) adalah nama topik di roadmap Python roadmap.sh yang dicakup pelajaran itu; ditampilkan di atas judul.

Materi saat ini mengikuti bagian **Learn the Basics** roadmap tersebut: Basic Syntax, Variables and Data Types, Conditionals, Loops, Type Casting, Exceptions, Functions and Builtin Functions, Lists, Tuples, Sets, Dictionaries.

Tiga hal yang perlu diingat saat menulis materi, karena kode dijalankan MicroPython dan bukan CPython:

- Jangan membuat tes yang bergantung pada urutan `dict` atau `set`; pakai `sorted(...)`.
- Hindari tes pada keluaran bilangan pecahan yang panjang; format `float` bisa berbeda dari CPython.
- Irisan teks dengan langkah selain 1 (`teks[::-1]`) tidak didukung; untuk list didukung. Membalik teks: `"".join(reversed(teks))`.
- Hindari `{{`, `{%`, dan `{#` di dalam berkas pelajaran: Markdown diproses Nunjucks lebih dulu. Blok `latihan` boleh dihilangkan.

### Format tes

Tes ditanam di halaman sebagai JSON (`<script type="application/json" data-tes>`) dan dijalankan oleh `js/pekerja.js`.

| `jenis` | Lulus bila |
| --- | --- |
| `keluaran` | keluaran sama dengan `harapan` |
| `keluaran_diawali` | keluaran diawali `harapan`; baris baru di akhir `harapan` ikut dicocokkan, jadi `"Halo!\n"` berarti satu baris utuh |
| `jumlah_baris` | jumlah baris keluaran sama dengan `harapan` |

Spasi di akhir baris diabaikan. Untuk `keluaran` dan `jumlah_baris`, baris kosong di akhir keluaran juga diabaikan.

Kunci opsional `ganti` (misalnya `{ nilai: 60 }`) menjalankan ulang kode pelajar dengan baris `nilai = ...` diganti menjadi `nilai = 60`, agar jawaban yang hanya mencetak teks tidak lolos. Variabelnya harus ada di `kode_awal` sebagai penugasan tanpa indentasi. Bila pelajar menghapus atau mengganti nama variabel itu, tes gagal dengan pesan yang menjelaskannya.

## Keluaran contoh di materi

Setiap blok ```` ```python ```` di materi otomatis diikuti kotak **Keluaran**. Isinya tidak ditulis tangan: saat build, `eleventy.config.js` menjalankan kodenya dengan MicroPython yang sama seperti di browser, lalu menaruh hasilnya di bawah contoh. Karena itu keluaran yang dilihat pelajar selalu cocok dengan hasil sebenarnya, dan mengubah contoh otomatis mengubah keluarannya.

- Blok ```` ```python salah ```` menampilkan galatnya dengan tanda merah.
- Setiap contoh wajib mencetak sesuatu; `npm run uji` gagal bila ada contoh tanpa keluaran.
- Blok berbahasa lain (misalnya ```` ```text ````) tidak dijalankan.

## Tantangan

Sepuluh tantangan di `src/tantangan/`, dua per tingkat: Sangat Mudah, Mudah, Normal, Sulit, Sangat Sulit. Formatnya sama dengan pelajaran, ditambah:

```yaml
tingkat: 3          # 1 = Sangat Mudah ... 5 = Sangat Sulit
urutan: 1           # urutan di dalam tingkat itu
petunjuk:           # opsional, ditampilkan terlipat di bawah soal
  - Satu petunjuk per butir, boleh memakai `kode`.
```

Aturan kunci (ditentukan `statusTantangan` di `js/progres.js`):

1. Materi pelajaran tidak pernah dikunci dan boleh dibuka dalam urutan apa pun.
2. Tingkat pertama terbuka setelah semua latihan materi dasar selesai.
3. Setiap tingkat berikutnya terbuka setelah semua tantangan di tingkat-tingkat sebelumnya selesai.
4. Setelah semua tantangan pernah selesai, progres mencatat `bebas: true` dan semua tantangan terbuka tanpa syarat untuk seterusnya, termasuk bila nanti ditambah materi dasar baru.

Di beranda, kartu tantangan yang terkunci tidak bisa diklik dan tingkatnya menampilkan alasannya. Halaman tantangan yang dibuka langsung lewat alamatnya menampilkan pesan terkunci beserta tautan ke yang harus diselesaikan dulu. Tanpa JavaScript gerbang tidak bisa diperiksa, jadi soal ditampilkan apa adanya.

Kunci ini berjalan di browser pelajar, jadi bisa diakali oleh orang yang mengubah `localStorage`. Itu disengaja: tujuannya membimbing urutan belajar, bukan keamanan.

Id progres tantangan adalah nama berkasnya dengan awalan `tantangan-` (misalnya `tantangan-05-palindrom`). Seperti pelajaran, mengganti nama berkas memutus progres pelajar untuk tantangan itu.

## Materi lanjutan

Topik di `src/_data/lanjutan.json` tampil di beranda sebagai kartu bertanda "Akan Datang", tanpa tautan. Saat sebuah topik sudah ditulis, buat pelajarannya dan hapus topik itu dari berkas ini.

## Cara kode dijalankan

```
halaman (latihan.js)  --{ kode, tes }-->  Web Worker (pekerja.js)  -->  MicroPython (runtime/)
                      <--  mulai  ------
                      <--  selesai { stdout, galat, tes }  atau  gagal-muat  --
```

- Halaman hanya mengenal satu pesan masuk dan tiga pesan keluar (`mulai`, `selesai`, `gagal-muat`). Mengganti runtime (misalnya ke Pyodide) cukup dilakukan di `pekerja.js`.
- Worker dibuat saat pelajar menyentuh kotak kode atau menekan Jalankan, bukan saat halaman dibuka. Saat itu juga berkas `.wasm` mulai diunduh.
- `.wasm` diunduh sekali per worker, lalu disimpan di memori. Setiap interpreter baru memakai salinan itu tanpa mengunduh ulang.
- Setiap eksekusi memakai interpreter baru, jadi tidak ada variabel yang bocor antar-eksekusi. Tes dengan `ganti` juga mendapat interpreter sendiri.
- Batas waktu 5 detik baru dihitung setelah runtime siap (pesan `mulai`), jadi koneksi lambat tidak membuat program yang benar dianggap macet.
- Program yang berjalan lebih lama dari batas waktu dihentikan dengan mematikan worker, karena perulangan tak berujung tidak bisa dihentikan dari dalam. Worker baru dibuat pada klik berikutnya.
- Bila runtime gagal diunduh, halaman menampilkan pesan untuk memeriksa koneksi, dan klik berikutnya mencoba lagi.
- Keluaran dipotong pada 10.000 byte.
- Galat ditampilkan dengan bahasa yang lebih ramah, misalnya `Baris 3 di kodemu` sebagai ganti `File "<stdin>", line 3`.
- `input()` belum didukung dan menghasilkan pesan galat yang jelas.
- Ctrl+Enter (atau Cmd+Enter) di kotak kode sama dengan menekan Jalankan.
- Keluaran program selalu ditampilkan sebagai teks (`textContent`), tidak pernah ditafsirkan sebagai HTML.

Runtime disalin dari `node_modules/@micropython/micropython-webassembly-pyscript` ke `_site/runtime/` saat build, sehingga situs tidak bergantung pada CDN pihak ketiga.

### Anggaran ukuran

`npm run ukuran` menghitung ukuran setelah gzip dan gagal (kode keluar 1) bila ada yang melewati batas, sehingga CI menolak deploy.

| Bagian | Batas |
| --- | --- |
| Satu halaman (HTML + CSS) | 50 KB |
| Semua skrip situs (`js/`) | 30 KB |
| Runtime MicroPython (`runtime/`), dimuat hanya saat latihan disentuh | 300 KB |

## Aturan tata letak

- Satu kolom sebagai dasar. Dua kolom muncul saat **kontainer** pelajaran mencapai 56rem (`@container`), bukan pada lebar layar tertentu.
- Hanya unit relatif (`rem`, `ch`, `fr`, `clamp()`), tanpa lebar piksel tetap.
- Blok kode dan tabel digulir mendatar di dalam dirinya sendiri; halaman tidak pernah bergeser ke samping.
- Tema terang dan gelap mengikuti pengaturan perangkat.

## Deploy

`.github/workflows/deploy.yml` membangun dan menerbitkan ke GitHub Pages setiap ada push ke `main`. Sekali saja: buka Settings → Pages di repo, pilih Source "GitHub Actions". Untuk host lain (Cloudflare Pages, Netlify): perintah build `npm run build`, folder keluaran `_site`.

## Ketahanan (Fase 3)

### Offline

`sw.js` menyimpan beranda, semua halaman pelajaran, CSS, skrip, dan runtime Python saat kunjungan pertama. Setelah itu seluruh situs, termasuk menjalankan kode, bekerja tanpa koneksi.

- Strategi: cache dulu, jaringan bila belum ada.
- Setiap build memakai nama cache baru. Setelah deploy, pengunjung lama melihat versi baru pada kunjungan **berikutnya**, bukan seketika.
- Daftar halaman di `sw.js` diisi otomatis dari koleksi pelajaran; pelajaran baru tidak perlu didaftarkan manual.
- Service worker **tidak** didaftarkan saat `npm run dev`, agar cache tidak menyajikan berkas lama ketika mengedit. Untuk mencoba mode offline pakai `npm run pratinjau` (port 8081, sengaja berbeda dari port dev).
- Service worker hanya aktif di HTTPS atau `localhost`.

### Progres dan draf

Tersimpan di `localStorage` dengan kunci `belajar-python:progres`:

```json
{ "versi": 1, "pelajaran": { "03-percabangan": { "selesai": true, "kode": "..." } } }
```

- `selesai` ditandai saat semua tes sebuah latihan lulus. Draf kode disimpan sesaat setelah pelajar berhenti mengetik dan dipulihkan saat halaman dibuka lagi.
- Id pelajaran adalah nama berkasnya (`03-percabangan`). **Mengganti nama berkas pelajaran memutus progres pelajar untuk pelajaran itu.**
- Semua akses dibungkus `try/catch`. Bila penyimpanan penuh, diblokir, atau isinya rusak, situs tetap jalan tanpa fitur mengingat.
- Saat bentuk data berubah, naikkan `VERSI` di `js/progres.js` dan tambahkan langkah migrasi di fungsi `rapikan`.
- Di beranda, "Simpan atau pindahkan progres" mengunduh data sebagai berkas JSON atau memuatnya kembali. Impor menggabungkan, tidak menimpa: tanda selesai tidak pernah hilang.

### Content Security Policy

Dipasang lewat `<meta http-equiv>` di `_includes/dasar.njk`, sehingga berlaku di hosting statis mana pun. Hanya skrip, gaya, dan koneksi dari origin sendiri yang diizinkan; tidak ada skrip atau gaya inline. Akibatnya:

- Jangan menulis `<script>` inline atau atribut `style="..."`/`onclick="..."` di templat; taruh di berkas `js/` atau `css/`.
- `'wasm-unsafe-eval'` diperlukan untuk mengompilasi runtime Python; `blob:` di `connect-src` diperlukan karena worker memuat `.wasm` dari salinan di memori.
- `frame-ancestors` tidak bisa diatur lewat `<meta>`. Bila host mendukung header kustom, tambahkan di sana.

## Kenyamanan (Fase 4)

### Editor kode

`<textarea>` digantikan CodeMirror 6 (nomor baris, warna sintaks, indentasi otomatis empat spasi, Tab untuk indentasi) saat latihan mendekati layar. Bila editor gagal dimuat atau browsernya terlalu lama, `<textarea>` tetap dipakai dan semua fitur lain tetap jalan.

- `src/editor/editor.js` adalah satu-satunya berkas yang dibundel. Eleventy menjalankan esbuild sebelum setiap build; tidak ada perintah tambahan.
- `js/latihan.js` hanya mengenal empat fungsi editor: `ambil`, `isi`, `fokus`, `segarkan`. Mengganti editor cukup dilakukan di `src/editor/editor.js`.
- Editor dipasang di dalam **shadow root**. Ini bukan gaya-gayaan: di luar shadow root CodeMirror membuat elemen `<style>`, yang diblokir CSP situs dan membuat tombol Enter tidak berfungsi. Jangan pindahkan editor keluar dari shadow root tanpa mengubah CSP.
- Karena itu tampilan editor diatur di `src/editor/editor.js` (objek `tema` dan `warnaSintaks`), bukan di `gaya.css`. Warnanya memakai variabel CSS situs (`--tok-kata`, `--latar-kode`, dan lain-lain), jadi mengubah variabel di `gaya.css` tetap mengubah editor.
- Tab di dalam editor berarti indentasi. Untuk keluar dari editor dengan keyboard: Esc lalu Tab.

### Tab di layar sempit

Saat kontainer pelajaran lebih sempit dari 56rem, muncul tiga tab: Materi, Kode, Hasil. Menekan Jalankan otomatis berpindah ke Hasil. Di kontainer lebar ketiganya tampil berdampingan dan tab disembunyikan. Tanpa JavaScript tab tidak muncul dan semua bagian tampil berurutan.

### Menguji materi

`npm run uji` memeriksa pada MicroPython, runtime yang sama dengan di browser:

1. Setiap blok ```` ```python ```` di materi berjalan tanpa galat dan mencetak sesuatu. Blok yang memang sengaja salah ditulis ```` ```python salah ```` dan harus menghasilkan galat.
2. Setiap latihan dan tantangan bisa diselesaikan: `solusi` lulus semua tes, dan `kode_awal` tidak.
3. Setiap tantangan punya `tingkat` 1 sampai 5, dan setiap tingkat punya paling sedikit satu tantangan.

Penilaiannya memakai `src/js/tes.js`, berkas yang sama dengan yang dipakai di browser. CI menjalankannya sebelum build. `npm run uji -- --tampil` menampilkan keluaran setiap contoh, berguna untuk memeriksa bahwa penjelasan di materi cocok dengan hasil sebenarnya.

## Yang sengaja belum ada

- `input()`, dan sinkronisasi progres antar perangkat tanpa berkas.
