import React from 'react';
import Checkbox from '../FormComponents/Checkbox';
import Number from '../FormComponents/Number';
import Select from '../FormComponents/Select';
import DecimalNumber from '../FormComponents/DecimalNumber';

export default function Elektro() {
  return (
    <>
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Anlagenplanung
      </h1>
      <div className="flex flex-wrap -m-2">
        <Checkbox label="POT Schiene" identifier="potSchiene" smWidth="w-1/2" />
        <Checkbox label="Staberder" identifier="stabErder" smWidth="w-1/2" />
        <Checkbox label="Kaskade" identifier="kaskade" smWidth="w-1/2" />
        <Checkbox
          label="Zählerzusammenlegung"
          identifier="zaehlerzusammenlegung"
          smWidth="w-1/2"
        />
        <Checkbox
          label="Priv. Unterzähler"
          identifier="privUnterzaehler"
          smWidth="w-1/2"
        />
        <Checkbox
          label="Unterverteiler"
          identifier="unterverteiler"
          smWidth="w-1/2"
        />
        <Checkbox
          label="Zählerschrank tauschen"
          identifier="zaehlerschrankTauschen"
          smWidth="w-1/2"
        />
        <Number
          label="Anzahl Zählerfelder"
          placeholder="1"
          step={1}
          identifier="anzahlZaehlerFelder"
          smWidth="1/2"
          max={4}
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
          defaultValue={5}
          step={1}
          identifier="laengeKabelwegHakZs"
          unitName="Meter"
        />
        <DecimalNumber
          label="OTP-Wert"
          defaultValue={0.25}
          step={0.25}
          identifier="otpWert"
          max={1.5}
          min={0.25}
        />
        <Checkbox
          label="Nostrom planen"
          identifier="nostromPlanen"
          smWidth="w-1/2"
        />
        <Checkbox
          label="Internetanschluss (LAN) am Wechselrichterplatz vorhanden"
          identifier="internetanschlussVorhanden"
          smWidth="w-1/2"
        />
      </div>
    </>
  );
}
