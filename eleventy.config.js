import * as esbuild from "esbuild";
import { jalankanPython } from "./skrip/python.js";
import { rapikanGalat } from "./src/js/tes.js";

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

  // --- Keluaran contoh di materi -------------------------------------------------------------
  // Setiap blok ```python di Markdown diikuti kotak "Keluaran". Isinya tidak ditulis tangan:
  // kodenya dijalankan saat build dengan MicroPython yang sama seperti di browser, jadi keluaran
  // yang dilihat pelajar selalu sama dengan hasil sebenarnya. Blok ```python salah menampilkan galatnya.
  //
  // Caranya dua langkah, karena markdown-it tidak bisa menunggu (async):
  //   1. Saat Markdown dirender, setiap blok python diberi penanda <!--keluaran:...--> berisi kodenya.
  //   2. Setelah halaman jadi, transform menjalankan kode di setiap penanda dan menggantinya dengan kotak keluaran.
  let md = null;
  eleventyConfig.amendLibrary("md", (pustaka) => {
    md = pustaka;
    const asli = pustaka.renderer.rules.fence;
    pustaka.renderer.rules.fence = (tokens, idx, options, env, self) => {
      const html = asli(tokens, idx, options, env, self);
      const [bahasa, tanda] = tokens[idx].info.trim().split(/\s+/);
      if (bahasa !== "python") return html;
      const kode = Buffer.from(tokens[idx].content, "utf8").toString("base64");
      return `${html}<!--keluaran:${tanda === "salah" ? "salah" : "biasa"}:${kode}-->\n`;
    };
  });

  // Hasil disimpan selama proses Eleventy hidup, jadi saat `npm run dev` hanya contoh yang berubah yang dijalankan ulang.
  const simpanan = new Map();
  const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  async function kotakKeluaran(kode, salah, asal) {
    if (!simpanan.has(kode)) simpanan.set(kode, await jalankanPython(kode));
    const h = simpanan.get(kode);
    if (h.galat && !salah) console.warn(`[keluaran] Contoh di ${asal} berhenti karena galat:\n${h.galat}\n`);
    if (!h.galat && salah) console.warn(`[keluaran] Contoh di ${asal} ditandai "salah" tetapi tidak menghasilkan galat.\n`);

    const teks = (h.stdout + (h.galat ? rapikanGalat(h.galat) : "")).replace(/\n+$/, "") || "(tidak ada keluaran)";
    const label = h.galat ? "Keluaran: program berhenti karena galat" : "Keluaran";
    return `<div class="keluaran-contoh${h.galat ? " galat" : ""}"><p class="label-keluaran">${label}</p><pre><code>${escape(teks)}</code></pre></div>\n`;
  }

  eleventyConfig.addTransform("keluaran-contoh", async function (isi) {
    if (!this.page.outputPath?.endsWith(".html") || !isi.includes("<!--keluaran:")) return isi;
    const potongan = [];
    let akhir = 0;
    for (const m of isi.matchAll(/<!--keluaran:(salah|biasa):([A-Za-z0-9+/=]+)-->\n?/g)) {
      potongan.push(isi.slice(akhir, m.index));
      const kode = Buffer.from(m[2], "base64").toString("utf8");
      potongan.push(await kotakKeluaran(kode, m[1] === "salah", this.page.inputPath));
      akhir = m.index + m[0].length;
    }
    potongan.push(isi.slice(akhir));
    return potongan.join("");
  });

  // Markdown satu baris untuk teks pendek di front matter (perintah latihan, petunjuk tantangan).
  eleventyConfig.addFilter("mdInline", (teks) => md.renderInline(String(teks ?? "")));

  // --- Koleksi ---------------------------------------------------------------------------------
  // Pelajaran diurutkan menurut `urutan` di front matter.
  eleventyConfig.addCollection("pelajaranUrut", (api) =>
    api.getFilteredByTag("pelajaran").sort((a, b) => a.data.urutan - b.data.urutan)
  );

  // Tantangan diurutkan menurut tingkat, lalu `urutan` di dalam tingkat itu.
  eleventyConfig.addCollection("tantanganUrut", (api) =>
    api.getFilteredByTag("tantangan").sort((a, b) => a.data.tingkat - b.data.tingkat || a.data.urutan - b.data.urutan)
  );

  // Peta tantangan: data yang dibutuhkan js/progres.js untuk menentukan tantangan mana yang terbuka.
  // Ditanam sebagai JSON di beranda dan di setiap halaman tantangan.
  // Id progres pelajaran = nama berkasnya; id progres tantangan diberi awalan "tantangan-" agar tidak bertabrakan.
  const awalan = (process.env.PATH_PREFIX || "/").replace(/\/$/, "");
  const idProgres = (p) => (p.data.tags?.includes("tantangan") ? `tantangan-${p.page.fileSlug}` : p.page.fileSlug);
  eleventyConfig.addFilter("petaTantangan", (koleksi, namaTingkat) => {
    const butir = (p) => ({ id: idProgres(p), judul: p.data.judul, ringkasan: p.data.ringkasan, url: awalan + p.url });
    return {
      dasar: koleksi.pelajaranUrut.filter((p) => p.data.latihan).map(butir),
      tingkat: namaTingkat.map((nama, i) => ({
        nama,
        item: koleksi.tantanganUrut.filter((p) => p.data.tingkat === i + 1).map(butir),
      })),
    };
  });

  // Data untuk JavaScript ditanam di halaman sebagai JSON.
  // "<" di-escape agar isinya tidak bisa menutup tag <script>.
  eleventyConfig.addFilter("json", (nilai) => JSON.stringify(nilai ?? null).replace(/</g, "\\u003c"));

  return {
    dir: { input: "src", output: "_site", includes: "_includes" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    // Saat di-host di subfolder (mis. GitHub Pages), set PATH_PREFIX=/nama-repo/
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
}
