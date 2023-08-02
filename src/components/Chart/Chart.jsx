import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Label,
} from 'recharts';

function CashflowGraph({
  purchasePrice,
  einspeiseVerguetung,
  pvs,
  inflation,
  lossPercent,
  costPerKwh,
}) {
  const { userColor } = useOutletContext();
  const [activeIndex, setActiveIndex] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Generate the data
  let lastYearCashflow = -purchasePrice;
  let einsparungenStrombezug = pvs * costPerKwh;
  const data = Array.from({ length: 25 }, (_, i) => {
    const year = i + 1;
    // Apply the inflation and loss to einsparungenStrombezug for next year
    if (year > 1) {
      einsparungenStrombezug =
        einsparungenStrombezug * (1 + inflation) * (1 - lossPercent);
    }
    const cashflow =
      lastYearCashflow +
      einsparungenStrombezug +
      (year <= 20 ? einspeiseVerguetung : 0);
    lastYearCashflow = cashflow;
    return { year, cashflow };
  });

  const handleMouseOver = (data, index) => {
    setActiveIndex(index);
  };

  const handleMouseOut = () => {
    setActiveIndex(null);
  };

  const tooltipFormatter = (value) => {
    const currency = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
    return currency;
  };

  const axisTickFormatter = (tickValue) => {
    const currency = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(tickValue);
    return currency;
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 300 : 500}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: isMobile ? 30 : 50,
          bottom: 5, // Increase left margin if needed
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          interval={isMobile ? 2 : 0}
          height={60}
          fontSize={12}
        >
          <Label value="Jahr" offset={15} position="insideBottom" />
        </XAxis>
        <YAxis
          tickFormatter={axisTickFormatter}
          tick={{ dx: 0, fontSize: 12 }}
        />
        <Tooltip formatter={tooltipFormatter} />
        <Bar
          dataKey="cashflow"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index === activeIndex ? userColor : '#000'}
            />
          ))}
        </Bar>{' '}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CashflowGraph;
