import React, { useState, useEffect } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const { key } = event;

      if (key >= '0' && key <= '9') {
        inputNumber(key);
      } else if (key === '.') {
        inputDecimal();
      } else if (key === '=' || key === 'Enter') {
        calculate();
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        inputOperation(key);
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clear();
      } else if (key === 'Backspace') {
        backspace();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [display, previousValue, operation, waitingForOperand, inputNumber, inputDecimal, calculate, inputOperation, backspace]);

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = performCalculation(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = performCalculation(previousValue, inputValue, operation);
      
      // Add to history
      const calculation = `${previousValue} ${operation} ${inputValue} = ${newValue}`;
      setHistory(prev => [calculation, ...prev.slice(0, 4)]); // Keep last 5 calculations

      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const performCalculation = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const percentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const squareRoot = () => {
    const value = parseFloat(display);
    if (value >= 0) {
      const result = Math.sqrt(value);
      setDisplay(String(result));
      
      // Add to history
      const calculation = `√${value} = ${result}`;
      setHistory(prev => [calculation, ...prev.slice(0, 4)]);
    }
  };

  const toggleSign = () => {
    if (display !== '0') {
      setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h2>🔢 Calculator</h2>
        <div className="keyboard-hint">
          <span>💡 Keyboard supported!</span>
        </div>
      </div>

      <div className="calculator-content">
        <div className="calculator">
          <div className="calculator-display">
            <div className="display-value">{display}</div>
            {operation && (
              <div className="operation-indicator">
                {previousValue} {operation}
              </div>
            )}
          </div>

          <div className="calculator-buttons">
            <button onClick={clear} className="btn btn-clear">C</button>
            <button onClick={backspace} className="btn btn-function">⌫</button>
            <button onClick={percentage} className="btn btn-function">%</button>
            <button onClick={() => inputOperation('/')} className="btn btn-operator">÷</button>

            <button onClick={() => inputNumber('7')} className="btn btn-number">7</button>
            <button onClick={() => inputNumber('8')} className="btn btn-number">8</button>
            <button onClick={() => inputNumber('9')} className="btn btn-number">9</button>
            <button onClick={() => inputOperation('*')} className="btn btn-operator">×</button>

            <button onClick={() => inputNumber('4')} className="btn btn-number">4</button>
            <button onClick={() => inputNumber('5')} className="btn btn-number">5</button>
            <button onClick={() => inputNumber('6')} className="btn btn-number">6</button>
            <button onClick={() => inputOperation('-')} className="btn btn-operator">−</button>

            <button onClick={() => inputNumber('1')} className="btn btn-number">1</button>
            <button onClick={() => inputNumber('2')} className="btn btn-number">2</button>
            <button onClick={() => inputNumber('3')} className="btn btn-number">3</button>
            <button onClick={() => inputOperation('+')} className="btn btn-operator">+</button>

            <button onClick={toggleSign} className="btn btn-function">±</button>
            <button onClick={() => inputNumber('0')} className="btn btn-number">0</button>
            <button onClick={inputDecimal} className="btn btn-function">.</button>
            <button onClick={calculate} className="btn btn-equals">=</button>

            <button onClick={squareRoot} className="btn btn-function btn-wide">√</button>
          </div>
        </div>

        <div className="calculator-history">
          <div className="history-header">
            <h3>📜 History</h3>
            {history.length > 0 && (
              <button onClick={clearHistory} className="clear-history-btn">
                Clear
              </button>
            )}
          </div>
          
          <div className="history-list">
            {history.length === 0 ? (
              <div className="empty-history">
                <p>No calculations yet</p>
                <p>Start calculating to see history!</p>
              </div>
            ) : (
              history.map((calculation, index) => (
                <div key={index} className="history-item">
                  {calculation}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
