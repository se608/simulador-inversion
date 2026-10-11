// Texts shown on the page, in each supported language. No DOM here, so it can be tested with Node.
// Plain strings are static texts (used by data-i18n in index.html); functions build texts with numbers.

export const languages = ["es", "pl"];

// Polish has three plural forms: 1 rok, 2–4 lata (also 22–24...), 5+ lat (also 0 and 12–14).
const polishPlural = new Intl.PluralRules("pl");

function polishYears(n) {
  const forms = { one: "rok", few: "lata", many: "lat" };
  return n + " " + forms[polishPlural.select(n)];
}

function polishMonths(n) {
  const forms = { one: "miesiąc", few: "miesiące", many: "miesięcy" };
  return n + " " + forms[polishPlural.select(n)];
}

// "after N years": po 1 roku, po 2 latach, po 5 latach. After "po" every n ≥ 2 uses "latach".
function polishAfterYears(n) {
  return n === 1 ? "po 1 roku" : "po " + n + " latach";
}

function spanishYears(n) {
  return n === 1 ? "1 año" : n + " años";
}

function spanishMonths(n) {
  return n === 1 ? "1 mes" : n + " meses";
}

export const messages = {
  es: {
    pageTitle: "Calculadora de interés compuesto",
    languageLabel: "Idioma",
    title: "Calculadora de interés compuesto",
    lead: "Mira cuánto crece tu ahorro con aportes mensuales, y cuánto te toma llegar a una meta. Montos en pesos chilenos (CLP).",
    initialLabel: "Monto inicial",
    monthlyLabel: "Aporte mensual",
    rateLabel: "Rentabilidad anual",
    rateHelp: "Usa rentabilidad real (sin inflación), p. ej. 3–5%.",
    yearsLabel: "Plazo (años)",
    goalLabel: "Meta (opcional)",
    contributedDetail: "Aportaste",
    interestDetail: "Intereses",
    legendContributed: "Aportado",
    legendInterest: "Intereses",
    tableToggle: "Ver evolución año a año",
    columnYear: "Año",
    columnContributed: "Aportado",
    columnInterest: "Intereses",
    columnBalance: "Saldo",
    disclaimer: "Los cálculos son referenciales y no constituyen asesoría financiera; las rentabilidades pasadas no garantizan las futuras.",
    privacy: "Todo se calcula en tu navegador. No se guarda ni se envía ningún dato.",

    rateError: "La rentabilidad debe estar entre -50% y 50%.",
    yearsError: "El plazo debe ser un número entero de años, entre 1 y 80.",
    goalError: "La meta debe ser mayor que 0.",

    years: spanishYears,
    months: spanishMonths,
    and: " y ",
    heroLabel: (years) => "Saldo final en " + spanishYears(years),
    goalAlreadyReached: "Ya alcanzaste tu meta con el monto inicial.",
    goalNotReached: (goal) => "Con estos números no alcanzas la meta de " + goal + " en 100 años.",
    goalReached: (goal, time) => "Alcanzas tu meta de " + goal + " en " + time + ".",
    barSplit: (contributedPercent, interestPercent) =>
      contributedPercent + "% aportado, " + interestPercent + "% intereses",
    barNoInterest: "100% aportado, sin intereses a favor",
    announce: (balance, interest) => "Saldo final " + balance + ", de los cuales " + interest + " son intereses.",
  },

  pl: {
    pageTitle: "Kalkulator procentu składanego",
    languageLabel: "Język",
    title: "Kalkulator procentu składanego",
    lead: "Zobacz, jak rosną Twoje oszczędności dzięki comiesięcznym wpłatom i ile czasu zajmie Ci osiągnięcie celu. Kwoty w peso chilijskich (CLP).",
    initialLabel: "Kwota początkowa",
    monthlyLabel: "Wpłata miesięczna",
    rateLabel: "Roczna stopa zwrotu",
    rateHelp: "Użyj realnej stopy zwrotu (po uwzględnieniu inflacji), np. 3–5%.",
    yearsLabel: "Okres (w latach)",
    goalLabel: "Cel (opcjonalnie)",
    contributedDetail: "Suma wpłat",
    interestDetail: "Odsetki",
    legendContributed: "Wpłaty",
    legendInterest: "Odsetki",
    tableToggle: "Pokaż tabelę rok po roku",
    columnYear: "Rok",
    columnContributed: "Suma wpłat",
    columnInterest: "Odsetki",
    columnBalance: "Wartość",
    disclaimer: "Obliczenia mają charakter poglądowy i nie stanowią doradztwa finansowego; wyniki osiągnięte w przeszłości nie gwarantują podobnych wyników w przyszłości.",
    privacy: "Wszystko jest obliczane w Twojej przeglądarce. Żadne dane nie są zapisywane ani wysyłane.",

    rateError: "Stopa zwrotu musi wynosić od -50% do 50%.",
    yearsError: "Okres musi być liczbą całkowitą od 1 do 80 lat.",
    goalError: "Cel musi być większy od 0.",

    years: polishYears,
    months: polishMonths,
    and: " i ",
    heroLabel: (years) => "Wartość końcowa " + polishAfterYears(years),
    goalAlreadyReached: "Kwota początkowa już wystarcza, aby osiągnąć cel.",
    goalNotReached: (goal) => "Przy tych założeniach nie osiągniesz celu w wysokości " + goal + " w ciągu 100 lat.",
    goalReached: (goal, time) => "Osiągniesz cel w wysokości " + goal + " za " + time + ".",
    barSplit: (contributedPercent, interestPercent) =>
      contributedPercent + "% to wpłaty, " + interestPercent + "% to odsetki",
    barNoInterest: "100% to wpłaty, bez zysku z odsetek",
    announce: (balance, interest) => "Wartość końcowa: " + balance + ", z czego " + interest + " to odsetki.",
  },
};
