import React from 'react';
import Select from '../FormComponents/Select';
import Input from '../FormComponents/Input';
import DatePicker from '../FormComponents/DatePicker';
import Number from '../FormComponents/Number';
import Currency from '../FormComponents/Currency';
import CurrencyNumber from '../FormComponents/CurrencyNumber';
import Checkbox from '../FormComponents/Checkbox';
import Phone from '../FormComponents/Phone';
import Address from '../FormComponents/Address';
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
          label="Anrede"
          options={['Frau', 'Herr', 'Familie', 'Eheleute']}
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="anrede"
        />
        <Select
          label="Titel"
          options={['Dr.', 'Prof.', 'Prof. Dr.', 'Prof Dr. Dr.']}
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="titel"
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
        <Input
          label="Firma"
          placeholder="Bitte Firma angeben"
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="firma"
        />
        <Address
          label="Adresse"
          placeholder="Bitte Adresse angeben"
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="adresse"
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
      </div>
      <h1 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
        Angaben Energieverbrauch
      </h1>
      <div className="flex flex-wrap -m-2">
        <Number
          label="Hausstromverbrauch in kWh"
          defaultValue={5000}
          step={500}
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="hausstromverbrauch"
        />
        <Number
          label="Nutzstromverbrauch in kWh (Wärmepumpe, Wallbox etc.)"
          defaultValue={2500}
          step={250}
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="nutzstromverbrauch"
        />
        <Number
          label="Stromverbrauch E-Auto (in kWh pro Jahr)"
          defaultValue={2500}
          step={250}
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="eAutoVerbrauch"
        />
        <CurrencyNumber
          label="Arbeitspreis ct/kWh"
          defaultValue={0.4}
          step={0.05}
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="arbeitspreis"
        />
        <CurrencyNumber
          label="Grundgebühr pro Jahr"
          defaultValue={120}
          step={5}
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="grundgebuehr"
        />
        <Checkbox
          label="Wärmepumpe in Planung"
          name="waermepumpe"
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="waermepumpe"
        />
        <Checkbox
          label="E-Auto in Planung"
          name="eAutoPLanung"
          formContent={formContent}
          setFormContent={setFormContent}
          identifier="eAutoPlanung"
        />
      </div>
    </>
  );
};

export default Angebot;
