// Logika penilaian latihan. Tidak bergantung pada browser maupun runtime Python:
// dipakai oleh Web Worker (js/pekerja.js) dan oleh penguji saat build (skrip/uji-contoh.js),
// sehingga keduanya pasti menilai dengan aturan yang sama.

// JSON hampir sama dengan literal Python, kecuali true/false/null.
export function literalPython(nilai) {
  if (nilai === true) return "True";
  if (nilai === false) return "False";
  if (nilai === null) return "None";
  return JSON.stringify(nilai);
}

// Mengganti nilai variabel tingkat atas, mis. { nilai: 60 } mengubah baris `nilai = 80`.
// Dipakai agar jawaban yang hanya mencetak teks jadi tidak lolos.
export function gantiVariabel(kode, ganti) {
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
    ? `Saat ${Object.entries(t.ganti).map(([k, v]) => `${k} = ${literalPython(v)}`).join(", ")}: `
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

// Menilai semua tes sebuah latihan.
//   kode     : kode pelajar
//   tes      : daftar tes dari front matter pelajaran
//   utama    : hasil menjalankan `kode` apa adanya ({ stdout, galat })
//   jalankan : fungsi async (kode) => { stdout, galat }, dipakai untuk tes yang mengganti variabel
export async function periksaSemua(kode, tes, utama, jalankan) {
  const hasil = [];
  for (const t of tes ?? []) {
    let h = utama;
    if (t.ganti) {
      const g = gantiVariabel(kode, t.ganti);
      if (g.hilang) {
        hasil.push({ label: labelTes(t), lulus: false, pesan: `Variabel ${g.hilang} tidak ditemukan. Jangan ubah namanya.` });
        continue;
      }
      h = await jalankan(g.kode);
    }
    hasil.push({ label: labelTes(t), ...nilaiTes(t, h) });
  }
  return hasil;
}
