// Web Worker: satu-satunya tempat kode pelajar dijalankan.
// Antarmuka ke halaman hanya satu pesan masuk dan tiga pesan keluar:
//   masuk : { kode, tes }
//   keluar: { jenis: "mulai" }                                   runtime siap, eksekusi dimulai (penanda awal batas waktu)
//           { jenis: "selesai", stdout, terpotong, galat, tes }   hasil akhir
//           { jenis: "gagal-muat" }                               runtime tidak bisa diunduh atau dimuat
// Halaman tidak tahu runtime apa yang dipakai, jadi runtime bisa diganti tanpa menyentuh halaman.
import { loadMicroPython } from "../runtime/micropython.mjs";

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
    galat = rapikanGalat(e);
  }
  return { stdout: new TextDecoder().decode(new Uint8Array(byte)), terpotong, galat };
}

// Traceback MicroPython menyebut berkas "<stdin>"; bagi pemula "kodemu" lebih jelas.
function rapikanGalat(e) {
  const teks = String(e?.message ?? e).trim();
  return teks
    .split("\n")
    .filter((baris) => !/, in input$/.test(baris)) // bingkai milik PEMBUKA, bukan kode pelajar
    .join("\n")
    .replace(/File "<stdin>", line (\d+)(, in <module>)?/g, "Baris $1 di kodemu");
}

// JSON hampir sama dengan literal Python, kecuali true/false/null.
function literalPython(nilai) {
  if (nilai === true) return "True";
  if (nilai === false) return "False";
  if (nilai === null) return "None";
  return JSON.stringify(nilai);
}

// Mengganti nilai variabel tingkat atas, mis. { nilai: 60 } mengubah baris `nilai = 80`.
// Dipakai agar jawaban yang hanya mencetak teks jadi tidak lolos.
function gantiVariabel(kode, ganti) {
  let hasil = kode;
  for (const [nama, nilai] of Object.entries(ganti)) {
    const pola = new RegExp(`^${nama}[ \\t]*=(?!=).*$`, "m");
    if (!pola.test(hasil)) return { hilang: nama };
    hasil = hasil.replace(pola, () => `${nama} = ${literalPython(nilai)}`);
  }
  return { kode: hasil };
}

function labelTes(t) {
  const awalan = t.ganti
    ? `Saat ${Object.entries(t.ganti).map(([k, v]) => `${k} = ${v}`).join(", ")}: `
    : "";
  if (t.jenis === "keluaran") return `${awalan}keluaran sesuai`;
  if (t.jenis === "keluaran_diawali") return `${awalan}keluaran diawali teks yang diminta`;
  if (t.jenis === "jumlah_baris") return `${awalan}keluaran berisi ${t.harapan} baris`;
  return `${awalan}${t.jenis}`;
}

// Keluaran panjang cukup ditampilkan sekali di panel hasil; di rincian tes dipotong.
const ringkas = (s) => (s.length > 300 ? `${s.slice(0, 300)}…` : s);

function nilaiTes(t, h) {
  if (h.galat) return { lulus: false, pesan: "Program berhenti karena galat." };
  // Spasi di akhir baris dan baris kosong di akhir tidak dihitung salah.
  const rapi = (s) => String(s).replace(/[ \t]+$/gm, "").replace(/\n+$/, "");
  const keluar = rapi(h.stdout);
  const harap = rapi(t.harapan);

  if (t.jenis === "keluaran") {
    return keluar === harap
      ? { lulus: true }
      : { lulus: false, pesan: `Diharapkan:\n${harap}\nKeluaranmu:\n${ringkas(keluar) || "(kosong)"}` };
  }
  if (t.jenis === "keluaran_diawali") {
    // Baris baru di akhir `harapan` tetap dihitung, agar "Halo!\n" berarti satu baris utuh,
    // bukan sekadar awalan (yang akan meloloskan "Halo!!!").
    const tanpaSpasi = (s) => String(s).replace(/[ \t]+$/gm, "");
    return tanpaSpasi(h.stdout).startsWith(tanpaSpasi(t.harapan))
      ? { lulus: true }
      : { lulus: false, pesan: `Keluaran harus diawali:\n${harap}` };
  }
  if (t.jenis === "jumlah_baris") {
    const n = keluar === "" ? 0 : keluar.split("\n").length;
    return n === Number(t.harapan)
      ? { lulus: true }
      : { lulus: false, pesan: `Keluaranmu ${n} baris.` };
  }
  return { lulus: false, pesan: `Jenis tes tidak dikenal: ${t.jenis}` };
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
    const hasilTes = [];

    for (const t of tes ?? []) {
      let h = utama;
      if (t.ganti) {
        const g = gantiVariabel(kode, t.ganti);
        if (g.hilang) {
          hasilTes.push({ label: labelTes(t), lulus: false, pesan: `Variabel ${g.hilang} tidak ditemukan. Jangan ubah namanya.` });
          continue;
        }
        h = await jalankan(g.kode);
      }
      hasilTes.push({ label: labelTes(t), ...nilaiTes(t, h) });
    }

    self.postMessage({ jenis: "selesai", ...utama, tes: hasilTes });
  } catch {
    // Galat kode pelajar sudah ditangkap di jalankan(); yang sampai ke sini adalah runtime yang gagal dimuat.
    self.postMessage({ jenis: "gagal-muat" });
  }
};
