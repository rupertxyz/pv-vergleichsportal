import React from 'react';
import Checkbox from '../FormComponents/Checkbox';
import Number from '../FormComponents/Number';

export default function Anlage() {
  return (
    <>
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Anlagenplanung
      </h1>
      <div className="flex flex-wrap -m-2">
        <Checkbox
          label="Wärmepumpe in Planung"
          identifier="waermepumpe"
          smWidth={2}
        />
        <Checkbox
          label="E-Auto in Planung"
          identifier="eAutoPlanung"
          smWidth={2}
        />
        <Number
          label="Anzahl Module"
          placeholder="1"
          step={1}
          identifier="anzahlModule"
          smWidth="1/2"
        />
        <Checkbox label="Sonderbelegung" identifier="sonderbelegung" />
        <Number
          label="Anzahl Optimierer"
          placeholder="1"
          step={1}
          identifier="anzahlOptimierer"
          smWidth="1/2"
        />
        <Number
          label="Benötigte kWp (ergibt sich aus Anzahl Module)"
          placeholder="2.500"
          step={250}
          identifier="benoetigteKwp"
        />
        <Number
          label="Speichergröße"
          placeholder="2.500 kWh"
          step={250}
          identifier="speicherGroesse"
          unitName="kWh"
        />
        <Number
          label="Anzahl Stockwerke"
          placeholder="1 Stock"
          step={1}
          identifier="anzahlStockwerke"
          unitName="Stock"
        />
        <Number
          label="Anzahl Dachseiten"
          placeholder="1 Seite(n)"
          step={1}
          identifier="anzahlDachseiten"
          unitName="Seite(n)"
        />
        <Number
          label="Glas-Glas-Module"
          placeholder="1 Modul"
          step={1}
          identifier="glasGlasModule"
          unitName="Module"
        />
        <Number
          label="Full-Black-Module"
          placeholder="1 Modul"
          step={1}
          identifier="fullBlackModule"
          unitName="Module"
        />
        <Number
          label="Kabelweg"
          placeholder="1 Meter"
          step={1}
          identifier="kabelweg"
          unitName="Meter"
        />
      </div>
    </>
  );
}
