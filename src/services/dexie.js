export async function updateIndexedDb(data, id) {
  try {
    await db.clients.update(id, {
      vorname: data.vorname,
      nachname: data.nachname,
      anrede: data.anrede,
      titel: data.titel,
      firma: data.firma,
      adresse: data.adresse,
      telefon: data.telefon,
      email: data.email,
      hausstromverbrauch: data.hausstromverbrauch,
      nutzstromverbrauch: data.nutzstromverbrauch,
      eAutoVerbrauch: data.eAutoVerbrauch,
      arbeitspreis: data.arbeitspreis,
      grundgebuehr: data.grundgebuehr,
      bemerkungen: data.bemerkungen,
      leadSource: data.leadSource,
      besuchstermin: data.besuchstermin
        ? data.besuchstermin.split('.').reverse().join('-')
        : '',
    });
  } catch (error) {
    console.log(error);
  }
}
