// Menjalankan setiap blok ```python di materi pada MicroPython, runtime yang sama dengan di browser.
// Tujuannya menangkap contoh yang jalan di CPython tetapi gagal di MicroPython sebelum pelajar menemukannya.
// Blok yang memang sengaja salah bisa dilewati dengan menulis ```python salah
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { loadMicroPython } from "@micropython/micropython-webassembly-pyscript/micropython.mjs";

const DIR = "src/pelajaran";
const POLA = /^```python[ \t]*\n([\s\S]*?)^```/gm;

let jumlah = 0;
let gagal = 0;

for (const berkas of readdirSync(DIR).filter((n) => n.endsWith(".md")).sort()) {
  const isi = readFileSync(join(DIR, berkas), "utf8").replace(/\r\n/g, "\n");
  let nomor = 0;
  for (const [, kode] of isi.matchAll(POLA)) {
    nomor += 1;
    jumlah += 1;
    // Interpreter baru per contoh, sama seperti di browser.
    const mp = await loadMicroPython({ stdout: () => {}, stderr: () => {}, linebuffer: false });
    try {
      mp.runPython(kode);
    } catch (e) {
      gagal += 1;
      console.log(`GAGAL ${berkas} contoh ke-${nomor}\n${kode.trimEnd()}\n--> ${String(e.message).trim()}\n`);
    }
  }
}

console.log(`${jumlah - gagal} dari ${jumlah} contoh berjalan di MicroPython.`);
process.exit(gagal ? 1 : 0);
