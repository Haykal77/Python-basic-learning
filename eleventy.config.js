import * as esbuild from "esbuild";

// Konfigurasi Eleventy. Situs ini sengaja tanpa plugin: Markdown masuk, HTML statis keluar.
export default function (eleventyConfig) {
  // CSS dan JS disalin apa adanya; tidak ada bundler.
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });

  // Satu-satunya berkas yang dibundel: editor kode (CodeMirror terdiri dari banyak modul).
  // Hasilnya js/editor.js, dimuat belakangan oleh js/latihan.js.
  eleventyConfig.addWatchTarget("src/editor/");
  eleventyConfig.on("eleventy.before", async ({ directories }) => {
    await esbuild.build({
      entryPoints: ["src/editor/editor.js"],
      bundle: true,
      format: "esm",
      minify: true,
      target: "es2020",
      outfile: `${directories.output}js/editor.js`,
    });
  });

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

  // Tes latihan ditanam di halaman sebagai JSON untuk dipakai Web Worker (js/pekerja.js).
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
