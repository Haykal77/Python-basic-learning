// Beranda: tanda selesai, status kunci tantangan, ringkasan progres, dan ekspor/impor.
// Tanpa berkas ini daftar pelajaran dan tantangan tetap tampil lengkap sebagai tautan biasa.
import { baca, ekspor, impor, statusTantangan } from "./progres.js";

const ringkasan = document.querySelector("[data-progres]");
const kelola = document.querySelector("[data-kelola]");
const statusUmum = document.querySelector("[data-status-tantangan]");
let peta = null;
try {
  peta = JSON.parse(document.querySelector("[data-peta-tantangan]")?.textContent || "null");
} catch {
  peta = null;
}

// Kartu tantangan yang terkunci tidak bisa diklik: href disimpan dan dikembalikan saat terbuka.
function kunci(a, terkunci) {
  if (terkunci) {
    if (a.hasAttribute("href")) {
      a.dataset.href = a.getAttribute("href");
      a.removeAttribute("href");
    }
    a.setAttribute("aria-disabled", "true");
    a.toggleAttribute("data-terkunci", true);
  } else {
    if (a.dataset.href) {
      a.setAttribute("href", a.dataset.href);
      delete a.dataset.href;
    }
    a.removeAttribute("aria-disabled");
    a.toggleAttribute("data-terkunci", false);
  }
}

function tulis(el, teks) {
  if (!el) return;
  el.hidden = !teks;
  el.textContent = teks || "";
}

function gambar() {
  const data = baca();
  const selesai = (id) => data.pelajaran[id]?.selesai === true;

  const dasar = [...document.querySelectorAll("[data-daftar-dasar] [data-id]")];
  for (const el of dasar) el.toggleAttribute("data-selesai", selesai(el.dataset.id));
  const bagian = [`Materi dasar: ${dasar.filter((el) => selesai(el.dataset.id)).length} dari ${dasar.length} latihan selesai`];

  if (peta) {
    const st = statusTantangan(peta, data);
    const semua = peta.tingkat.flatMap((t) => t.item);
    bagian.push(`Tantangan: ${semua.filter((x) => selesai(x.id)).length} dari ${semua.length} selesai`);

    st.tingkat.forEach((t, i) => {
      const wadah = document.querySelector(`[data-tingkat="${i}"]`);
      if (!wadah) return;
      const lencana = wadah.querySelector("[data-lencana]");
      lencana.className = `lencana ${t.tuntas ? "tuntas" : t.terbuka ? "terbuka" : "terkunci"}`;
      tulis(lencana, t.tuntas ? "Selesai" : t.terbuka ? "Terbuka" : "Terkunci");

      const alasan = t.alasan;
      tulis(
        wadah.querySelector("[data-alasan]"),
        t.terbuka
          ? ""
          : alasan.jenis === "dasar"
            ? `Terbuka setelah semua latihan materi dasar selesai (${alasan.belum.length} lagi).`
            : `Terbuka setelah semua tantangan tingkat ${alasan.nama} selesai.`
      );

      for (const a of wadah.querySelectorAll("[data-id]")) {
        a.toggleAttribute("data-selesai", selesai(a.dataset.id));
        kunci(a, !t.terbuka);
      }
    });

    tulis(statusUmum, st.bebas ? "Semua tantangan sudah selesai. Semuanya terbuka tanpa syarat." : "");
  }

  if (ringkasan) tulis(ringkasan, bagian.join(" · "));
}

gambar();
// Progres bisa berubah di tab lain, atau saat pelajar kembali lewat tombol Back.
addEventListener("storage", gambar);
addEventListener("pageshow", gambar);

if (kelola) {
  kelola.hidden = false;
  const pesan = kelola.querySelector("[data-pesan]");
  const berkas = kelola.querySelector("[data-berkas]");

  kelola.querySelector("[data-ekspor]").addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([ekspor()], { type: "application/json" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "progres-belajar-python.json" });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    pesan.textContent = "Berkas progres diunduh.";
  });

  kelola.querySelector("[data-impor]").addEventListener("click", () => berkas.click());
  berkas.addEventListener("change", async () => {
    const f = berkas.files?.[0];
    if (!f) return;
    const hasil = impor(await f.text());
    pesan.textContent = hasil.ok ? `Progres dimuat: ${hasil.jumlah} pelajaran dan tantangan.` : hasil.pesan;
    berkas.value = "";
    gambar();
  });
}
