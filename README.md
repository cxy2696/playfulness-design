# Playful Antiques

A two-page course project on recognising antiques through intuition — drawing on
cognitive science, history, and playful design, and applying it to elderly
cognitive therapy.

- **Presentation (scroll deck):** <https://cxy2696.github.io/playfulness-design/>
- **Interactive demo:** <https://cxy2696.github.io/playfulness-design/play.html>

## What is here

| Page | Contents |
| --- | --- |
| `index.html` | A ten-slide scroll deck: intuition without experience, cognitive science, history, playful design, application to elderly therapy, the proposed “Antique Intuition Quest”, benefits, and closing Q&A. |
| `play.html` | An interactive demo: a cabinet of antique automata with a lightbox, eleven historical facts, and a memory-to-keepsake prompt that can be printed. |

Supporting files:

```text
assets/
  css/site.css      design tokens, layout, header/footer, tables, dialogs
  css/deck.css      cover, slides, agenda, reading progress, slide dock
  css/play.css      galleries, fact cabinet, memory lab, print card
  js/app.js         theme, reading size, resilient image fallbacks
  js/deck.js        progress bar, active slide, arrow-key navigation
  js/play.js        lightbox, facts, memory game, clockwork surprise
  img/favicon.svg   gear mark
  img/image-unavailable.svg   graceful placeholder for dead image sources
```

No frameworks, build step, web fonts, or analytics. Styles and scripts are
served as plain static files.

## Accessibility and performance

The audience for this concept is older adults, so the site is built to be
comfortable to read and operate:

- **Keyboard support** — skip link, <kbd>←</kbd>/<kbd>→</kbd> to move between
  slides, <kbd>Esc</kbd> closes image dialogs, visible focus rings.
- **Reading controls** — text size from 100% to 140% and a light/dark theme
  toggle; both are remembered in `localStorage` and the theme follows the
  operating system by default.
- **Reduced motion** — `prefers-reduced-motion` disables the playful
  transitions and page shake.
- **Semantics** — landmark regions, one `<h1>` per page, ordered headings,
  table captions and row headers, figure captions, `aria-live` results and
  native `<dialog>` and `<progress>` elements.
- **Encoding** — the memory tool builds its output with `textContent`, not
  `innerHTML`, and the page has no third-party scripts.
- **Images** — lazy loading, intrinsic `width`/`height`, meaningful alt text,
  and a local fallback illustration when a third-party source disappears.
- **Printing** — slides print as a readable handout; a generated memory
  keepsake prints as a single card.

Measured with Lighthouse (local static server): Accessibility 100, Best
Practices 100, SEO 100 on both pages; Performance 98–100.

## Running locally

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

A static server is needed for correct paths; opening `index.html` directly from
the filesystem also works, but the browser may restrict some features.

## Deployment

The site is designed for GitHub Pages. If the live links above return 404,
enable Pages in **Settings → Pages → Deploy from a branch → `main` / `(root)`**.
No build command is required.

## Credits

Text and design: Xinyi Cui, November 2025. The academic sources discussed in the
presentation are named in the slides. Historical automata photographs are
credited in their captions (The Met, Wikimedia Commons, the Hermitage, and the
original publishers); all pictures were found directly by asking ChatGPT, as
noted on the pages, except the cover painting. The cover is Domenico Remps,
*Cabinet of Curiosities* (c. 1690), public domain, via Wikimedia Commons; the
optimised local copy is in `assets/img/`. Third-party images remain the property
of their sources and are linked, not redistributed.
