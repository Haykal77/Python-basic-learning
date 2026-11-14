// Menghidupkan latihan: tombol Jalankan, panel hasil, penjaga batas waktu, dan penyimpanan draf.
// Tanpa berkas ini halaman tetap utuh; tombol hanya muncul bila skrip ini berhasil jalan.
import { baca, ubah } from "./progres.js";

const BATAS_WAKTU_MS = 5000;

const akar = document.querySelector("[data-latihan]");
if (akar && "Worker" in window) pasang(akar);

function pasang(akar) {
  const kotakKode = akar.querySelector("[data-kode]");
  const tombol = akar.querySelector("[data-jalankan]");
  const hasil = akar.querySelector("[data-hasil]");
  const catatan = akar.querySelector("[data-tanpa-runtime]");
  const tes = JSON.parse(akar.querySelector("[data-tes]")?.textContent || "null") ?? [];

  const aturUlang = akar.querySelector("[data-atur-ulang]");
  const id = akar.dataset.id;

  let pekerja = null;
  let pewaktu = null;

  // Draf: kode terakhir pelajar dipulihkan saat halaman dibuka lagi, dan disimpan sesaat setelah ia berhenti mengetik.
  const kodeAwal = kotakKode.defaultValue;
  const draf = baca().pelajaran[id]?.kode;
  if (typeof draf === "string") kotakKode.value = draf;

  let penunda = null;
  const simpanDraf = () => {
    clearTimeout(penunda);
    // Kode yang sama dengan kode awal tidak perlu disimpan.
    ubah(id, { kode: kotakKode.value === kodeAwal ? undefined : kotakKode.value });
    aturUlang.hidden = kotakKode.value === kodeAwal;
  };
  kotakKode.addEventListener("input", () => {
    clearTimeout(penunda);
    penunda = setTimeout(simpanDraf, 400);
  });
  addEventListener("pagehide", () => penunda && simpanDraf());

  aturUlang.hidden = kotakKode.value === kodeAwal;
  aturUlang.addEventListener("click", () => {
    kotakKode.value = kodeAwal;
    simpanDraf();
    kotakKode.focus();
  });

  tombol.hidden = false;
  if (catatan) catatan.hidden = true;

  // Worker (dan runtime Python di dalamnya) baru diunduh saat pelajar mulai menyentuh latihan.
  const siapkan = () => {
    if (pekerja) return pekerja;
    pekerja = new Worker(new URL("./pekerja.js", import.meta.url), { type: "module" });
    pekerja.onmessage = ({ data }) => {
      if (data.jenis === "mulai") {
        tulisStatus("Menjalankan…");
        pewaktu = setTimeout(hentikan, BATAS_WAKTU_MS);
      } else if (data.jenis === "selesai") {
        clearTimeout(pewaktu);
        tampilkan(data);
        selesai();
      } else if (data.jenis === "gagal-muat") {
        // Runtime (.wasm) gagal diunduh. Worker tetap dipakai; ia akan mencoba mengunduh lagi pada klik berikutnya.
        gagalMuat();
      }
    };
    pekerja.onerror = () => {
      // Skrip worker atau micropython.mjs gagal diunduh. Buang worker agar klik berikutnya mencoba lagi.
      buang();
      gagalMuat();
    };
    return pekerja;
  };

  const gagalMuat = () => {
    clearTimeout(pewaktu);
    tulisStatus("Python gagal dimuat. Periksa koneksimu, lalu coba lagi.", "galat");
    selesai();
  };

  const buang = () => {
    pekerja?.terminate();
    pekerja = null;
  };

  // Perulangan tak berujung tidak bisa dihentikan dari dalam; worker dimatikan dan dibuat ulang saat dibutuhkan.
  const hentikan = () => {
    buang();
    tulisStatus(
      `Program dihentikan karena berjalan lebih dari ${BATAS_WAKTU_MS / 1000} detik. Periksa apakah ada perulangan yang tidak pernah berhenti.`,
      "galat"
    );
    selesai();
  };

  const selesai = () => {
    tombol.disabled = false;
    tombol.textContent = "Jalankan";
  };

  const jalankan = () => {
    if (tombol.disabled) return;
    tombol.disabled = true;
    tombol.textContent = "Berjalan…";
    tulisStatus("Memuat Python…");
    simpanDraf();
    siapkan().postMessage({ kode: kotakKode.value, tes });
  };

  function tulisStatus(teks, kelas) {
    hasil.hidden = false;
    hasil.replaceChildren(elemen("p", kelas ? `status ${kelas}` : "status", teks));
  }

  function tampilkan({ stdout, terpotong, galat, tes: hasilTes }) {
    const isi = [];
    if (stdout) isi.push(elemen("pre", "keluaran", stdout));
    if (terpotong) isi.push(elemen("p", "status", "Keluaran terlalu panjang dan dipotong."));
    if (galat) isi.push(elemen("pre", "keluaran galat", galat));
    if (!stdout && !galat) isi.push(elemen("p", "status", "Program selesai tanpa keluaran."));

    if (hasilTes.length) {
      const daftar = elemen("ul", "daftar-tes");
      for (const t of hasilTes) {
        const butir = elemen("li", t.lulus ? "lulus" : "gagal", `${t.lulus ? "✓" : "✗"} ${t.label}`);
        if (t.pesan) butir.append(elemen("pre", "rincian", t.pesan));
        daftar.append(butir);
      }
      isi.push(daftar);
      if (hasilTes.every((t) => t.lulus)) {
        isi.push(elemen("p", "status lulus", "Semua tes lulus."));
        ubah(id, { selesai: true });
      }
    }
    hasil.hidden = false;
    hasil.replaceChildren(...isi);
  }

  tombol.addEventListener("click", jalankan);
  kotakKode.addEventListener("focus", siapkan, { once: true });
  kotakKode.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      jalankan();
    }
  });
}

// Selalu lewat textContent: keluaran program pelajar tidak pernah ditafsirkan sebagai HTML.
function elemen(tag, kelas, teks) {
  const el = document.createElement(tag);
  if (kelas) el.className = kelas;
  if (teks != null) el.textContent = teks;
  return el;
}
