import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { FormContext } from '../../Client';
import { useOutletContext } from 'react-router-dom';
import calculateKaufpreis from '../../util/kaufpreis';
import CashflowGraph from '../Chart/Chart';

const tabelleEigenverbrauch = require('../../data/tabelleEigenverbrauch.json');
const tabelleAutarkie = require('../../data/tabelleAutarkie.json');

// Constants
const COST_PER_KWH = 0.35;
const LOSS_PERCENT = 0.011;
const INFLATION_PERCENT = 0.064;
const KWH_PER_KWP = 1030;
const EEG = 0.08;
const EEG_YEARS = 20;
const CALCULATION_YEARS = 25;
const WATT_PRO_MODULE = 425;

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
  for (let i = 1; i <= CALCULATION_YEARS; i++) {
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
  const { formContent, setFormContent, calculationData, setCalculationData } =
    useContext(FormContext);
  const { userObject } = useOutletContext();

  const [pvLeistung, setPvLeistung] = useState(0);
  const [verbrauch, setVerbrauch] = useState(0);
  console.log('verbrauch', verbrauch);
  const [speicher, setSpeicher] = useState(0);
  const [kWp, setkWp] = useState(0);

  // Autarkie
  const [autarkie, setAutarkie] = useState(0);

  // Eigenverbrauch
  const [eigenverbrauch, setEigenverbrauch] = useState(0);

  // Cashflow
  const [pvSolar, setPvSolar] = useState(0);
  const [eegS, setEegS] = useState(0);
  const [eegCash, setEegCash] = useState(0);
  const [einsparung, setEinsparung] = useState(0);
  const [kaufPreis, setKaufPreis] = useState(0);
  const [cashflow, setCashflow] = useState(0);

  // Kapitalrendite
  const [kapitalrendite, setKapitalrendite] = useState(0);

  useEffect(() => {
    setPvLeistung((prevPvLeistung) =>
      formContent.anzahlModule ? formContent.anzahlModule * WATT_PRO_MODULE : 0
    );
    setVerbrauch(
      (prevVerbrauch) =>
        (formContent.hausstromverbrauch || 0) +
        (formContent.nutzstromverbrauch || 0) +
        (formContent.eAutoVerbrauch || 0)
    );
    setSpeicher((prevSpeicher) =>
      formContent.speicherGroesse ? formContent.speicherGroesse : 0
    );
    setkWp((prevkWp) =>
      formContent.benoetigteKwp ? formContent.benoetigteKwp : 0
    );
    setKaufPreis(
      calculateKaufpreis(formContent, calculationData, setCalculationData)
    );
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
        setAutarkie(rawAutarkieValue);
        setEigenverbrauch(rawEigenverbrauchValue);
      } else {
        setAutarkie(0);
        setEigenverbrauch(0);
      }
    }
  }, [pvLeistung, verbrauch, speicher]);

  useEffect(() => {
    if (verbrauch && autarkie) {
      setPvSolar(verbrauch * autarkie);
    }
  }, [verbrauch, autarkie]);

  useEffect(() => {
    if (kWp && pvSolar) {
      const eegS = kWp * KWH_PER_KWP - pvSolar;
      setEegS(eegS);
      setEegCash(eegS * EEG * EEG_YEARS);
      setEinsparung(
        calculateSavings(pvSolar, COST_PER_KWH, LOSS_PERCENT, INFLATION_PERCENT)
      );
    }
  }, [pvSolar, kWp]);

  useEffect(() => {
    if (eegCash && einsparung && kaufPreis) {
      const cashFlowValue = eegCash + einsparung - kaufPreis;
      const cashFlowReformat = new Intl.NumberFormat('de', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(cashFlowValue);
      const kapitalRendite = cashFlowValue / kaufPreis / CALCULATION_YEARS;
      const kapitalRenditeReformat = new Intl.NumberFormat('de', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(kapitalRendite);
      setCashflow(cashFlowReformat);
      setKapitalrendite(kapitalRenditeReformat);
    }
  }, [eegCash, einsparung, kaufPreis]);

  useEffect(() => {
    setCalculationData((prevCalculationData) => {
      return {
        ...prevCalculationData,
        autarkie: (autarkie * 100).toFixed(0) + '%',
        eigenverbrauch: (eigenverbrauch * 100).toFixed(0) + '%',
        cashflow,
        kapitalrendite,
        verbrauch: verbrauch.toFixed(0) + ' kWh',
        strompreis: new Intl.NumberFormat('de', {
          currency: 'EUR',
          style: 'currency',
        }).format(formContent.arbeitspreis),
        grundpreis: new Intl.NumberFormat('de', {
          currency: 'EUR',
          style: 'currency',
        }).format(formContent.grundgebuehr),
        kaufPreis: new Intl.NumberFormat('de', {
          currency: 'EUR',
          style: 'currency',
        }).format(kaufPreis),
      };
    });
  }, [
    kaufPreis,
    autarkie,
    eigenverbrauch,
    cashflow,
    kapitalrendite,
    formContent.arbeitspreis,
    formContent.grundgebuehr,
    verbrauch,
    setCalculationData,
  ]);

  return (
    <>
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Wirtschaftlichkeit
      </h1>
      <div className="flex flex-wrap -m-2">
        <div className="w-1/2 md:w-1/2 p-2">
          <div
            className="flex flex-col justify-between p-4 border-2 rounded h-full"
            style={{ borderColor: userObject?.color }}
          >
            <h2 className="font-bold mb-2">Autarkie</h2>
            <p className="text-2xl font-bold md:text-5xl md:font-normal">
              {autarkie ? (autarkie * 100).toFixed(0) + '%' : '/'}
            </p>
          </div>
        </div>

        <div className="w-1/2 md:w-1/2 p-2">
          <div
            className="flex flex-col justify-between p-4 border-2 rounded h-full"
            style={{ borderColor: userObject?.color }}
          >
            <h2 className="font-bold mb-2">Anlagennutzung</h2>
            <p className="text-2xl font-bold md:text-5xl md:font-normal">
              {eigenverbrauch ? (eigenverbrauch * 100).toFixed(0) + '%' : '/'}
            </p>
          </div>
        </div>

        <div className="w-1/2 md:w-1/2 p-2">
          <div
            className="flex flex-col justify-between p-4 border-2 rounded h-full"
            style={{ borderColor: userObject?.color }}
          >
            <h2 className="font-bold mb-2">Gesamt-Cashflow</h2>
            <p className="text-2xl font-bold md:text-5xl md:font-normal">
              {cashflow ? cashflow : '/'}
            </p>
          </div>
        </div>

        <div className="w-1/2 md:w-1/2 p-2">
          <div
            className="flex flex-col justify-between p-4 border-2 rounded h-full"
            style={{ borderColor: userObject?.color }}
          >
            <h2 className="font-bold mb-2">Kapitalrendite p.a.</h2>
            <p className="text-2xl font-bold md:text-5xl md:font-normal">
              {kapitalrendite ? kapitalrendite : '/'}
            </p>
          </div>
        </div>

        {kaufPreis ? (
          <p className="p-2 text-red-500 font-bold">
            Kaufpreis:{' '}
            {new Intl.NumberFormat('de', {
              currency: 'EUR',
              style: 'currency',
            }).format(kaufPreis)}
          </p>
        ) : null}

        <div className="w-full mt-8">
          <CashflowGraph
            purchasePrice={kaufPreis}
            einspeiseVerguetung={eegS * EEG}
            pvs={pvSolar}
            inflation={INFLATION_PERCENT}
            lossPercent={LOSS_PERCENT}
            costPerKwh={COST_PER_KWH}
            formContent={formContent}
            setFormContent={setFormContent}
          />
        </div>
      </div>
    </>
  );
};

export default Wirtschaftlichkeit;
