// Gerbang tantangan: memutuskan apakah halaman tantangan boleh menampilkan soalnya.
// Aturannya ada di statusTantangan (js/progres.js); berkas ini hanya menerapkannya ke halaman.
//
// Soal tantangan dirender dengan atribut `hidden`. Bila terbuka, soal ditampilkan; bila terkunci,
// muncul pesan berisi apa yang harus diselesaikan dulu. Tanpa JavaScript, css/tanpa-js.css
// menampilkan soal apa adanya (gerbang tidak bisa diperiksa, dan kode juga tidak bisa dijalankan).
import { statusTantangan, tandaiBebas } from "./progres.js";

function bacaPeta() {
  try {
    return JSON.parse(document.querySelector("[data-peta-tantangan]")?.textContent || "null");
  } catch {
    return null;
  }
}

// Mengembalikan true bila isi halaman boleh ditampilkan. Halaman tanpa gerbang (pelajaran biasa) selalu true.
// Bila data peta tidak ada atau rusak, gerbang dibuka: lebih baik pelajar bisa belajar daripada terkunci karena galat.
export function bukaGerbang() {
  const gerbang = document.querySelector("[data-gerbang]");
  if (!gerbang) return true;
  const isi = document.querySelector("[data-isi-tantangan]");

  const peta = bacaPeta();
  const id = gerbang.dataset.id;
  const indeks = peta ? peta.tingkat.findIndex((t) => t.item.some((x) => x.id === id)) : -1;
  const tingkat = indeks >= 0 ? statusTantangan(peta).tingkat[indeks] : null;

  if (!tingkat || tingkat.terbuka) {
    gerbang.hidden = true;
    isi.hidden = false;
    return true;
  }

  gerbang.replaceChildren(...pesanTerkunci(tingkat.alasan, gerbang.dataset.beranda));
  return false;
}

function pesanTerkunci(alasan, beranda) {
  const judul = elemen("p", "", "");
  judul.append(elemen("strong", "", "Tantangan ini masih terkunci."));

  const penjelasan =
    alasan.jenis === "dasar"
      ? `Tantangan terbuka setelah semua latihan materi dasar selesai. Masih ada ${alasan.belum.length} yang belum:`
      : `Selesaikan dulu semua tantangan tingkat ${alasan.nama}. Yang belum selesai:`;

  const daftar = elemen("ul", "", null);
  for (const x of alasan.belum) {
    const tautan = elemen("a", "", x.judul);
    tautan.href = x.url;
    const li = elemen("li", "", null);
    li.append(tautan);
    daftar.append(li);
  }

  const kembali = elemen("a", "", "Kembali ke daftar tantangan");
  kembali.href = `${beranda}#tantangan`;
  const pKembali = elemen("p", "", null);
  pKembali.append(kembali);

  return [judul, elemen("p", "", penjelasan), daftar, pKembali];
}

// Dipanggil setelah sebuah latihan lulus. Bila semua tantangan sudah selesai, catat agar
// semuanya tetap terbuka tanpa syarat, termasuk bila nanti ada materi dasar baru.
export function periksaBebas() {
  const peta = bacaPeta();
  if (peta && statusTantangan(peta).semuaTuntas) tandaiBebas();
}

function elemen(tag, kelas, teks) {
  const el = document.createElement(tag);
  if (kelas) el.className = kelas;
  if (teks != null) el.textContent = teks;
  return el;
}
