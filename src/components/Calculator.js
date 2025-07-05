import React, { useState, useEffect } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isScientific, setIsScientific] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [angleMode, setAngleMode] = useState('deg'); // 'deg' or 'rad'

  useEffect(() => {
    const handleKeyPress = (event) => {
      const { key } = event;

      if (key >= '0' && key <= '9') {
        inputNumber(key);
      } else if (key === '.') {
        inputDecimal();
      } else if (['+', '-', '*', '/'].includes(key)) {
        inputOperation(key);
      } else if (key === 'Enter' || key === '=') {
        calculate();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clear();
      } else if (key === 'Backspace') {
        backspace();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

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
      setHistory(prev => [calculation, ...prev.slice(0, 9)]); // Keep last 10 calculations

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
      case '^':
        return Math.pow(firstValue, secondValue);
      default:
        return secondValue;
    }
  };

  // Scientific functions
  const scientificFunction = (func) => {
    const value = parseFloat(display);
    let result;

    try {
      switch (func) {
        case 'sin':
          result = angleMode === 'deg' ? Math.sin(value * Math.PI / 180) : Math.sin(value);
          break;
        case 'cos':
          result = angleMode === 'deg' ? Math.cos(value * Math.PI / 180) : Math.cos(value);
          break;
        case 'tan':
          result = angleMode === 'deg' ? Math.tan(value * Math.PI / 180) : Math.tan(value);
          break;
        case 'log':
          result = Math.log10(value);
          break;
        case 'ln':
          result = Math.log(value);
          break;
        case 'sqrt':
          result = Math.sqrt(value);
          break;
        case 'square':
          result = value * value;
          break;
        case 'cube':
          result = value * value * value;
          break;
        case 'factorial':
          result = factorial(value);
          break;
        case 'reciprocal':
          result = 1 / value;
          break;
        case 'exp':
          result = Math.exp(value);
          break;
        case 'abs':
          result = Math.abs(value);
          break;
        case 'pi':
          result = Math.PI;
          break;
        case 'e':
          result = Math.E;
          break;
        default:
          result = value;
      }

      setDisplay(String(result));
      setWaitingForOperand(true);
    } catch (error) {
      setDisplay('Error');
    }
  };

  const factorial = (n) => {
    if (n < 0 || n !== Math.floor(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  // Memory functions
  const memoryStore = () => {
    setMemory(parseFloat(display));
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };

  return (
    <div className="calculator">
      {/* Header */}
      <div className="calculator-header">
        <div className="header-left">
          <h2>🔢 Calculator</h2>
          <span className="mode-indicator">{isScientific ? 'Scientific' : 'Basic'}</span>
        </div>
        <div className="header-actions">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`history-btn ${showHistory ? 'active' : ''}`}
            title="Toggle History"
          >
            📜
          </button>
          <button
            onClick={() => setIsScientific(!isScientific)}
            className={`mode-toggle ${isScientific ? 'scientific' : 'basic'}`}
          >
            {isScientific ? '🔬 Sci' : '🔢 Basic'}
          </button>
        </div>
      </div>

      <div className="calculator-content">
        {/* History Sidebar */}
        {showHistory && (
          <div className="calculator-history">
            <div className="history-header">
              <h4>History</h4>
              <button onClick={() => setHistory([])} className="clear-history-btn">
                Clear
              </button>
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <div className="no-history">No calculations yet</div>
              ) : (
                history.map((calc, index) => (
                  <div key={index} className="history-item">
                    {calc}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Main Calculator */}
        <div className="calculator-main">
          {/* Display */}
          <div className="calculator-display">
            <div className="display-info">
              {operation && previousValue !== null && (
                <div className="operation-display">
                  {previousValue} {operation}
                </div>
              )}
              {memory !== 0 && <div className="memory-indicator">M</div>}
              {isScientific && (
                <div className="angle-mode">{angleMode.toUpperCase()}</div>
              )}
            </div>
            <div className="main-display">{display}</div>
          </div>

          {/* Button Grid */}
          <div className="calculator-buttons">
            {isScientific ? (
              // Scientific Calculator Layout
              <>
                {/* Row 1 - Functions */}
                <div className="button-row scientific-row">
                  <button onClick={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')} className="btn-function">
                    {angleMode}
                  </button>
                  <button onClick={() => scientificFunction('sin')} className="btn-function">sin</button>
                  <button onClick={() => scientificFunction('cos')} className="btn-function">cos</button>
                  <button onClick={() => scientificFunction('tan')} className="btn-function">tan</button>
                  <button onClick={() => scientificFunction('log')} className="btn-function">log</button>
                </div>

                {/* Row 2 - More Functions */}
                <div className="button-row scientific-row">
                  <button onClick={() => scientificFunction('pi')} className="btn-function">π</button>
                  <button onClick={() => scientificFunction('e')} className="btn-function">e</button>
                  <button onClick={() => scientificFunction('ln')} className="btn-function">ln</button>
                  <button onClick={() => scientificFunction('exp')} className="btn-function">exp</button>
                  <button onClick={() => inputOperation('^')} className="btn-function">x^y</button>
                </div>

                {/* Row 3 - Memory & Functions */}
                <div className="button-row scientific-row">
                  <button onClick={memoryClear} className="btn-memory">MC</button>
                  <button onClick={memoryRecall} className="btn-memory">MR</button>
                  <button onClick={memoryStore} className="btn-memory">MS</button>
                  <button onClick={memoryAdd} className="btn-memory">M+</button>
                  <button onClick={memorySubtract} className="btn-memory">M-</button>
                </div>

                {/* Row 4 - More Functions */}
                <div className="button-row scientific-row">
                  <button onClick={() => scientificFunction('sqrt')} className="btn-function">√</button>
                  <button onClick={() => scientificFunction('square')} className="btn-function">x²</button>
                  <button onClick={() => scientificFunction('cube')} className="btn-function">x³</button>
                  <button onClick={() => scientificFunction('factorial')} className="btn-function">x!</button>
                  <button onClick={() => scientificFunction('reciprocal')} className="btn-function">1/x</button>
                </div>

                {/* Row 5 - Clear & Operations */}
                <div className="button-row">
                  <button onClick={clear} className="btn-clear">C</button>
                  <button onClick={backspace} className="btn-operation">⌫</button>
                  <button onClick={() => inputOperation('/')} className="btn-operation">÷</button>
                  <button onClick={() => inputOperation('*')} className="btn-operation">×</button>
                </div>

                {/* Row 6-8 - Numbers */}
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
                  <button onClick={inputDecimal} className="btn-number">.</button>
                  <button onClick={() => scientificFunction('abs')} className="btn-function">|x|</button>
                </div>
              </>
            ) : (
              // Basic Calculator Layout
              <>
                <div className="button-row">
                  <button onClick={clear} className="btn-clear">C</button>
                  <button onClick={backspace} className="btn-operation">⌫</button>
                  <button onClick={() => inputOperation('/')} className="btn-operation">÷</button>
                  <button onClick={() => inputOperation('*')} className="btn-operation">×</button>
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
                  <button onClick={inputDecimal} className="btn-number">.</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
