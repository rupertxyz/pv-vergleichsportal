const PRICES = {
  MODULE: 122, // replace with the real price
  UK: 130, // replace with the real price
  OPTIMIZER: 20, // replace with the real price
  INVERTER: 1499,
  BATTERY: [
    { size: 5000, price: 4799 },
    { size: 10000, price: 7099 },
    { size: 15000, price: 9399 },
    { size: 20000, price: 11699 },
  ],
  MONTAGE: [
    { count: 16, price: 80 },
    { count: 24, price: 75 },
    { price: 70 }, // default price
  ],
  SPS: 128,
  FREIGHT_COST: 246,
  SCAFFOLDING_COST: 750,
  ELECTRO_FLAT_RATE: 350,
  DISTANCE_FLAT_RATE: 150,
  ELEKTROPAUSCHALE: 3440,
  ZAEHLERSCHRANK: 2400, // replace with the real price
  ADDITIONAL_AC_WIRING_COST: 1500, // replace with the real price
  REPLACEMENT_POWER_SOLUTION: 1500,
  SALES_INNER: 1500,
  SALES_OUTER: 1500,
  ON_TOP_PROVISION: 100, // replace with the real price
  VARIABLE_SALES: 100, // replace with the real price
  ELECTRO_ADDITIONAL_COMPONENTS: {
    POT_SCHIENE: 100,
    STABERDER: 400,
    KASKADIERUNG: 280,
    ZAEHLERZUSAMMENLEGUNG: 250,
    PRIV_UNTERZAEHLER: 210,
    UNTERVERTEILER: 230,
  },
};

function modulPreis(amount) {
  return amount * PRICES.MODULE;
}

function ukPreis(kWp) {
  return kWp * PRICES.UK;
}

function optimiererPreis(amount) {
  return amount * PRICES.OPTIMIZER;
}

function wechselRichterPreis(kWp) {
  return kWp <= 3825 ? PRICES.INVERTER : 0; // assuming 0 if not less or equal to 3825
}

function batterieSpeicherPreis(kWh) {
  let price = 0;
  if (kWh === 0) return price;
  for (let item of PRICES.BATTERY) {
    if (kWh <= item.size) {
      price = item.price;
      break;
    }
  }
  return price;
}

function montagePreis(amountOfModules) {
  let price = 0;
  for (let item of PRICES.MONTAGE) {
    if (!item.count || amountOfModules <= item.count) {
      price = item.price;
      break;
    }
  }
  return amountOfModules * price;
}

function spsPreis() {
  return PRICES.SPS;
}

function frachtKosten() {
  return PRICES.FREIGHT_COST;
}

function gerüstBisMesswandler(zaehlerschrankTauschen, ersatzStromLoesung) {
  return (
    PRICES.SCAFFOLDING_COST +
    PRICES.ELECTRO_FLAT_RATE +
    PRICES.DISTANCE_FLAT_RATE +
    PRICES.ELEKTROPAUSCHALE +
    (zaehlerschrankTauschen
      ? PRICES.ZAEHLERSCHRANK + PRICES.ADDITIONAL_AC_WIRING_COST
      : 0) +
    (ersatzStromLoesung ? PRICES.REPLACEMENT_POWER_SOLUTION : 0)
  );
}

function vertrieb() {
  return (
    PRICES.SALES_INNER +
    PRICES.SALES_OUTER +
    PRICES.ON_TOP_PROVISION +
    PRICES.VARIABLE_SALES
  );
}

function elektroZusatzKomponenten(
  potSchiene,
  staberder,
  kaskadierung,
  zaehlerZusammenlegung,
  privUnterzähler,
  unterverteiler
) {
  return (
    (potSchiene ? PRICES.ELECTRO_ADDITIONAL_COMPONENTS.POT_SCHIENE : 0) +
    (staberder ? PRICES.ELECTRO_ADDITIONAL_COMPONENTS.STABERDER : 0) +
    (kaskadierung ? PRICES.ELECTRO_ADDITIONAL_COMPONENTS.KASKADIERUNG : 0) +
    (zaehlerZusammenlegung
      ? PRICES.ELECTRO_ADDITIONAL_COMPONENTS.ZAEHLERZUSAMMENLEGUNG
      : 0) +
    (privUnterzähler
      ? PRICES.ELECTRO_ADDITIONAL_COMPONENTS.PRIV_UNTERZAEHLER
      : 0) +
    (unterverteiler ? PRICES.ELECTRO_ADDITIONAL_COMPONENTS.UNTERVERTEILER : 0)
  );
}

export default function calculateKaufpreis(formContent) {
  return (
    modulPreis(formContent.anzahlModule) +
    ukPreis(formContent.benoetigteKwp) +
    optimiererPreis(formContent.anzahlOptimierer) +
    wechselRichterPreis(formContent.benoetigteKwp) +
    batterieSpeicherPreis(formContent.speicherGroesse) +
    montagePreis(formContent.anzahlModule) +
    spsPreis() +
    frachtKosten() +
    gerüstBisMesswandler(
      formContent.zaehlerschrankTauschen,
      formContent.nostromPlanen
    ) +
    vertrieb() +
    elektroZusatzKomponenten(
      formContent.potSchiene,
      formContent.stabErder,
      formContent.kaskade,
      formContent.zaehlerzusammenlegung,
      formContent.privUnterzaehler,
      formContent.unterverteiler
    )
  );
}
