// Menguji materi dan tantangan pada MicroPython, runtime yang sama dengan di browser:
//   1. Setiap blok ```python di materi berjalan tanpa galat dan menghasilkan keluaran
//      (keluarannya ditampilkan di bawah contoh, jadi contoh tanpa keluaran tidak boleh ada).
//      Blok yang sengaja salah ditulis ```python salah dan harus MENGHASILKAN galat.
//   2. Setiap latihan bisa diselesaikan: `solusi` lulus semua tes, dan `kode_awal` tidak.
//   3. Setiap tantangan punya tingkat 1 sampai 5, dan setiap tingkat punya paling sedikit satu tantangan.
// Penilaian memakai src/js/tes.js, berkas yang sama dengan yang dipakai di browser.
// Jalankan dengan `npm run uji`; tambahkan `-- --tampil` untuk melihat keluaran setiap contoh.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { jalankanPython } from "./python.js";
import { periksaSemua } from "../src/js/tes.js";

const DIREKTORI = ["src/pelajaran", "src/tantangan"];
const POLA = /^```python([ \t]+salah)?[ \t]*\n([\s\S]*?)^```/gm;
const TAMPIL = process.argv.includes("--tampil");
const namaTingkat = JSON.parse(readFileSync("src/_data/namaTingkat.json", "utf8"));

const masalah = [];
let contoh = 0;
let latihan = 0;
const perTingkat = namaTingkat.map(() => 0);

for (const dir of DIREKTORI) {
  for (const nama of readdirSync(dir).filter((n) => n.endsWith(".md")).sort()) {
    const berkas = `${dir}/${nama}`;
    const { data, content } = matter(readFileSync(join(dir, nama), "utf8").replace(/\r\n/g, "\n"));

    let nomor = 0;
    for (const [, salah, kode] of content.matchAll(POLA)) {
      nomor += 1;
      contoh += 1;
      const h = await jalankanPython(kode);
      if (TAMPIL) console.log(`--- ${berkas} #${nomor}${salah ? " (salah)" : ""}\n${h.stdout}${h.galat ? `[galat] ${h.galat.split("\n").pop()}\n` : ""}`);
      if (!salah && h.galat) masalah.push(`${berkas} contoh ke-${nomor} gagal:\n${kode.trimEnd()}\n--> ${h.galat}`);
      if (!salah && !h.galat && !h.stdout.trim()) masalah.push(`${berkas} contoh ke-${nomor} tidak menghasilkan keluaran apa pun. Tambahkan print agar pelajar melihat hasilnya.`);
      if (salah && !h.galat) masalah.push(`${berkas} contoh ke-${nomor} ditandai "salah" tetapi berjalan tanpa galat.`);
    }

    if (dir === "src/tantangan") {
      if (!Number.isInteger(data.tingkat) || data.tingkat < 1 || data.tingkat > namaTingkat.length) {
        masalah.push(`${berkas}: tingkat harus bilangan 1 sampai ${namaTingkat.length}.`);
      } else {
        perTingkat[data.tingkat - 1] += 1;
      }
    }

    const l = data.latihan;
    if (!l) continue;
    latihan += 1;
    if (!l.tes?.length) masalah.push(`${berkas}: latihan tidak punya tes.`);
    if (!l.solusi) {
      masalah.push(`${berkas}: latihan tidak punya solusi.`);
      continue;
    }
    const nilai = async (kode) => periksaSemua(kode, l.tes, await jalankanPython(kode), jalankanPython);

    for (const t of (await nilai(l.solusi)).filter((t) => !t.lulus)) {
      masalah.push(`${berkas}: solusi tidak lulus "${t.label}".\n${t.pesan ?? ""}`);
    }
    if ((await nilai(l.kode_awal)).every((t) => t.lulus)) {
      masalah.push(`${berkas}: kode_awal sudah lulus semua tes, jadi latihannya tidak menguji apa pun.`);
    }
  }
}

perTingkat.forEach((n, i) => n === 0 && masalah.push(`Tingkat ${namaTingkat[i]} belum punya tantangan.`));

for (const m of masalah) console.log(`GAGAL ${m}\n`);
console.log(`${contoh} contoh dan ${latihan} latihan (termasuk ${perTingkat.reduce((a, b) => a + b, 0)} tantangan) diperiksa pada MicroPython, ${masalah.length} masalah.`);
process.exit(masalah.length ? 1 : 0);
