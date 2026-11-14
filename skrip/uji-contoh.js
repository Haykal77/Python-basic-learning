// Menguji materi pada MicroPython, runtime yang sama dengan di browser. Dua pemeriksaan:
//   1. Setiap blok ```python di materi harus berjalan tanpa galat.
//      Blok yang memang sengaja salah ditulis ```python salah dan harus MENGHASILKAN galat.
//   2. Setiap latihan harus bisa diselesaikan: `solusi` lulus semua tes, dan `kode_awal` tidak.
// Penilaian memakai src/js/tes.js, berkas yang sama dengan yang dipakai di browser.
// Jalankan dengan `npm run uji`; tambahkan `-- --tampil` untuk melihat keluaran setiap contoh.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { loadMicroPython } from "@micropython/micropython-webassembly-pyscript/micropython.mjs";
import { periksaSemua } from "../src/js/tes.js";

const DIR = "src/pelajaran";
const POLA = /^```python([ \t]+salah)?[ \t]*\n([\s\S]*?)^```/gm;
const TAMPIL = process.argv.includes("--tampil");

// Interpreter baru per program, sama seperti di browser.
async function jalankan(kode) {
  const byte = [];
  const tampung = (b) => byte.push(...b);
  const mp = await loadMicroPython({ stdout: tampung, stderr: tampung, linebuffer: false });
  let galat = null;
  try {
    mp.runPython(kode);
  } catch (e) {
    galat = String(e.message).trim();
  }
  return { stdout: new TextDecoder().decode(new Uint8Array(byte)), galat };
}

const masalah = [];
let contoh = 0;
let latihan = 0;

for (const berkas of readdirSync(DIR).filter((n) => n.endsWith(".md")).sort()) {
  const { data, content } = matter(readFileSync(join(DIR, berkas), "utf8").replace(/\r\n/g, "\n"));

  let nomor = 0;
  for (const [, salah, kode] of content.matchAll(POLA)) {
    nomor += 1;
    contoh += 1;
    const h = await jalankan(kode);
    if (TAMPIL) console.log(`--- ${berkas} #${nomor}${salah ? " (salah)" : ""}\n${h.stdout}${h.galat ? `[galat] ${h.galat.split("\n").pop()}\n` : ""}`);
    if (!salah && h.galat) masalah.push(`${berkas} contoh ke-${nomor} gagal:\n${kode.trimEnd()}\n--> ${h.galat}`);
    if (salah && !h.galat) masalah.push(`${berkas} contoh ke-${nomor} ditandai "salah" tetapi berjalan tanpa galat.`);
  }

  const l = data.latihan;
  if (!l) continue;
  latihan += 1;
  if (!l.tes?.length) masalah.push(`${berkas}: latihan tidak punya tes.`);
  if (!l.solusi) {
    masalah.push(`${berkas}: latihan tidak punya solusi.`);
    continue;
  }
  const nilai = async (kode) => periksaSemua(kode, l.tes, await jalankan(kode), jalankan);

  const gagal = (await nilai(l.solusi)).filter((t) => !t.lulus);
  for (const t of gagal) masalah.push(`${berkas}: solusi tidak lulus "${t.label}".\n${t.pesan ?? ""}`);

  if ((await nilai(l.kode_awal)).every((t) => t.lulus)) {
    masalah.push(`${berkas}: kode_awal sudah lulus semua tes, jadi latihannya tidak menguji apa pun.`);
  }
}

for (const m of masalah) console.log(`GAGAL ${m}\n`);
console.log(`${contoh} contoh dan ${latihan} latihan diperiksa pada MicroPython, ${masalah.length} masalah.`);
process.exit(masalah.length ? 1 : 0);
