import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { FormContext } from '../../NewClient';
import { useOutletContext } from 'react-router-dom';

const tabelleEigenverbrauch = require('../../data/tabelleEigenverbrauch.json');
const tabelleAutarkie = require('../../data/tabelleAutarkie.json');

// Constants
const COST_PER_KWH = 0.3;
const LOSS_PERCENT = 0.011;
const INFLATION_PERCENT = 0.064;
const KWH_PER_KWP = 1030;
const EEG = 0.08;
const EEG_YEARS = 20;
const CALCULATION_YEARS = 25;

//Funktion zum Interpolieren aus Matrix
function SucheWertAusMatrix(table, x, y) {
  //x-Index suchen
  var xi = Math.ceil(x / 0.0625) + 1;
  //y-Index suchen
  var yi = Math.ceil(y / 0.0625) + 1;

  var obenLinks = table[yi - 1][xi - 1];
  var obenRechts = table[yi - 1][xi];
  var untenLinks = table[yi][xi - 1];
  var untenRechts = table[yi][xi];

  var xInterpoliertOben =
    obenLinks +
    ((x - table[0][xi - 1]) * (obenRechts - obenLinks)) /
      (table[0][xi] - table[0][xi - 1]);
  var xInterpoliertUnten =
    untenLinks +
    ((x - table[0][xi - 1]) * (untenRechts - untenLinks)) /
      (table[0][xi] - table[0][xi - 1]);
  if (yi > 1) {
    var interpoliert =
      xInterpoliertOben +
      ((y - table[yi - 1][0]) * (xInterpoliertUnten - xInterpoliertOben)) /
        (table[yi][0] - table[yi - 1][0]);
    return interpoliert;
  }
  return xInterpoliertUnten;
}

function calculateSavings(
  electricityGeneratedPerYear,
  costPerKwh,
  lossPercent,
  inflationPercent
) {
  let totalSavings = 0;
  for (let i = 0; i < CALCULATION_YEARS; i++) {
    totalSavings +=
      electricityGeneratedPerYear *
      Math.pow(1 - lossPercent, i) *
      costPerKwh *
      Math.pow(1 + inflationPercent, i);
  }
  return totalSavings;
}

// calculation EEG-S: (kWp * kWh / kWp (1030)) - PV Solar (Verbrauch * Autarkie)
// calculation EEG €: EEG-S * EEG-Umlage? * Jahre EEG (20)

const Wirtschaftlichkeit = () => {
  const { formContent } = useContext(FormContext);
  const { userColor } = useOutletContext();

  const [pvLeistung, setPvLeistung] = useState(0);
  const [verbrauch, setVerbrauch] = useState(0);
  console.log('verbrauch', verbrauch);
  const [speicher, setSpeicher] = useState(0);
  const [kWp, setkWp] = useState(0);

  // Autarkie
  const [autarkie, setAutarkie] = useState(0);
  console.log(autarkie);

  // Eigenverbrauch
  const [eigenverbrauch, setEigenverbrauch] = useState(0);

  // Cashflow
  const [pvSolar, setPvSolar] = useState(0);
  const [eegS, setEegS] = useState(0);
  const [eegCash, setEegCash] = useState(0);
  const [einsparung, setEinsparung] = useState(0);
  const [cashflow, setCashflow] = useState(0);

  // Kapitalrendite
  const [kapitalrendite, setKapitalrendite] = useState(0);

  useEffect(() => {
    if (formContent.anzahlModule) {
      setPvLeistung(formContent.anzahlModule * 430);
    } else {
      setPvLeistung(0);
    }
    if (formContent.hausstromverbrauch) {
      setVerbrauch(() => {
        return (
          formContent.hausstromverbrauch ||
          0 +
            (formContent.nutzstromverbrauch || 0) +
            (formContent.eAutoVerbrauch || 0)
        );
      });
    } else {
      setVerbrauch(0);
    }
    if (formContent.speicherGroesse) {
      setSpeicher(formContent.speicherGroesse);
    } else {
      setSpeicher(0);
    }
    if (formContent.benoetigteKwp) {
      setkWp(formContent.benoetigteKwp);
    }
  }, [formContent]);

  useEffect(() => {
    if (pvLeistung && verbrauch) {
      const rawAutarkieValue = SucheWertAusMatrix(
        tabelleAutarkie,
        pvLeistung / verbrauch,
        speicher / verbrauch
      );
      const rawEigenverbrauchValue = SucheWertAusMatrix(
        tabelleEigenverbrauch,
        pvLeistung / verbrauch,
        speicher / verbrauch
      );

      if (rawAutarkieValue && rawEigenverbrauchValue) {
        setAutarkie(parseFloat(rawAutarkieValue * 100).toFixed(0));
        setEigenverbrauch(parseFloat(rawEigenverbrauchValue * 100).toFixed(0));
      } else {
        setAutarkie(0);
        setEigenverbrauch(0);
      }
    }
  }, [pvLeistung, verbrauch, speicher]);

  useEffect(() => {
    if (verbrauch && autarkie) {
      setPvSolar((verbrauch * autarkie) / 100);
    }
  }, [verbrauch, autarkie]);

  useEffect(() => {
    if (kWp && pvSolar) {
      const eegS = (kWp / 1000) * KWH_PER_KWP - pvSolar;
      setEegCash(eegS * EEG * EEG_YEARS);
      setEinsparung(
        calculateSavings(pvSolar, COST_PER_KWH, LOSS_PERCENT, INFLATION_PERCENT)
      );
    }
  }, [pvSolar]);

  useEffect(() => {
    if (eegCash && einsparung) {
      // calculate costs of modules
      setCashflow(eegCash + einsparung);
    }
  }, [eegCash, einsparung]);

  return (
    <>
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Wirtschaftlichkeit
      </h1>
      <div class="flex flex-wrap -m-2">
        <div class="w-1/2 md:w-1/4 p-2">
          <div
            class="flex flex-col justify-between p-4 border-2 rounded h-full"
            style={{ borderColor: userColor }}
          >
            <h2 class="font-bold mb-2">Autarkie</h2>
            <p className="text-5xl">{autarkie ? autarkie + '%' : '/'}</p>
          </div>
        </div>

        <div class="w-1/2 md:w-1/4 p-2">
          <div
            class="flex flex-col justify-between p-4 border-2 rounded h-full"
            style={{ borderColor: userColor }}
          >
            <h2 class="font-bold mb-2">Anlagennutzung</h2>
            <p className="text-5xl">
              {eigenverbrauch ? eigenverbrauch + '%' : '/'}
            </p>
          </div>
        </div>

        <div class="w-1/2 md:w-1/4 p-2">
          <div
            class="flex flex-col justify-between p-4 border-2 rounded h-full"
            style={{ borderColor: userColor }}
          >
            <h2 class="font-bold mb-2">Gesamt-Cashflow</h2>
            <p className="text-5xl">3</p>
          </div>
        </div>

        <div class="w-1/2 md:w-1/4 p-2">
          <div
            class="flex flex-col justify-between p-4 border-2 rounded h-full"
            style={{ borderColor: userColor }}
          >
            <h2 class="font-bold mb-2">Kapitalrendite p.a.</h2>
            <p className="text-5xl">4</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wirtschaftlichkeit;
