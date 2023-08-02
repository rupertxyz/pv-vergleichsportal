import React from 'react';
import Select from '../FormComponents/Select';
import Input from '../FormComponents/Input';
import DatePicker from '../FormComponents/DatePicker';
import Number from '../FormComponents/Number';
import CurrencyNumber from '../FormComponents/CurrencyNumber';
import Phone from '../FormComponents/Phone';
import Address from '../FormComponents/Address';
import Email from '../FormComponents/Email';
import TextArea from '../FormComponents/TextArea';

export default function Kunde() {
  return (
    <>
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Leaddaten erfassen
      </h1>
      <div className="flex flex-wrap -m-2">
        <Input
          label="Lead-Quelle"
          placeholder="Bitte Lead-Quelle angeben"
          identifier="leadSource"
        />
        <DatePicker label="Besuchstermin" identifier="besuchstermin" />
      </div>
      <h1 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
        Kundendaten erfassen
      </h1>
      <div className="flex flex-wrap -m-2">
        <Select
          label="Anrede"
          options={['Frau', 'Herr', 'Familie', 'Eheleute']}
          identifier="anrede"
        />
        <Select
          label="Titel"
          options={['Dr.', 'Prof.', 'Prof. Dr.', 'Prof Dr. Dr.']}
          identifier="titel"
        />
        <Input
          label="Vorname"
          placeholder="Bitte Vorname angeben"
          identifier="vorname"
        />
        <Input
          label="Nachname"
          placeholder="Bitte Nachname angeben"
          identifier="nachname"
        />
        <Input
          label="Firma"
          placeholder="Bitte Firma angeben"
          identifier="firma"
        />
        <Address
          label="Adresse"
          placeholder="Bitte Adresse angeben"
          identifier="adresse"
        />

        <Phone
          label="Telefon"
          placeholder="Bitte Telefonnummer mit +49 angeben"
          identifier="telefon"
        />
        <Email
          label="E-Mail"
          placeholder="Bitte E-Mail angeben"
          identifier="email"
        />
      </div>
      <h1 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
        Angaben Energieverbrauch
      </h1>
      <div className="flex flex-wrap -m-2">
        <Number
          label="Hausstromverbrauch"
          defaultValue={5000}
          step={500}
          identifier="hausstromverbrauch"
          unitName="kWh"
        />
        <Number
          label="Nutzstromverbrauch"
          placeholder="2.500 kWh"
          step={250}
          identifier="nutzstromverbrauch"
          unitName="kWh"
        />
        <Number
          label="Stromverbrauch E-Auto"
          placeholder="2.500 kWh"
          step={250}
          identifier="eAutoVerbrauch"
          unitName="kWh"
        />
        <CurrencyNumber
          label="Arbeitspreis ct/kWh"
          defaultValue={0.4}
          step={0.05}
          identifier="arbeitspreis"
          smWidth="1/2"
        />
        <CurrencyNumber
          label="Grundgebühr pro Jahr"
          defaultValue={120}
          step={5}
          identifier="grundgebuehr"
          smWidth="1/2"
        />
        <TextArea
          label="Notizen"
          placeholder="Bitte Notizen angeben"
          identifier="bemerkungen"
          smWidth="w-full"
        ></TextArea>
      </div>
    </>
  );
}
