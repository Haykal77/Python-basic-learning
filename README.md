# Belajar Python

Situs statis untuk belajar Python, sesuai ADR-001. Sudah mencakup **Fase 1** (materi statis yang terbaca tanpa JavaScript, tata letak cair), **Fase 2** (menjalankan kode pelajar di browser dengan MicroPython di dalam Web Worker), dan **Fase 3** (pemakaian offline, penyimpanan progres dan draf, Content Security Policy).

## Menjalankan

```bash
npm install
npm run dev      # server lokal dengan muat ulang otomatis
npm run build    # hasil ke _site/
npm run pratinjau # build lalu sajikan _site/ di http://localhost:8081 (dengan service worker)
npm run ukuran   # periksa anggaran ukuran (jalankan setelah build)
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
  js/progres.js           baca/tulis progres dan draf di localStorage
  js/beranda.js           tanda selesai, ekspor dan impor progres
  js/daftar-sw.js         mendaftarkan service worker
  sw.njk                  service worker; menjadi /sw.js saat build
  _data/bangun.js         versi build (nama cache) dan penanda mode dev
  js/pekerja.js           Web Worker: memuat runtime, menjalankan kode dan tes
  index.njk               daftar pelajaran
  pelajaran/*.md          satu berkas per pelajaran
skrip/cek-ukuran.js       pemeriksa anggaran ukuran
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
  contoh_keluaran: |
    keluaran yang ditampilkan saat pelajar membuka "Lihat keluaran"
  tes:
    - jenis: keluaran
      harapan: "teks persis\n"
---

Isi materi dalam Markdown.
```

`urutan` menentukan posisi di daftar dan tautan sebelum/sesudah. Blok `latihan` boleh dihilangkan.

### Format tes

Tes ditanam di halaman sebagai JSON (`<script type="application/json" data-tes>`) dan dijalankan oleh `js/pekerja.js`.

| `jenis` | Lulus bila |
| --- | --- |
| `keluaran` | keluaran sama dengan `harapan` |
| `keluaran_diawali` | keluaran diawali `harapan`; baris baru di akhir `harapan` ikut dicocokkan, jadi `"Halo!\n"` berarti satu baris utuh |
| `jumlah_baris` | jumlah baris keluaran sama dengan `harapan` |

Spasi di akhir baris diabaikan. Untuk `keluaran` dan `jumlah_baris`, baris kosong di akhir keluaran juga diabaikan.

Kunci opsional `ganti` (misalnya `{ nilai: 60 }`) menjalankan ulang kode pelajar dengan baris `nilai = ...` diganti menjadi `nilai = 60`, agar jawaban yang hanya mencetak teks tidak lolos. Variabelnya harus ada di `kode_awal` sebagai penugasan tanpa indentasi. Bila pelajar menghapus atau mengganti nama variabel itu, tes gagal dengan pesan yang menjelaskannya.

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

## Yang sengaja belum ada

- Editor CodeMirror dan tab untuk layar sempit (Fase 4).
- `input()`, dan sinkronisasi progres antar perangkat tanpa berkas.
