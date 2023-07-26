import React from 'react';
import Checkbox from '../FormComponents/Checkbox';
import Number from '../FormComponents/Number';
import Select from '../FormComponents/Select';

export default function Elektro() {
  return (
    <>
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Anlagenplanung
      </h1>
      <div className="flex flex-wrap -m-2">
        {' '}
        <Checkbox label="POT Schiene" identifier="potSchiene" smWidth={2} />
        <Checkbox label="Staberder" identifier="stabErder" smWidth={2} />
        <Checkbox label="Kaskade" identifier="kaskade" smWidth={2} />
        <Checkbox
          label="Zählerzusammenlegung"
          identifier="zaehlerzusammenlegung"
          smWidth={2}
        />
        <Checkbox
          label="Priv. Unterzähler"
          identifier="privUnterzaehler"
          smWidth={2}
        />
        <Checkbox
          label="Unterverteiler"
          identifier="unterverteiler"
          smWidth={2}
        />
        <Checkbox
          label="Zählerschrank tauschen"
          identifier="zaehlerschrankTauschen"
          smWidth={2}
        />
        <Checkbox
          label="Anzahl Zählerfelder"
          identifier="anzahlZaehlerFelder"
          smWidth={2}
        />
        <Select
          label="Standort Zählerschrank"
          options={['Dach', 'EG', 'Keller']}
          identifier="standortZaehlerschrank"
        />
        <Select
          label="Standort HAK"
          options={['Dach', 'EG', 'Keller']}
          identifier="standortHak"
        />
        <Number
          label="Länge Kabelweg von HAK zu ZS"
          placeholder="10 Meter"
          step={1}
          identifier="laengeKabelwegHakZs"
          unitName="Meter"
        />
        <Checkbox label="Nostrom planen" identifier="nostromPlanen" />
      </div>
    </>
  );
}
