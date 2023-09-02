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
          step={0.01}
          identifier="ziegeldeckmassLaenge"
          unitName="Meter"
        />
        <DecimalNumber
          label="Ziegeldeckmaß Breite"
          step={0.1}
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
        <DecimalNumber
          label="Sparrenmaße Abstand"
          step={0.1}
          identifier="sparrenmassAbstand"
          unitName="cm"
        />
        <DecimalNumber
          label="Sparrenmaße Breite"
          step={0.01}
          identifier="sparrenmassBreite"
          unitName="cm"
        />
        <DecimalNumber
          label="Sparrenmaße Höhe"
          step={0.01}
          identifier="sparrenmassHoehe"
          unitName="cm"
        />
        <DecimalNumber
          label="Aufsparrendämmung Stärke"
          step={0.01}
          identifier="aufsparrendaemmungStaerke"
          unitName="mm"
          placeholder="0 mm"
        />
        <Number
          label="Trapezblech Stärke"
          placeholder="20 mm"
          step={1}
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
