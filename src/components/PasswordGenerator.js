import React, { useState, useEffect } from 'react';
import './PasswordGenerator.css';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [strength, setStrength] = useState({ score: 0, text: 'Weak', color: '#dc3545' });
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const characters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O',
    ambiguous: '{}[]()/\\\'"`~,;.<>'
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const generatePassword = () => {
    let charset = '';
    
    if (options.uppercase) charset += characters.uppercase;
    if (options.lowercase) charset += characters.lowercase;
    if (options.numbers) charset += characters.numbers;
    if (options.symbols) charset += characters.symbols;

    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !characters.similar.includes(char)).join('');
    }
    
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !characters.ambiguous.includes(char)).join('');
    }

    if (charset === '') {
      setPassword('');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(newPassword);
    calculateStrength(newPassword);
  };

  const calculateStrength = (pwd) => {
    let score = 0;
    let feedback = [];

    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;

    // Character variety
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    // Bonus for very long passwords
    if (pwd.length >= 20) score += 1;

    let strengthData;
    if (score <= 2) {
      strengthData = { score, text: 'Weak', color: '#dc3545' };
    } else if (score <= 4) {
      strengthData = { score, text: 'Fair', color: '#ffc107' };
    } else if (score <= 6) {
      strengthData = { score, text: 'Good', color: '#fd7e14' };
    } else {
      strengthData = { score, text: 'Strong', color: '#28a745' };
    }

    setStrength(strengthData);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      
      // Add to history
      const historyItem = {
        id: Date.now(),
        password: password,
        length: password.length,
        strength: strength.text,
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const handleOptionChange = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const getStrengthWidth = () => {
    return (strength.score / 8) * 100;
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const presetConfigs = {
    basic: { length: 8, uppercase: true, lowercase: true, numbers: true, symbols: false },
    strong: { length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true },
    pin: { length: 6, uppercase: false, lowercase: false, numbers: true, symbols: false },
    memorable: { length: 12, uppercase: true, lowercase: true, numbers: false, symbols: false }
  };

  const applyPreset = (preset) => {
    setLength(presetConfigs[preset].length);
    setOptions({
      uppercase: presetConfigs[preset].uppercase,
      lowercase: presetConfigs[preset].lowercase,
      numbers: presetConfigs[preset].numbers,
      symbols: presetConfigs[preset].symbols,
      excludeSimilar: false,
      excludeAmbiguous: false
    });
  };

  return (
    <div className="password-generator">
      {/* Header */}
      <div className="generator-header">
        <div className="header-left">
          <h2>🔐 Password Generator</h2>
          <span className="strength-badge" style={{ backgroundColor: strength.color }}>
            {strength.text}
          </span>
        </div>
        <div className="header-actions">
          <button onClick={generatePassword} className="generate-btn">
            🔄 Generate
          </button>
        </div>
      </div>

      <div className="generator-content">
        {/* Password Display */}
        <div className="password-section">
          <div className="password-display">
            <input
              type="text"
              value={password}
              readOnly
              className="password-input"
              placeholder="Generated password will appear here"
            />
            <button
              onClick={copyToClipboard}
              className={`copy-btn ${copied ? 'copied' : ''}`}
              disabled={!password}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
          
          {/* Strength Indicator */}
          <div className="strength-section">
            <div className="strength-label">Password Strength</div>
            <div className="strength-bar">
              <div 
                className="strength-fill" 
                style={{ 
                  width: `${getStrengthWidth()}%`,
                  backgroundColor: strength.color 
                }}
              ></div>
            </div>
            <div className="strength-text" style={{ color: strength.color }}>
              {strength.text} ({strength.score}/8)
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className="config-section">
          {/* Presets */}
          <div className="presets-section">
            <h4>Quick Presets</h4>
            <div className="preset-buttons">
              <button onClick={() => applyPreset('basic')} className="preset-btn">
                🔒 Basic (8 chars)
              </button>
              <button onClick={() => applyPreset('strong')} className="preset-btn">
                🛡️ Strong (16 chars)
              </button>
              <button onClick={() => applyPreset('pin')} className="preset-btn">
                📱 PIN (6 digits)
              </button>
              <button onClick={() => applyPreset('memorable')} className="preset-btn">
                🧠 Memorable (12 chars)
              </button>
            </div>
          </div>

          {/* Length */}
          <div className="length-section">
            <label>Password Length: {length}</label>
            <input
              type="range"
              min="4"
              max="50"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="length-slider"
            />
            <div className="length-labels">
              <span>4</span>
              <span>50</span>
            </div>
          </div>

          {/* Character Options */}
          <div className="options-section">
            <h4>Character Types</h4>
            <div className="options-grid">
              <label className="option-item">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={() => handleOptionChange('uppercase')}
                />
                <span className="checkmark"></span>
                Uppercase Letters (A-Z)
              </label>
              
              <label className="option-item">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={() => handleOptionChange('lowercase')}
                />
                <span className="checkmark"></span>
                Lowercase Letters (a-z)
              </label>
              
              <label className="option-item">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={() => handleOptionChange('numbers')}
                />
                <span className="checkmark"></span>
                Numbers (0-9)
              </label>
              
              <label className="option-item">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={() => handleOptionChange('symbols')}
                />
                <span className="checkmark"></span>
                Symbols (!@#$%^&*)
              </label>
              
              <label className="option-item">
                <input
                  type="checkbox"
                  checked={options.excludeSimilar}
                  onChange={() => handleOptionChange('excludeSimilar')}
                />
                <span className="checkmark"></span>
                Exclude Similar (il1Lo0O)
              </label>
              
              <label className="option-item">
                <input
                  type="checkbox"
                  checked={options.excludeAmbiguous}
                  onChange={() => handleOptionChange('excludeAmbiguous')}
                />
                <span className="checkmark"></span>
                Exclude Ambiguous
              </label>
            </div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <h4>Recent Passwords</h4>
              <button onClick={clearHistory} className="clear-history-btn">
                Clear History
              </button>
            </div>
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="password-preview">
                    {'•'.repeat(item.length)} ({item.length} chars)
                  </div>
                  <div className="password-meta">
                    <span className="strength-tag" style={{ 
                      backgroundColor: item.strength === 'Strong' ? '#28a745' : 
                                     item.strength === 'Good' ? '#fd7e14' :
                                     item.strength === 'Fair' ? '#ffc107' : '#dc3545'
                    }}>
                      {item.strength}
                    </span>
                    <span className="timestamp">{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordGenerator;
