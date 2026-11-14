// Beranda: tanda selesai per pelajaran, ringkasan progres, dan ekspor/impor.
// Tanpa berkas ini daftar pelajaran tetap tampil lengkap.
import { baca, ekspor, impor } from "./progres.js";

const butir = [...document.querySelectorAll("[data-id]")];
const ringkasan = document.querySelector("[data-progres]");
const kelola = document.querySelector("[data-kelola]");

function gambar() {
  const { pelajaran } = baca();
  let selesai = 0;
  for (const el of butir) {
    const sudah = pelajaran[el.dataset.id]?.selesai === true;
    el.toggleAttribute("data-selesai", sudah);
    if (sudah) selesai += 1;
  }
  if (ringkasan && butir.length) {
    ringkasan.hidden = false;
    ringkasan.textContent = `${selesai} dari ${butir.length} latihan selesai`;
  }
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
    pesan.textContent = hasil.ok ? `Progres dimuat: ${hasil.jumlah} pelajaran.` : hasil.pesan;
    berkas.value = "";
    gambar();
  });
}
