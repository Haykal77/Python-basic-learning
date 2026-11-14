// Menghidupkan latihan: tombol Jalankan, panel hasil, penjaga batas waktu, penyimpanan draf,
// editor kode, dan tab untuk layar sempit.
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

  // Kode dibaca dan ditulis lewat tiga fungsi ini saja. Awalnya sumbernya <textarea>;
  // bila editor berhasil dimuat, sumbernya berpindah ke editor tanpa mengubah kode lain di berkas ini.
  let editor = null;
  const ambilKode = () => (editor ? editor.ambil() : kotakKode.value);
  const isiKode = (teks) => {
    kotakKode.value = teks;
    editor?.isi(teks);
  };
  const fokusKode = () => (editor ? editor.fokus() : kotakKode.focus());

  // Draf: kode terakhir pelajar dipulihkan saat halaman dibuka lagi, dan disimpan sesaat setelah ia berhenti mengetik.
  const kodeAwal = kotakKode.defaultValue;
  const draf = baca().pelajaran[id]?.kode;
  if (typeof draf === "string") kotakKode.value = draf;

  let penunda = null;
  const simpanDraf = () => {
    clearTimeout(penunda);
    // Kode yang sama dengan kode awal tidak perlu disimpan.
    const kode = ambilKode();
    ubah(id, { kode: kode === kodeAwal ? undefined : kode });
    aturUlang.hidden = kode === kodeAwal;
  };
  const saatBerubah = () => {
    clearTimeout(penunda);
    penunda = setTimeout(simpanDraf, 400);
  };
  kotakKode.addEventListener("input", saatBerubah);
  addEventListener("pagehide", () => penunda && simpanDraf());

  aturUlang.hidden = kotakKode.value === kodeAwal;
  aturUlang.addEventListener("click", () => {
    isiKode(kodeAwal);
    simpanDraf();
    fokusKode();
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
    pindahTab("hasil");
    siapkan().postMessage({ kode: ambilKode(), tes });
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

  // Tab Materi / Kode / Hasil. Bilah tab hanya terlihat saat kontainer sempit (diatur CSS);
  // di layar lebar ketiganya tampil berdampingan dan atribut data-tab tidak berpengaruh.
  const pelajaran = document.querySelector(".pelajaran");
  const bilahTab = document.querySelector("[data-bilah-tab]");
  function pindahTab(nama) {
    if (!bilahTab) return;
    pelajaran.dataset.tab = nama;
    for (const t of bilahTab.querySelectorAll("[data-ke]")) {
      t.setAttribute("aria-current", String(t.dataset.ke === nama));
    }
    editor?.segarkan();
  }
  if (bilahTab) {
    bilahTab.hidden = false;
    pindahTab("materi");
    bilahTab.addEventListener("click", (e) => {
      const t = e.target.closest("[data-ke]");
      if (!t) return;
      pindahTab(t.dataset.ke);
      bilahTab.parentElement.scrollIntoView({ block: "start" });
    });
  }

  // Editor (CodeMirror) diunduh saat latihan mendekati layar. Bila gagal, <textarea> tetap dipakai.
  // Editor butuh shadow DOM dan adoptedStyleSheets agar gayanya lolos CSP situs (lihat src/editor/editor.js);
  // di browser lama yang tidak punya keduanya, editor tidak dimuat sama sekali.
  if ("IntersectionObserver" in window && "attachShadow" in Element.prototype && "adoptedStyleSheets" in document) {
    const pengamat = new IntersectionObserver(
      async (entri) => {
        if (!entri.some((e) => e.isIntersecting)) return;
        pengamat.disconnect();
        try {
          const { pasangEditor } = await import("./editor.js");
          editor = pasangEditor(kotakKode, { saatBerubah, saatJalankan: jalankan });
        } catch {
          editor = null;
        }
      },
      { rootMargin: "300px" }
    );
    pengamat.observe(akar);
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
