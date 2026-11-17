// Web Worker: satu-satunya tempat kode pelajar dijalankan.
// Antarmuka ke halaman hanya satu pesan masuk dan tiga pesan keluar:
//   masuk : { kode, tes }
//   keluar: { jenis: "mulai" }                                   runtime siap, eksekusi dimulai (penanda awal batas waktu)
//           { jenis: "selesai", stdout, terpotong, galat, tes }   hasil akhir
//           { jenis: "gagal-muat" }                               runtime tidak bisa diunduh atau dimuat
// Halaman tidak tahu runtime apa yang dipakai, jadi runtime bisa diganti tanpa menyentuh halaman.
import { loadMicroPython } from "../runtime/micropython.mjs";
import { periksaSemua, rapikanGalat } from "./tes.js";

const BATAS_KELUARAN = 10000; // byte; sisanya dibuang agar halaman tidak macet

// loadMicroPython mengunduh .wasm setiap kali interpreter dibuat. Berkas itu diunduh sekali saja
// ke memori, lalu setiap interpreter baru memakai salinan lokal (blob:) sehingga cepat dan tanpa jaringan.
let runtime = null; // Promise<string> berisi URL blob .wasm
function siapkanRuntime() {
  runtime ??= (async () => {
    const res = await fetch(new URL("../runtime/micropython.wasm", import.meta.url));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = new Blob([await res.arrayBuffer()], { type: "application/wasm" });
    return URL.createObjectURL(blob);
  })().catch((e) => {
    runtime = null; // biarkan klik berikutnya mencoba lagi
    throw e;
  });
  return runtime;
}

// Worker dibuat saat pelajar menyentuh kotak kode; mulai mengunduh runtime saat itu juga.
siapkanRuntime().catch(() => {});

// input() butuh stdin sinkron, yang tidak ada di worker. Beri pesan yang jelas daripada macet.
const PEMBUKA = `
def input(*a):
    raise OSError("input() belum didukung di halaman ini")
`;

// Menjalankan satu program di interpreter baru, sehingga tidak ada variabel yang bocor antar-eksekusi.
async function jalankan(kode) {
  const url = await siapkanRuntime();
  const byte = [];
  let terpotong = false;
  const tampung = (b) => {
    if (byte.length < BATAS_KELUARAN) byte.push(...b);
    else terpotong = true;
  };

  const mp = await loadMicroPython({ url, linebuffer: false, stdout: tampung, stderr: tampung });
  let galat = null;
  try {
    mp.runPython(PEMBUKA);
    mp.runPython(kode);
  } catch (e) {
    galat = rapikanGalat(e?.message ?? e);
  }
  return { stdout: new TextDecoder().decode(new Uint8Array(byte)), terpotong, galat };
}

self.onmessage = async ({ data }) => {
  const { kode, tes } = data;

  // Unduhan runtime terjadi di sini, sebelum batas waktu mulai dihitung di halaman.
  try {
    await siapkanRuntime();
  } catch {
    self.postMessage({ jenis: "gagal-muat" });
    return;
  }
  self.postMessage({ jenis: "mulai" });

  try {
    const utama = await jalankan(kode);
    const hasilTes = await periksaSemua(kode, tes, utama, jalankan);

    self.postMessage({ jenis: "selesai", ...utama, tes: hasilTes });
  } catch {
    // Galat kode pelajar sudah ditangkap di jalankan(); yang sampai ke sini adalah runtime yang gagal dimuat.
    self.postMessage({ jenis: "gagal-muat" });
  }
};
