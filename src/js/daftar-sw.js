// Mendaftarkan service worker setelah halaman selesai dimuat, agar tidak berebut jaringan dengan materi.
// Gagal mendaftar bukan masalah: situs tetap jalan, hanya tanpa mode offline.
if ("serviceWorker" in navigator) {
  addEventListener("load", () => {
    navigator.serviceWorker.register(new URL("../sw.js", import.meta.url)).catch(() => {});
  });
}
