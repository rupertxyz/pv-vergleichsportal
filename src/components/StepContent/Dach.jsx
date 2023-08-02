import React from 'react';
import Number from '../FormComponents/Number';
import DecimalNumber from '../FormComponents/DecimalNumber';
import Checkbox from '../FormComponents/Checkbox';

export default function Dach() {
  return (
    <>
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Dach- und Gebäudeinformationen
      </h1>
      <div className="flex flex-wrap -m-2">
        <DecimalNumber
          label="Ziegeldeckmaß Länge"
          defaultValue={0.42}
          step={0.5}
          identifier="ziegeldeckmassLaenge"
          unitName="Meter"
        />
        <DecimalNumber
          label="Ziegeldeckmaß Breite"
          defaultValue={0.3}
          step={0.5}
          identifier="ziegeldeckmassBreite"
          unitName="Meter"
        />
        <Number
          label="Dachneigung in Grad"
          placeholder="20 Grad"
          step={1}
          identifier="dachneigung"
          unitName="Grad"
        />
        <Number
          label="Sparrenmaße Abstand"
          defaultValue={0.6}
          step={5}
          identifier="sparrenmassAbstand"
          unitName="cm"
        />
        <Number
          label="Sparrenmaße Breite"
          defaultValue={0.1}
          step={5}
          identifier="sparrenmassBreite"
          unitName="cm"
        />
        <Number
          label="Sparrenmaße Höhe"
          defaultValue={0.12}
          step={5}
          identifier="sparrenmassHoehe"
          unitName="cm"
        />
        <Number
          label="Aufsparrendämmung Stärke"
          defaultValue={0}
          step={5}
          identifier="aufsparrendaemmungStaerke"
          unitName="mm"
        />
        <Number
          label="Trapezblech Stärke"
          placeholder="20 mm"
          step={5}
          identifier="trapezblechStaerke"
          unitName="mm"
        />
        <Checkbox
          label="Sandwichblech"
          identifier="sandwichblech"
          smWidth="w-1/2"
        />
        <Checkbox
          label="Ziegel geklammert"
          identifier="ziegelgeklammert"
          smWidth="w-1/2"
        />
        <Checkbox
          label="Ziegel gemörtelt"
          identifier="ziegelgemoertelt"
          smWidth="w-1/2"
        />
        <Checkbox
          label="Ziegelsanierung anbieten"
          identifier="ziegelsanierung"
          smWidth="w-1/2"
        />
      </div>
    </>
  );
}
