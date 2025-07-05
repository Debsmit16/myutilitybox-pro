import React, { useState, useEffect } from 'react';
import './TipCalculator.css';

const TipCalculator = () => {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercentage, setTipPercentage] = useState(18);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [customTip, setCustomTip] = useState('');
  const [useCustomTip, setUseCustomTip] = useState(false);
  const [calculations, setCalculations] = useState({
    tipAmount: 0,
    totalAmount: 0,
    perPersonAmount: 0,
    tipPerPerson: 0
  });

  const tipPresets = [10, 15, 18, 20, 25];

  useEffect(() => {
    calculateTip();
  }, [billAmount, tipPercentage, numberOfPeople, customTip, useCustomTip]);

  const calculateTip = () => {
    const bill = parseFloat(billAmount) || 0;
    const tip = useCustomTip ? parseFloat(customTip) || 0 : tipPercentage;
    const people = parseInt(numberOfPeople) || 1;

    const tipAmount = (bill * tip) / 100;
    const totalAmount = bill + tipAmount;
    const perPersonAmount = totalAmount / people;
    const tipPerPerson = tipAmount / people;

    setCalculations({
      tipAmount: tipAmount,
      totalAmount: totalAmount,
      perPersonAmount: perPersonAmount,
      tipPerPerson: tipPerPerson
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const resetCalculator = () => {
    setBillAmount('');
    setTipPercentage(18);
    setNumberOfPeople(1);
    setCustomTip('');
    setUseCustomTip(false);
  };

  const getServiceQuality = (tip) => {
    if (tip < 10) return { text: 'Poor Service', color: '#dc3545', emoji: '😞' };
    if (tip < 15) return { text: 'Fair Service', color: '#ffc107', emoji: '😐' };
    if (tip < 20) return { text: 'Good Service', color: '#fd7e14', emoji: '😊' };
    if (tip < 25) return { text: 'Great Service', color: '#28a745', emoji: '😄' };
    return { text: 'Excellent Service', color: '#17a2b8', emoji: '🤩' };
  };

  const currentTip = useCustomTip ? parseFloat(customTip) || 0 : tipPercentage;
  const serviceQuality = getServiceQuality(currentTip);

  return (
    <div className="tip-calculator">
      {/* Header */}
      <div className="calculator-header">
        <div className="header-left">
          <h2>💳 Tip Calculator</h2>
          <div className="service-indicator">
            <span className="service-emoji">{serviceQuality.emoji}</span>
            <span className="service-text" style={{ color: serviceQuality.color }}>
              {serviceQuality.text}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={resetCalculator} className="reset-btn">
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="calculator-content">
        {/* Input Section */}
        <div className="input-section">
          <h4>Bill Details</h4>
          
          {/* Bill Amount */}
          <div className="input-group">
            <label>Bill Amount</label>
            <div className="currency-input">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="0.00"
                className="amount-input"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Tip Percentage */}
          <div className="input-group">
            <label>Tip Percentage</label>
            <div className="tip-selection">
              <div className="tip-presets">
                {tipPresets.map(preset => (
                  <button
                    key={preset}
                    onClick={() => {
                      setTipPercentage(preset);
                      setUseCustomTip(false);
                    }}
                    className={`tip-preset ${!useCustomTip && tipPercentage === preset ? 'active' : ''}`}
                  >
                    {preset}%
                  </button>
                ))}
              </div>
              <div className="custom-tip">
                <input
                  type="number"
                  value={customTip}
                  onChange={(e) => {
                    setCustomTip(e.target.value);
                    setUseCustomTip(true);
                  }}
                  placeholder="Custom %"
                  className="custom-tip-input"
                  min="0"
                  max="100"
                />
                <span className="percent-symbol">%</span>
              </div>
            </div>
          </div>

          {/* Number of People */}
          <div className="input-group">
            <label>Number of People</label>
            <div className="people-selector">
              <button
                onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                className="people-btn"
                disabled={numberOfPeople <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 1))}
                className="people-input"
                min="1"
                max="50"
              />
              <button
                onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                className="people-btn"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          <h4>Calculation Results</h4>
          
          <div className="results-grid">
            <div className="result-card total">
              <div className="result-label">Total Amount</div>
              <div className="result-value">{formatCurrency(calculations.totalAmount)}</div>
              <div className="result-breakdown">
                Bill: {formatCurrency(parseFloat(billAmount) || 0)} + Tip: {formatCurrency(calculations.tipAmount)}
              </div>
            </div>

            <div className="result-card tip">
              <div className="result-label">Tip Amount</div>
              <div className="result-value">{formatCurrency(calculations.tipAmount)}</div>
              <div className="result-breakdown">
                {currentTip}% of {formatCurrency(parseFloat(billAmount) || 0)}
              </div>
            </div>

            <div className="result-card per-person">
              <div className="result-label">Per Person</div>
              <div className="result-value">{formatCurrency(calculations.perPersonAmount)}</div>
              <div className="result-breakdown">
                Total ÷ {numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}
              </div>
            </div>

            <div className="result-card tip-per-person">
              <div className="result-label">Tip Per Person</div>
              <div className="result-value">{formatCurrency(calculations.tipPerPerson)}</div>
              <div className="result-breakdown">
                Tip ÷ {numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}
              </div>
            </div>
          </div>
        </div>

        {/* Tip Guide */}
        <div className="tip-guide">
          <h4>Tipping Guide</h4>
          <div className="guide-grid">
            <div className="guide-item">
              <span className="guide-service">Poor Service</span>
              <span className="guide-range">10-12%</span>
            </div>
            <div className="guide-item">
              <span className="guide-service">Fair Service</span>
              <span className="guide-range">13-15%</span>
            </div>
            <div className="guide-item">
              <span className="guide-service">Good Service</span>
              <span className="guide-range">16-19%</span>
            </div>
            <div className="guide-item">
              <span className="guide-service">Great Service</span>
              <span className="guide-range">20-24%</span>
            </div>
            <div className="guide-item">
              <span className="guide-service">Excellent Service</span>
              <span className="guide-range">25%+</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h4>Quick Actions</h4>
          <div className="action-buttons">
            <button
              onClick={() => {
                setBillAmount('25.00');
                setTipPercentage(18);
                setNumberOfPeople(2);
              }}
              className="quick-btn"
            >
              🍕 Lunch for 2
            </button>
            <button
              onClick={() => {
                setBillAmount('80.00');
                setTipPercentage(20);
                setNumberOfPeople(4);
              }}
              className="quick-btn"
            >
              🍽️ Dinner for 4
            </button>
            <button
              onClick={() => {
                setBillAmount('15.00');
                setTipPercentage(15);
                setNumberOfPeople(1);
              }}
              className="quick-btn"
            >
              ☕ Coffee Date
            </button>
            <button
              onClick={() => {
                setBillAmount('120.00');
                setTipPercentage(22);
                setNumberOfPeople(6);
              }}
              className="quick-btn"
            >
              🎉 Group Celebration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipCalculator;
