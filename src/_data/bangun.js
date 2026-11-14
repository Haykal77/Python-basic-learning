// Informasi tentang build yang sedang berjalan.
export default {
  // Berubah setiap build; dipakai sebagai nama cache service worker.
  versi: Date.now().toString(36),
  // "serve" saat `npm run dev`, "build" saat `npm run build`.
  // Service worker hanya didaftarkan di luar mode serve, agar cache tidak mengganggu saat mengedit.
  dev: process.env.ELEVENTY_RUN_MODE === "serve",
};
