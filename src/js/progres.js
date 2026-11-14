// Progres dan draf kode pelajar, disimpan di localStorage browser ini saja.
// Semua akses dibungkus try/catch: bila penyimpanan penuh, diblokir, atau isinya rusak,
// situs tetap jalan dan hanya kehilangan fitur mengingat.
//
// Bentuk data (versi 1):
//   { versi: 1, pelajaran: { "<id>": { selesai?: true, kode?: "..." } } }
const KUNCI = "belajar-python:progres";
const VERSI = 1;
const BATAS_KODE = 20000; // karakter per draf
const ID_SAH = /^[a-z0-9][a-z0-9-]{0,80}$/;

const kosong = () => ({ versi: VERSI, pelajaran: {} });

// Menerima data dari mana pun (localStorage lama, berkas impor) dan mengembalikan bentuk yang pasti sah.
// Saat skema berubah, tambahkan langkah migrasi di sini: if (d.versi === 1) { ...; d.versi = 2; }
function rapikan(d) {
  if (!d || typeof d !== "object" || !d.pelajaran || typeof d.pelajaran !== "object") return kosong();
  const hasil = kosong();
  for (const [id, p] of Object.entries(d.pelajaran)) {
    if (!ID_SAH.test(id) || !p || typeof p !== "object") continue;
    const bersih = {};
    if (p.selesai === true) bersih.selesai = true;
    if (typeof p.kode === "string") bersih.kode = p.kode.slice(0, BATAS_KODE);
    if (Object.keys(bersih).length) hasil.pelajaran[id] = bersih;
  }
  return hasil;
}

export function baca() {
  try {
    return rapikan(JSON.parse(localStorage.getItem(KUNCI)));
  } catch {
    return kosong();
  }
}

function simpan(d) {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(d));
    return true;
  } catch {
    return false; // penuh atau diblokir (mis. mode privat tertentu)
  }
}

// Mengubah satu pelajaran. Selalu membaca ulang dulu agar tab lain tidak tertimpa.
// Nilai undefined menghapus kunci itu.
export function ubah(id, perubahan) {
  if (!ID_SAH.test(id)) return false;
  const d = baca();
  const p = { ...d.pelajaran[id], ...perubahan };
  for (const k of Object.keys(p)) if (p[k] === undefined) delete p[k];
  d.pelajaran[id] = p;
  return simpan(rapikan(d));
}

export function ekspor() {
  return JSON.stringify(baca(), null, 2);
}

// Menggabungkan berkas ekspor ke data yang ada: "selesai" tidak pernah hilang, draf dari berkas menang.
export function impor(teks) {
  let masuk;
  try {
    masuk = JSON.parse(teks);
  } catch {
    return { ok: false, pesan: "Berkas ini bukan JSON yang sah." };
  }
  if (!masuk || typeof masuk !== "object" || typeof masuk.pelajaran !== "object") {
    return { ok: false, pesan: "Berkas ini bukan berkas progres Belajar Python." };
  }
  if (Number(masuk.versi) > VERSI) {
    return { ok: false, pesan: "Berkas ini dibuat oleh versi situs yang lebih baru." };
  }
  const baru = rapikan(masuk);
  const d = baca();
  for (const [id, p] of Object.entries(baru.pelajaran)) {
    d.pelajaran[id] = { ...d.pelajaran[id], ...p };
  }
  if (!simpan(d)) return { ok: false, pesan: "Progres tidak bisa disimpan di browser ini." };
  return { ok: true, jumlah: Object.keys(baru.pelajaran).length };
}
