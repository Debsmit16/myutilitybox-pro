import React, { useState } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');

  const inputNumber = (num) => {
    setDisplay(display === '0' ? String(num) : display + num);
  };

  const clear = () => {
    setDisplay('0');
  };

  const calculate = () => {
    try {
      // Simple evaluation - in production, use a proper math parser
      const result = eval(display);
      setDisplay(String(result));
    } catch (error) {
      setDisplay('Error');
    }
  };

  const inputOperation = (op) => {
    setDisplay(display + ' ' + op + ' ');
  };

  return (
    <div className="calculator">
      <div className="calculator-header">
        <h2>🔢 Calculator</h2>
      </div>
      
      <div className="calculator-display">
        <input type="text" value={display} readOnly />
      </div>
      
      <div className="calculator-buttons">
        <div className="button-row">
          <button onClick={clear} className="btn-clear">C</button>
          <button onClick={() => inputOperation('/')} className="btn-operation">÷</button>
          <button onClick={() => inputOperation('*')} className="btn-operation">×</button>
          <button onClick={() => setDisplay(display.slice(0, -1) || '0')} className="btn-operation">⌫</button>
        </div>
        
        <div className="button-row">
          <button onClick={() => inputNumber('7')} className="btn-number">7</button>
          <button onClick={() => inputNumber('8')} className="btn-number">8</button>
          <button onClick={() => inputNumber('9')} className="btn-number">9</button>
          <button onClick={() => inputOperation('-')} className="btn-operation">-</button>
        </div>
        
        <div className="button-row">
          <button onClick={() => inputNumber('4')} className="btn-number">4</button>
          <button onClick={() => inputNumber('5')} className="btn-number">5</button>
          <button onClick={() => inputNumber('6')} className="btn-number">6</button>
          <button onClick={() => inputOperation('+')} className="btn-operation">+</button>
        </div>
        
        <div className="button-row">
          <button onClick={() => inputNumber('1')} className="btn-number">1</button>
          <button onClick={() => inputNumber('2')} className="btn-number">2</button>
          <button onClick={() => inputNumber('3')} className="btn-number">3</button>
          <button onClick={calculate} className="btn-equals" rowSpan="2">=</button>
        </div>
        
        <div className="button-row">
          <button onClick={() => inputNumber('0')} className="btn-number btn-zero">0</button>
          <button onClick={() => setDisplay(display + '.')} className="btn-number">.</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
