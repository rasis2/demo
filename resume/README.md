# Dear Resume — Static Resume Builder

A fully client-side resume builder that runs on **GitHub Pages** — no backend,
no database, no account needed. Everything happens in your browser.

## Live URL

`https://rasis2.github.io/demo/resume/index.html`

(or open `resume/index.html` locally from `file://` — it works offline too)

## What it does

- Build a professional resume with 12 layouts × 16 color themes
- Auto-fill from an old resume (`.docx` / `.txt`, or pasted text) — parsed 100%
  in-browser
- ATS score checker (9 checks)
- Export/import your data as JSON, load an example, clear all
- Save as PDF via the browser print dialog
- **Auto-save**: your work is kept in `localStorage` on your own device
- **Donate**: a donation modal (QR + download), like the HALAU demo

## Files

```
index.html          → the page
app.js              → built bundle (React + the resume builder + mammoth)
tailwind.css        → built styles
qr.jpg              → donation QR code image
src/
  entry.jsx         → app entry (localStorage persistence + render)
  ResumeGenerator.jsx → the resume builder component
  build.js          → build script (esbuild + tailwind)
  input.css         → tailwind entry
package.json        → build dependencies
```

## Rebuilding after editing `src/`

```bash
npm install
npm run build
```

This regenerates `app.js` and `tailwind.css`. Commit those two files so
GitHub Pages serves the latest build (no build step runs on Pages).

## Removed backend features

The previous version (Supabase auth, saved resumes, dashboard, admin portal)
was removed to keep this working as a static page on GitHub Pages. If you ever
want those back, restore from git history.
