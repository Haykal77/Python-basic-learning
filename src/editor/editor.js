// Editor kode (CodeMirror 6). Berkas ini dibundel oleh esbuild menjadi js/editor.js
// dan baru diunduh saat latihan mendekati layar; <textarea> tetap menjadi cadangan.
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, drawSelection, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { indentUnit, indentOnInput, bracketMatching, syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { python } from "@codemirror/lang-python";
import { tags as t } from "@lezer/highlight";

// Semua warna memakai variabel CSS situs (didefinisikan di gaya.css), jadi editor ikut tema terang/gelap.
// Variabel CSS menembus shadow DOM; aturan CSS biasa tidak. Karena itu tampilan editor diatur di sini, bukan di gaya.css.
const tema = EditorView.theme({
  "&": {
    color: "var(--teks)",
    backgroundColor: "var(--latar-kode)",
    border: "1px solid var(--garis)",
    borderRadius: "0.5rem",
    minHeight: "10rem",
    maxHeight: "60dvh",
  },
  "&.cm-focused": { outline: "0.15rem solid var(--aksen)", outlineOffset: "0.15rem" },
  ".cm-scroller": { fontFamily: "var(--huruf-kode)", fontSize: "max(0.875rem, 0.9em)", lineHeight: "1.5", overflow: "auto" },
  ".cm-content": { padding: "0.6rem 0", caretColor: "var(--teks)" },
  ".cm-gutters": {
    backgroundColor: "transparent",
    color: "var(--teks-redup)",
    borderRight: "1px solid var(--garis)",
    borderRadius: "0.5rem 0 0 0.5rem",
  },
  ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "color-mix(in srgb, var(--teks) 6%, transparent)" },
  ".cm-cursor": { borderLeftColor: "var(--teks)" },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground": {
    backgroundColor: "color-mix(in srgb, var(--aksen) 30%, transparent)",
  },
  "&.cm-focused .cm-matchingBracket": { backgroundColor: "color-mix(in srgb, var(--aksen) 25%, transparent)" },
});

const warnaSintaks = HighlightStyle.define([
  { tag: [t.keyword, t.operatorKeyword, t.bool, t.null], color: "var(--tok-kata)" },
  { tag: t.string, color: "var(--tok-teks)" },
  { tag: t.number, color: "var(--tok-angka)" },
  { tag: t.comment, color: "var(--tok-komentar)", fontStyle: "italic" },
]);

// Menggantikan <textarea> dengan editor. Mengembalikan antarmuka kecil yang dipakai latihan.js,
// sehingga latihan.js tidak perlu tahu editor apa yang ada di baliknya.
export function pasangEditor(textarea, { saatBerubah, saatJalankan }) {
  // Editor dipasang di dalam shadow root. Di sana CodeMirror memasang gayanya lewat adoptedStyleSheets,
  // yang diizinkan CSP situs; di luar shadow root ia membuat elemen <style>, yang diblokir `style-src 'self'`
  // dan membuat editor rusak (baris baru tidak berfungsi).
  const wadah = document.createElement("div");
  wadah.className = "editor";
  const akar = wadah.attachShadow({ mode: "open" });

  const view = new EditorView({
    doc: textarea.value,
    root: akar,
    parent: akar,
    extensions: [
      lineNumbers(),
      history(),
      drawSelection(),
      highlightActiveLine(),
      indentOnInput(),
      bracketMatching(),
      python(),
      indentUnit.of("    "),
      EditorState.tabSize.of(4),
      tema,
      syntaxHighlighting(warnaSintaks),
      keymap.of([
        { key: "Mod-Enter", run: () => (saatJalankan(), true) },
        indentWithTab, // Tab = indentasi. Untuk keluar dari editor dengan keyboard: Esc lalu Tab.
        ...defaultKeymap,
        ...historyKeymap,
      ]),
      EditorView.updateListener.of((u) => u.docChanged && saatBerubah()),
      EditorView.contentAttributes.of({ "aria-label": "Kode kamu" }),
    ],
  });

  const sedangFokus = document.activeElement === textarea;
  const kursor = textarea.selectionStart;
  textarea.after(wadah);
  textarea.hidden = true;
  if (sedangFokus) {
    view.dispatch({ selection: { anchor: Math.min(kursor, view.state.doc.length) } });
    view.focus();
  }

  return {
    ambil: () => view.state.doc.toString(),
    isi: (teks) => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: teks } }),
    fokus: () => view.focus(),
    segarkan: () => view.requestMeasure(), // dipanggil setelah editor muncul dari tab tersembunyi
  };
}
