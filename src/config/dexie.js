import { Dexie } from 'dexie';

const indexDb = new Dexie('clients');
indexDb.version(4).stores({
  data: 'id,adresse,anrede,arbeitspreis,bemerkungen,eAutoVerbrauch,email,firma,grundgebuehr,hausstromverbrauch,vorname,nachname,telefon,titel,projectId,pdf,nutzstromverbrauch,ninoxId, waermepumpe,eAutoPlanung,sonderbelegung,anzahlModule,anzahlOptimierer,benoetigteKwp,speicherGroesse,anzahlStockwerke,anzahlDachseiten,glasGlasModule,fullBlackModule,kabelweg,ziegeldeckmassLaenge,ziegeldeckmassBreite,dachneigung,sparrenmassAbstand,sparrenmassHoehe,sparrenmassBreite,aufsparrendaemmungStaerke,trapezblechStaerke,sandwichblech,ziegelgeklammert,ziegelgemoertelt,ziegelsanierung,potSchiene,staberder,kaskade,zaehlerzusammenlegung,privUnterzaehler,unterverteiler,zaehlerschrankTauschen,anzahlZaehlerFelder,standortZaehlerschrank,standortHak,laengeKabelwegHakZs,otpWert,notstromPlanen,internetanschlussVorhanden,abschlussTermin,chart,signature',
});

export default indexDb;
