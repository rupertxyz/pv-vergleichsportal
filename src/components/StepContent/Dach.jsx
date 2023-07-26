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
          placeholder="1 Meter"
          step={0.5}
          identifier="ziegeldeckmassLaenge"
          unitName="Meter"
        />
        <DecimalNumber
          label="Ziegeldeckmaß Breite"
          placeholder="1 Meter"
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
          placeholder="50 cm"
          step={5}
          identifier="sparrenmassAbstand"
          unitName="cm"
        />
        <Number
          label="Sparrenmaße Breite"
          placeholder="50 cm"
          step={5}
          identifier="sparrenmassBreite"
          unitName="cm"
        />
        <Number
          label="Sparrenmaße Höhe"
          placeholder="50 cm"
          step={5}
          identifier="sparrenmassHoehe"
          unitName="cm"
        />
        <Number
          label="Aufsparrendämmung Stärke"
          placeholder="20 mm"
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
        <Checkbox label="Sandwichblech" identifier="sandwichblech" />
        <Checkbox label="Ziegel geklammert" identifier="ziegelgeklammert" />
        <Checkbox label="Ziegel gemörtelt" identifier="ziegelgemoertelt" />
        <Checkbox label="Ziegelsanierung" identifier="ziegelsanierung" />
      </div>
    </>
  );
}
