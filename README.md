# Calculadora de interés compuesto

https://se608.github.io/interes-compuesto/

A static calculator: monthly contributions, compound interest, and time to reach a goal. Everything runs in the browser; no data is stored or sent.

## Structure

- `site/`: the published website (plain HTML, CSS and JS, no build step)
- `site/calc.js`: pure calculation logic, tested in `tests/`
- `.github/workflows/deploy.yml`: runs tests and HTML validation on every push and PR, and deploys `site/` to GitHub Pages from `main`

## Local development

```sh
npm ci
npm test
npm run lint
npm run serve
```
