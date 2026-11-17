// Menjalankan kode Python di Node dengan MicroPython yang sama seperti di browser.
// Dipakai saat build (kotak keluaran contoh di materi) dan oleh `npm run uji`.
import { loadMicroPython } from "@micropython/micropython-webassembly-pyscript/micropython.mjs";

// Interpreter baru setiap kali, sama seperti di browser, sehingga tidak ada variabel yang bocor antar-contoh.
// Mengembalikan { stdout, galat }; galat berisi traceback mentah, atau null bila program selesai normal.
export async function jalankanPython(kode) {
  const byte = [];
  const tampung = (b) => {
    for (const x of b) byte.push(x);
  };
  const mp = await loadMicroPython({ stdout: tampung, stderr: tampung, linebuffer: false });
  let galat = null;
  try {
    mp.runPython(kode);
  } catch (e) {
    galat = String(e?.message ?? e).trim();
  }
  return { stdout: new TextDecoder().decode(new Uint8Array(byte)), galat };
}
