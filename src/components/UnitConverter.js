import React, { useState, useEffect } from 'react';
import './UnitConverter.css';

const UnitConverter = () => {
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [history, setHistory] = useState([]);

  const categories = {
    length: {
      name: '📏 Length',
      units: {
        mm: { name: 'Millimeter', factor: 0.001 },
        cm: { name: 'Centimeter', factor: 0.01 },
        m: { name: 'Meter', factor: 1 },
        km: { name: 'Kilometer', factor: 1000 },
        in: { name: 'Inch', factor: 0.0254 },
        ft: { name: 'Foot', factor: 0.3048 },
        yd: { name: 'Yard', factor: 0.9144 },
        mi: { name: 'Mile', factor: 1609.34 }
      }
    },
    weight: {
      name: '⚖️ Weight',
      units: {
        mg: { name: 'Milligram', factor: 0.000001 },
        g: { name: 'Gram', factor: 0.001 },
        kg: { name: 'Kilogram', factor: 1 },
        oz: { name: 'Ounce', factor: 0.0283495 },
        lb: { name: 'Pound', factor: 0.453592 },
        ton: { name: 'Metric Ton', factor: 1000 }
      }
    },
    temperature: {
      name: '🌡️ Temperature',
      units: {
        c: { name: 'Celsius' },
        f: { name: 'Fahrenheit' },
        k: { name: 'Kelvin' }
      }
    },
    area: {
      name: '📐 Area',
      units: {
        sqmm: { name: 'Square Millimeter', factor: 0.000001 },
        sqcm: { name: 'Square Centimeter', factor: 0.0001 },
        sqm: { name: 'Square Meter', factor: 1 },
        sqkm: { name: 'Square Kilometer', factor: 1000000 },
        sqin: { name: 'Square Inch', factor: 0.00064516 },
        sqft: { name: 'Square Foot', factor: 0.092903 },
        acre: { name: 'Acre', factor: 4046.86 }
      }
    },
    volume: {
      name: '🥤 Volume',
      units: {
        ml: { name: 'Milliliter', factor: 0.001 },
        l: { name: 'Liter', factor: 1 },
        gal: { name: 'Gallon (US)', factor: 3.78541 },
        qt: { name: 'Quart (US)', factor: 0.946353 },
        pt: { name: 'Pint (US)', factor: 0.473176 },
        cup: { name: 'Cup (US)', factor: 0.236588 },
        floz: { name: 'Fluid Ounce (US)', factor: 0.0295735 }
      }
    },
    time: {
      name: '⏰ Time',
      units: {
        ms: { name: 'Millisecond', factor: 0.001 },
        s: { name: 'Second', factor: 1 },
        min: { name: 'Minute', factor: 60 },
        hr: { name: 'Hour', factor: 3600 },
        day: { name: 'Day', factor: 86400 },
        week: { name: 'Week', factor: 604800 },
        month: { name: 'Month', factor: 2629746 },
        year: { name: 'Year', factor: 31556952 }
      }
    }
  };

  useEffect(() => {
    const units = Object.keys(categories[selectedCategory].units);
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setFromValue('');
    setToValue('');
  }, [selectedCategory]);

  useEffect(() => {
    if (fromValue && fromUnit && toUnit) {
      convertValue();
    } else {
      setToValue('');
    }
  }, [fromValue, fromUnit, toUnit]);

  const convertValue = () => {
    if (!fromValue || isNaN(fromValue)) {
      setToValue('');
      return;
    }

    const value = parseFloat(fromValue);
    let result;

    if (selectedCategory === 'temperature') {
      result = convertTemperature(value, fromUnit, toUnit);
    } else {
      const fromFactor = categories[selectedCategory].units[fromUnit].factor;
      const toFactor = categories[selectedCategory].units[toUnit].factor;
      result = (value * fromFactor) / toFactor;
    }

    setToValue(result.toString());

    // Add to history
    const conversion = {
      id: Date.now(),
      category: selectedCategory,
      from: `${value} ${categories[selectedCategory].units[fromUnit].name}`,
      to: `${result} ${categories[selectedCategory].units[toUnit].name}`,
      timestamp: new Date().toLocaleTimeString()
    };
    setHistory(prev => [conversion, ...prev.slice(0, 9)]);
  };

  const convertTemperature = (value, from, to) => {
    // Convert to Celsius first
    let celsius;
    switch (from) {
      case 'c':
        celsius = value;
        break;
      case 'f':
        celsius = (value - 32) * 5/9;
        break;
      case 'k':
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }

    // Convert from Celsius to target
    switch (to) {
      case 'c':
        return celsius;
      case 'f':
        return (celsius * 9/5) + 32;
      case 'k':
        return celsius + 273.15;
      default:
        return celsius;
    }
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
  };

  const clearAll = () => {
    setFromValue('');
    setToValue('');
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="unit-converter">
      {/* Header */}
      <div className="converter-header">
        <div className="header-left">
          <h2>📏 Unit Converter</h2>
          <span className="category-name">{categories[selectedCategory].name}</span>
        </div>
        <div className="header-actions">
          <button onClick={clearAll} className="clear-btn">
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="converter-content">
        {/* Category Selection */}
        <div className="category-section">
          <h4>Categories</h4>
          <div className="category-grid">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`category-btn ${selectedCategory === key ? 'active' : ''}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Conversion Section */}
        <div className="conversion-section">
          <div className="conversion-row">
            <div className="unit-input">
              <label>From</label>
              <div className="input-group">
                <input
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  placeholder="Enter value"
                  className="value-input"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="unit-select"
                >
                  {Object.entries(categories[selectedCategory].units).map(([key, unit]) => (
                    <option key={key} value={key}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button onClick={swapUnits} className="swap-btn" title="Swap units">
              ⇄
            </button>

            <div className="unit-input">
              <label>To</label>
              <div className="input-group">
                <input
                  type="number"
                  value={toValue}
                  readOnly
                  placeholder="Result"
                  className="value-input result"
                />
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="unit-select"
                >
                  {Object.entries(categories[selectedCategory].units).map(([key, unit]) => (
                    <option key={key} value={key}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <h4>Recent Conversions</h4>
              <button onClick={clearHistory} className="clear-history-btn">
                Clear History
              </button>
            </div>
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="conversion-text">
                    {item.from} → {item.to}
                  </div>
                  <div className="conversion-time">{item.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitConverter;
