const PRICES = {
  MODULE: 122,
  UK: 130,
  OPTIMIZER: 50,
  WECHSELRICHTER: [
    { size: 3.825, price: 919, amount: 1 },
    { size: 5.1, price: 961, amount: 1 },
    { size: 5.95, price: 1012, amount: 1 },
    { size: 7.9, price: 1133, amount: 1 },
    { size: 10.3, price: 1340, amount: 1 },
    { size: 12, price: 1507, amount: 1 },
    { size: 16, price: 2266, amount: 2 },
    { size: 20.5, price: 2680, amount: 2 },
    { size: 26, price: 3014, amount: 2 },
    { size: 30, price: 4020, amount: 3 },
  ],
  BATTERY: [
    { size: 5000, price: 3163 },
    { size: 10000, price: 5463 },
    { size: 15000, price: 7769 },
    { size: 20000, price: 10069 },
  ],
  MONTAGE: [{ count: 16, price: 80 }, { price: 75 }],
  SPS: 128,
  FREIGHT_COST: 246,
  GERUEST: 750,
  ELECTRO_FLAT_RATE: 350,
  ENTFERNUNGSPAUSCHALE: 150,
  ELEKTROINSTALLATION: 3440,
  ZAEHLERSCHRANK: [
    {
      anzahlFelder: 1,
      price: 2400,
    },
    {
      anzahlFelder: 2,
      price: 2660,
    },
    {
      anzahlFelder: 3,
      price: 3050,
    },
    {
      anzahlFelder: 4,
      price: 3830,
    },
  ],
  VERKABELUNG: [
    { laenge: 5, price: 0 },
    { laenge: 10, price: 500 },
    { laenge: 15, price: 1000 },
    { laenge: 25, price: 1500 },
    { laenge: 30, price: 3000 },
    { price: 6000 },
  ],
  NOTSTROM: 1500,
  SALES_INNER: 1500,
  SALES_OUTER: 1500,
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
  let price = 0;
  for (let item of PRICES.WECHSELRICHTER) {
    if (kWp <= item.size) {
      price = item.price * item.amount;
      break;
    }
  }
  return price;
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
      price = item.price * amountOfModules;
      break;
    }
  }
  if (price < 1150) return 1150;
  return price;
}

function spsPreis() {
  return PRICES.SPS;
}

function frachtKosten() {
  return PRICES.FREIGHT_COST;
}

function zaehlerSchrank(zaehlerschrankTauschen, anzahlZaehlerFelder) {
  if (!zaehlerschrankTauschen || !anzahlZaehlerFelder) return 0;
  let price = 0;
  for (let item of PRICES.ZAEHLERSCHRANK) {
    if (anzahlZaehlerFelder === item.anzahlFelder) {
      price = item.price;
      break;
    }
  }
  return price;
}

function verkabelung(laenge) {
  let price = 0;
  for (let item of PRICES.VERKABELUNG) {
    if (!item.laenge || laenge <= item.laenge) {
      price = item.price;
      break;
    }
  }
  return price;
}

function gerüstBisMesswandler(ersatzStromLoesung) {
  return (
    PRICES.GERUEST +
    PRICES.ELECTRO_FLAT_RATE +
    PRICES.ENTFERNUNGSPAUSCHALE +
    PRICES.ELEKTROINSTALLATION +
    (ersatzStromLoesung ? PRICES.NOTSTROM : 0)
  );
}

function vertrieb(otpWert, benoetigteKwp) {
  return (
    PRICES.SALES_INNER +
    PRICES.SALES_OUTER +
    otpWert * 1000 +
    benoetigteKwp * 50
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
    gerüstBisMesswandler(formContent.nostromPlanen) +
    zaehlerSchrank(
      formContent.zaehlerschrankTauschen,
      formContent.anzahlZaehlerFelder
    ) +
    verkabelung(formContent.laengeKabelwegHakZs) +
    vertrieb(formContent.otpWert, formContent.benoetigteKwp) +
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
