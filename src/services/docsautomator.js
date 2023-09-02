export async function writePdf(data) {
  const calculationData = JSON.parse(data.calculationData);

  const today = new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());

  // build line items array
  const lineItems = [
    {
      line_items_id: '1',
      line_items_beschreibung:
        'Hochleistungs-Photovoltaikmodule von Tear 1 Herstellern\n- Mindestens 25 Jahre Leistungs- und 30 Jahre Produktgarantie\n- Hoche Witterungsbeständigkeit gegen Wind- und Schneelasten',
      line_items_menge: '23',
      line_items_einzelpreis: '',
      line_items_gesamtpreis: '',
    },
    {
      line_items_id: '2',
      line_items_beschreibung:
        'Langlebiges rostfreies Montagesystem\n- Nichtrostende Unterkonstruktion mit Herstellergarantie',
      line_items_menge: 'pauschal',
      line_items_einzelpreis: '',
      line_items_gesamtpreis: '',
    },
    {
      line_items_id: '3',
      line_items_beschreibung: 'Photovoltaikanlage inkl. Montage',
      line_items_menge: '9,89',
      line_items_einzelpreis: '',
      line_items_gesamtpreis: '',
    },
  ];

  let i = 4;

  if (data.anzahlOptimierer) {
    lineItems.push({
      line_items_id: i,
      line_items_beschreibung: 'Moduloptimierer für Schattentolleranz',
      line_items_menge: data.anzahlOptimierer,
      line_items_einzelpreis: '',
      line_items_gesamtpreis: '',
    });
    i++;
  }

  lineItems.push({
    line_items_id: i,
    line_items_beschreibung: `${calculationData.wechselrichter.name} Spitzenlast-Wechselrichter der High Current Version`,
    line_items_menge: calculationData.wechselrichter.amount,

    line_items_einzelpreis: '',
    line_items_gesamtpreis: '',
  });
  i++;

  if (data.speicherGroesse) {
    lineItems.push({
      line_items_id: i,
      line_items_beschreibung:
        'Langlebiger Batteriespeicher aus Eisenphosphat\n- Mindestens 10 Jahre Garantie\n- Flexibel erweiterbare Bauteile\n- Aktive Sicherheitsfunktionen zum Schutz des Eigenheims',
      line_items_menge: '1',
      line_items_einzelpreis: '',
      line_items_gesamtpreis: '',
    });
    i++;
  }

  lineItems.push({
    line_items_id: i,
    line_items_beschreibung:
      'Smart Power Sensor zur intelligenten Steuerung der Stromflüsse',
    line_items_menge: '1',
    line_items_einzelpreis: '',
    line_items_gesamtpreis: '',
  });
  i++;

  lineItems.push({
    line_items_id: i,
    line_items_beschreibung: 'Professionelle Elektroinstallation der PV-Anlage',
    line_items_menge: '1',
    line_items_einzelpreis: '',
    line_items_gesamtpreis: '',
  });
  i++;

  lineItems.push({
    line_items_id: i,
    line_items_beschreibung: 'Rüstkosten inkl. Baustelleneinrichtung',
    line_items_menge: 'pauschal',
    line_items_einzelpreis: '',
    line_items_gesamtpreis: '',
  });
  i++;

  if (
    data.zaehlerschrankTauschen &&
    data.standortZaehlerschrank &&
    data.anzahlZaehlerFelder
  ) {
    lineItems.push({
      line_items_id: i,
      line_items_beschreibung: calculationData.zaehlerschrank.name,
      line_items_menge: 'pauschal',
      line_items_einzelpreis: '',
      line_items_gesamtpreis: '',
    });
  }

  try {
    const res = await fetch('https://api.docsautomator.co/api/createDocument', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.REACT_APP_DOCSAUTOMATOR_KEY,
      },
      body: JSON.stringify({
        docId: '64dcc7e4ff21743880c86f0e',
        leadquelle: data.leadSource || '',
        anrede: data.anrede || '',
        titel: data.titel || '',
        besuchstermin: data.besuchstermin || '',
        vorname: data.vorname || '',
        nachname: data.nachname || '',
        abschlusstermin: data.abschlussTermin || '',
        firmenbezeichnung: data.firma || '',
        image_logo_200: data.logo || '',
        image_logo2_200: data.logo || '',
        image_logo3_200: data.logo || '',
        adresse: data.adresse || '',
        telefon: data.telefon || '',
        email: data.email || '',
        hausstromv: data.hausstromverbrauch || '',
        nutzstromv: data.nutzstromverbrauch || '',
        e: data.eAutoPlanung ? 'X' : '',
        w: data.waermepumpe ? 'X' : '',
        anlagengroesse: data.benoetigteKwp || '',
        g_g_m: data.glasGlasModule ? 'X' : '',
        arbeitspreis: data.arbeitspreis || '',
        speichergroesse: data.speicherGroesse || '',
        f_b_m: data.fullBlackModule ? 'X' : '',
        grundgebuehr: data.grundgebuehr || '',
        k: data.kabelweg ? 'X' : '',
        leerrohr: data.kabelweg ? 'X' : '',
        l_r_a: data.kabelweg ? 'X' : '',
        laenge: data.ziegeldeckmassLaenge || '',
        breite: data.ziegeldeckmassBreite || '',
        dachneigung: data.dachneigung || '',
        s_abstand: data.sparrenmassAbstand || '',
        s_breite: data.sparrenmassBreite || '',
        s_hoehe: data.sparrenmassHoehe || '',
        aufsparrendaemmung: data.aufsparrendaemmungStaerke || '',
        trapez_staerke: data.trapezblechStaerke,
        s_platten: data.sandwichblech ? 'X' : '',
        ziegel_gekl: data.ziegelgeklammert ? 'X' : '',
        ziegel_gem: data.ziegelgemoertelt ? 'X' : '',
        ziegel_sanierung: data.ziegelsanierung ? 'X' : '',
        zt: data.zaehlerschrankTauschen ? 'X' : '',
        azf: data.anzahlZaehlerFelder || '',
        zzl: data.zaehlerzusammenlegung ? 'X' : '',
        kk: data.kaskade ? 'X' : '',
        uz: data.unterverteiler ? 'X' : '',
        zd: data.standortZaehlerschrank === 'Dach' ? 'X' : '',
        eg: data.standortZaehlerschrank === 'EG' ? 'X' : '',
        kel: data.standortZaehlerschrank === 'Keller' ? 'X' : '',
        hd: data.standortHak === 'Dach' ? 'X' : '',
        heg: data.standortHak === 'EG' ? 'X' : '',
        hkel: data.standortHak === 'Keller' ? 'X' : '',
        zmet: data.laengeKabelwegHakZs || '',
        nvor: data.internetanschlussVorhanden ? 'X' : '',
        otp: data.otpWert || '',
        notes: data.bemerkungen || '',
        image_unterschrift_50: data.signature || '',
        image_chart_600: data.chart || '',
        line_items: lineItems,
        angebotsdatum: today,
        betrag_netto: calculationData.kaufPreis || '',
        betrag_brutto: calculationData.kaufPreis || '',
        angenommener_stromverbrauch: calculationData.verbrauch || '',
        angenommener_strompreis: calculationData.strompreis || '',
        angenommener_grundpreis: calculationData.grundpreis || '',
        autarkie: calculationData.autarkie || '',
        anlagennutzung: calculationData.eigenverbrauch || '',
        gesamt_cashflow: calculationData.cashflow || '',
        kapitalrendite_pa: calculationData.kapitalrendite || '',
      }),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}
