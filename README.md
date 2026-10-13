# Calculadora de interés compuesto

https://se608.github.io/simulador-inversion/

A static calculator: monthly contributions, compound interest, and time to reach a goal. Everything runs in the browser; no data is stored or sent.

## Structure

- `site/`: the published website (plain HTML, CSS and JS, no build step)
- `site/calc.js`: pure calculation logic, tested in `tests/`
- `site/i18n.js`: page texts in Spanish and Polish, switched in the browser. The Spanish texts are also written in `index.html` as the default, so keep both in sync
- `.github/workflows/deploy.yml`: runs tests and HTML validation on every push and PR, and deploys `site/` to GitHub Pages from `main`

## Local development

```sh
npm ci
npm test
npm run lint
npm run serve
```

`site/og.png` is the preview image for shared links. Its source is `og/card.html`; after editing it, run `npm run og` (needs Google Chrome, macOS path) and commit the new PNG.

`404.html` uses absolute `/simulador-inversion/` paths (GitHub Pages serves it at any missing URL), so its home link and favicon only work on the deployed site.

The language switch runs in the browser, so the meta description and `og:` tags stay in Spanish: crawlers and link previews don't run JS. Translating them properly would need one URL per language (e.g. `/pl/` with `hreflang`).
