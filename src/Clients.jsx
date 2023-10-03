import React, { useState } from 'react';
import { useOutletContext, Form } from 'react-router-dom';
import ClientListItem from './components/Welcome/ClientListItem';
import { redirect } from 'react-router-dom';
import indexDb from './config/dexie';

async function clientsActions() {
  const id = await indexDb.data.add({
    id: Math.round(Math.random() * 10000),
    vorname: '',
    nachname: '',
    anrede: '',
    titel: '',
    firma: '',
    adresse: '',
    telefon: '',
    email: '',
    hausstromverbrauch: 5000,
    nutzstromverbrauch: '',
    eAutoVerbrauch: '',
    arbeitspreis: 0.4,
    grundgebuehr: 120,
    bemerkungen: '',
    leadSource: '',
    besuchstermin: new Date().toISOString().substring(0, 10),
    waermepumpe: false,
    eAutoPlanung: false,
    sonderbelegung: false,
    anzahlModule: 24,
    anzahlOptimierer: '',
    benoetigteKwp: '',
    speicherGroesse: 10,
    anzahlStockwerke: 2,
    anzahlDachseiten: 2,
    glasGlasModule: false,
    fullBlackModule: false,
    kabelweg: '',
    ziegeldeckmassLaenge: '',
    ziegeldeckmassBreite: '',
    dachneigung: '',
    sparrenmassAbstand: '',
    sparrenmassHoehe: '',
    sparrenmassBreite: '',
    aufsparrendaemmungStaerke: '',
    trapezblechStaerke: '',
    sandwichblech: false,
    ziegelgeklammert: false,
    ziegelgemoertelt: false,
    ziegelsanierung: false,
    potSchiene: false,
    staberder: false,
    kaskade: false,
    zaehlerzusammenlegung: false,
    privUnterzaehler: false,
    unterverteiler: false,
    zaehlerschrankTauschen: false,
    anzahlZaehlerFelder: '',
    standortZaehlerschrank: '',
    standortHak: '',
    laengeKabelwegHakZs: '',
    otpWert: 0,
    notstromPlanen: false,
    internetanschlussVorhanden: false,
    abschlussTermin: '',
    chart: '',
    signature: '',
  });
  return redirect(`/clients/${id}`);
}

const Clients = () => {
  const {
    userObject,
    customers = [],
    offline,
    isIndexedDbDiff,
    updateNinox,
    updatingNinox,
    clientDataFromNinox,
    areArraysDifferent,
    updateFromNinox,
  } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter customers based on the search term
  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.vorname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.nachname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen w-full flex flex-col gap-4 py-8 px-4 lg:p-8">
      <div className="flex items-center gap-2">
        <div className="flex flex-1">
          <h2 className="text-lg md:text-2xl font-bold">Alle Kunden</h2>
        </div>
        <Form method="post" className="flex justify-end gap-2">
          <button
            className="text-white font-bold px-2 lg:px-4 rounded opacity-100 hover:opacity-80 bg-slate-700"
            onClick={(e) => {
              e.preventDefault();
              let confirm = false;
              if (areArraysDifferent(customers, clientDataFromNinox)) {
                confirm = window.confirm(
                  'Daten sind noch nicht gesynced. Trotzdem durch Ninox überschreiben?'
                );
              } else {
                window.alert('Daten sind in Sync.');
              }
              if (confirm) {
                updateFromNinox();
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isIndexedDbDiff) {
                updateNinox();
              } else {
                window.alert('Keine Änderungen zum Syncen vorhanden.');
              }
            }}
            className={`text-white font-bold px-2 lg:px-4 rounded opacity-100 hover:opacity-80 ${
              isIndexedDbDiff ? 'bg-red-600' : 'bg-green-600'
            }`}
            style={!isIndexedDbDiff ? { cursor: 'default' } : {}}
          >
            {isIndexedDbDiff ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-6 h-6 ${updatingNinox && 'animate-spin'}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            )}
          </button>
          <button
            type="submit"
            className="text-white font-bold py-2 px-4 rounded opacity-100 hover:opacity-80 bg-slate-700"
            style={{ backgroundColor: userObject?.color }}
          >
            <i className="fa-light fa-plus"></i>
            <span>Neues Projekt</span>
          </button>
        </Form>
      </div>
      <input
        type="text"
        placeholder="Suche nach Vorname oder Nachname"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // 2. Update the search term when the input value changes
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
      />
      {filteredCustomers.map((customer, i) => (
        <ClientListItem
          key={i}
          customer={customer}
          userColor={userObject?.color}
        />
      ))}
    </div>
  );
};

export default Clients;
export { clientsActions };
