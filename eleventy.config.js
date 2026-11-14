// Konfigurasi Eleventy. Situs ini sengaja tanpa plugin: Markdown masuk, HTML statis keluar.
export default function (eleventyConfig) {
  // CSS dan JS disalin apa adanya; tidak ada bundler.
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });

  // Runtime Python di-host di origin sendiri (bukan CDN pihak ketiga): hanya dua berkas ini yang dipakai.
  const mp = "node_modules/@micropython/micropython-webassembly-pyscript";
  eleventyConfig.addPassthroughCopy({
    [`${mp}/micropython.mjs`]: "runtime/micropython.mjs",
    [`${mp}/micropython.wasm`]: "runtime/micropython.wasm",
  });

  // Pelajaran diurutkan menurut `urutan` di front matter.
  eleventyConfig.addCollection("pelajaranUrut", (api) =>
    api
      .getFilteredByTag("pelajaran")
      .sort((a, b) => a.data.urutan - b.data.urutan)
  );

  // Tes latihan ditanam di halaman sebagai JSON untuk dipakai Fase 2 (Web Worker).
  // "<" di-escape agar isi tes tidak bisa menutup tag <script>.
  eleventyConfig.addFilter("json", (nilai) =>
    JSON.stringify(nilai ?? null).replace(/</g, "\\u003c")
  );

  return {
    dir: { input: "src", output: "_site", includes: "_includes" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    // Saat di-host di subfolder (mis. GitHub Pages), set PATH_PREFIX=/nama-repo/
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
}
