import React from 'react';
import Checkbox from '../FormComponents/Checkbox';
import Number from '../FormComponents/Number';
import DecimalNumber from '../FormComponents/DecimalNumber';
import Select from '../FormComponents/Select';

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
          smWidth="w-1/3"
        />
        <Checkbox
          label="E-Auto in Planung"
          identifier="eAutoPlanung"
          smWidth="w-1/3"
        />
        <Checkbox
          label="Sonderbelegung"
          identifier="sonderbelegung"
          smWidth="w-1/3"
        />
        <Number
          label="Anzahl Module"
          step={1}
          identifier="anzahlModule"
          smWidth="1/2"
        />
        <Number
          label="Anzahl Optimierer"
          placeholder="1"
          step={1}
          identifier="anzahlOptimierer"
          smWidth="1/2"
        />
        <DecimalNumber
          label="Benötigte kWp (ergibt sich aus Anzahl Module)"
          placeholder="2.500"
          step={250}
          identifier="benoetigteKwp"
          readOnly={true}
          unitName="kWp"
        />
        <Number
          label="Speichergröße"
          placeholder="10 kWh"
          step={5000}
          identifier="speicherGroesse"
          unitName="kWh"
        />
        <Number
          label="Anzahl Stockwerke"
          step={1}
          identifier="anzahlStockwerke"
          unitName="Stockwerk(e)"
        />
        <Number
          label="Anzahl Dachseiten"
          step={1}
          identifier="anzahlDachseiten"
          unitName="Seite(n)"
        />
        <Checkbox
          label="Glas-Glas-Module"
          identifier="glasGlasModule"
          smWidth="w-1/2"
        />
        <Checkbox
          label="Full-Black-Module"
          identifier="fullBlackModule"
          smWidth="w-1/2"
        />
        <Select
          label="Kabelweg"
          options={['Stillgelegter Kamin', 'Leerrohr', 'Leerrohr außen']}
          identifier="kabelweg"
        />
      </div>
    </>
  );
}
