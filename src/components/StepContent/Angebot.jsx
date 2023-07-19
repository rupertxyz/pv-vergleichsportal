import React from 'react';
import Select from '../FormComponents/Select';
import Input from '../FormComponents/Input';
import DatePicker from '../FormComponents/DatePicker';
import Number from '../FormComponents/Number';
import Currency from '../FormComponents/Currency';
import Checkbox from '../FormComponents/Checkbox';
import Phone from '../FormComponents/Phone';
import Map from '../FormComponents/Address';
import Email from '../FormComponents/Email';

const Angebot = ({ formContent, setFormContent }) => {
  return (
    <>
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Leaddaten erfassen
      </h1>
      <div className="flex flex-wrap -m-2">
        <Input
          label="Lead-Quelle"
          placeholder="Bitte Lead-Quelle angeben"
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="leadSource"
        />
        <DatePicker
          label="Besuchstermin"
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="besuchstermin"
        />
      </div>
      <h1 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
        Kundendaten erfassen
      </h1>
      <div className="flex flex-wrap -m-2">
        <Select
          label="Titel"
          options={['Dr.', 'Prof.', 'Prof. Dr.', 'Prof Dr. Dr.']}
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="anrede"
        />
        <Select
          label="Anrede"
          options={['Frau', 'Herr', 'Familie', 'Eheleute']}
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="anrede"
        />
        <Input
          label="Vorname"
          placeholder="Bitte Vorname angeben"
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="vorname"
        />
        <Input
          label="Nachname"
          placeholder="Bitte Nachname angeben"
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="nachname"
        />
        <Map
          label="Adresse"
          placeholder="Bitte die Adresse angeben"
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="strasse"
        />

        <Phone
          label="Telefon"
          placeholder="Bitte Telefonnummer mit +49 angeben"
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="telefon"
        />
        <Email
          label="E-Mail"
          placeholder="Bitte E-Mail angeben"
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="email"
        />
        <Input
          label="Firmenbezeichnung"
          placeholder="Bitte Firmenbezeichnung angeben"
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="firmenbezeichnung"
        />
      </div>
      <h1 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
        Angaben Energieverbrauch
      </h1>
      <div className="flex flex-wrap -m-2">
        <Number
          label="Hausstromverbrauch in kWh"
          placeholder="5000"
          step="500"
        />
        <Number
          label="Nutzstromverbrauch in kWh (Wärmepumpe, Wallbox etc.)"
          placeholder="2500"
          step="250"
        />
        <Number
          label="Stromverbrauch E-Auto (in kWh pro Jahr)"
          placeholder="0"
          step="250"
        />
        <Currency
          label="Arbeitspreis ct/kWh"
          placeholder="Bitte Strompreis angeben"
        />
        <Currency label="Grundgebühr pro Jahr" placeholder="0" />
        <Checkbox label="Wärmepumpe in Planung" name="waermepumpe" />
      </div>
    </>
  );
};

export default Angebot;
