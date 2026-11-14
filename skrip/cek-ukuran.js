// Memeriksa anggaran ukuran (setelah gzip). Jalankan setelah `npm run build`.
// Keluar dengan kode 1 bila ada yang melewati batas, sehingga CI menolak deploy.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const AKAR = "_site";
const BATAS_HALAMAN_KB = 50; // HTML + CSS satu halaman
const BATAS_JS_KB = 30; // JavaScript milik situs (tanpa runtime Python)
const BATAS_RUNTIME_KB = 300; // runtime Python, dimuat hanya saat latihan disentuh

const kb = (...berkas) => berkas.reduce((n, b) => n + gzipSync(readFileSync(b)).length, 0) / 1024;

function semua(dir, akhiran) {
  return readdirSync(dir).flatMap((nama) => {
    const p = join(dir, nama);
    return statSync(p).isDirectory() ? semua(p, akhiran) : p.endsWith(akhiran) ? [p] : [];
  });
}

let gagal = false;
function lapor(ukuran, batas, nama) {
  const lolos = ukuran <= batas;
  if (!lolos) gagal = true;
  console.log(`${lolos ? "ok   " : "LEBIH"} ${ukuran.toFixed(1).padStart(6)} / ${String(batas).padStart(3)} KB  ${nama}`);
}

const css = join(AKAR, "css", "gaya.css");
for (const html of semua(AKAR, ".html")) lapor(kb(html, css), BATAS_HALAMAN_KB, relative(AKAR, html));
lapor(kb(...semua(join(AKAR, "js"), ".js")), BATAS_JS_KB, "js/ (semua skrip situs)");
lapor(kb(join(AKAR, "runtime", "micropython.mjs"), join(AKAR, "runtime", "micropython.wasm")), BATAS_RUNTIME_KB, "runtime/ (MicroPython)");

process.exit(gagal ? 1 : 0);
