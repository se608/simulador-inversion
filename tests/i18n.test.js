import { test } from "node:test";
import assert from "node:assert/strict";
import { languages, messages } from "../site/i18n.js";

test("every language has the same keys as Spanish", () => {
  const spanishKeys = Object.keys(messages.es).sort();
  for (const language of languages) {
    assert.deepEqual(Object.keys(messages[language]).sort(), spanishKeys, language);
  }
});

test("Polish years use the three plural forms", () => {
  assert.equal(messages.pl.years(1), "1 rok");
  assert.equal(messages.pl.years(2), "2 lata");
  assert.equal(messages.pl.years(5), "5 lat");
  assert.equal(messages.pl.years(12), "12 lat");
  assert.equal(messages.pl.years(22), "22 lata");
});

test("Polish months use the three plural forms", () => {
  assert.equal(messages.pl.months(1), "1 miesiąc");
  assert.equal(messages.pl.months(3), "3 miesiące");
  assert.equal(messages.pl.months(11), "11 miesięcy");
});

test("Spanish years and months", () => {
  assert.equal(messages.es.years(1), "1 año");
  assert.equal(messages.es.years(20), "20 años");
  assert.equal(messages.es.months(1), "1 mes");
  assert.equal(messages.es.months(7), "7 meses");
});

test("Polish hero label uses 'po' with the locative", () => {
  assert.equal(messages.pl.heroLabel(1), "Wartość końcowa po 1 roku");
  assert.equal(messages.pl.heroLabel(2), "Wartość końcowa po 2 latach");
  assert.equal(messages.pl.heroLabel(20), "Wartość końcowa po 20 latach");
});
