import React, { useState, useEffect } from 'react';
import './ColorPicker.css';

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState('#3498db');
  const [colorFormat, setColorFormat] = useState('hex');
  const [colorHistory, setColorHistory] = useState([]);
  const [rgbValues, setRgbValues] = useState({ r: 52, g: 152, b: 219 });
  const [hslValues, setHslValues] = useState({ h: 204, s: 70, l: 53 });
  const [copied, setCopied] = useState('');

  const colorPalettes = {
    material: [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
      '#ff5722', '#795548', '#9e9e9e', '#607d8b', '#000000'
    ],
    pastel: [
      '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff',
      '#c9c9ff', '#ffc9ff', '#ffb3d9', '#d9ffb3', '#b3ffff',
      '#ffccb3', '#e6b3ff', '#b3ffe6', '#ffe6b3', '#b3b3ff',
      '#ffb3cc', '#ccffb3', '#b3ccff', '#ffccff', '#ccb3ff'
    ],
    vintage: [
      '#8b4513', '#a0522d', '#cd853f', '#daa520', '#b8860b',
      '#556b2f', '#6b8e23', '#808000', '#bc8f8f', '#f4a460',
      '#d2691e', '#cd5c5c', '#dc143c', '#b22222', '#8b0000',
      '#483d8b', '#2f4f4f', '#696969', '#708090', '#2e2e2e'
    ]
  };

  useEffect(() => {
    updateColorFromHex(selectedColor);
  }, []);

  const updateColorFromHex = (hex) => {
    setSelectedColor(hex);
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setRgbValues(rgb);
    setHslValues(hsl);
  };

  const updateColorFromRgb = (r, g, b) => {
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    setSelectedColor(hex);
    setRgbValues({ r, g, b });
    setHslValues(hsl);
  };

  const updateColorFromHsl = (h, s, l) => {
    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setSelectedColor(hex);
    setRgbValues(rgb);
    setHslValues({ h, s, l });
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const getColorValue = () => {
    switch (colorFormat) {
      case 'hex':
        return selectedColor.toUpperCase();
      case 'rgb':
        return `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`;
      case 'hsl':
        return `hsl(${hslValues.h}, ${hslValues.s}%, ${hslValues.l}%)`;
      case 'rgba':
        return `rgba(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}, 1)`;
      default:
        return selectedColor;
    }
  };

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      
      // Add to history
      const historyItem = {
        id: Date.now(),
        color: selectedColor,
        value: value,
        timestamp: new Date().toLocaleTimeString()
      };
      setColorHistory(prev => [historyItem, ...prev.slice(0, 9)]);

      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    updateColorFromHex(randomColor);
  };

  const generateColorShades = (baseColor, count = 5) => {
    const rgb = hexToRgb(baseColor);
    const shades = [];
    
    for (let i = 0; i < count; i++) {
      const factor = (i + 1) / (count + 1);
      const r = Math.round(rgb.r * factor);
      const g = Math.round(rgb.g * factor);
      const b = Math.round(rgb.b * factor);
      shades.push(rgbToHex(r, g, b));
    }
    
    return shades;
  };

  const generateColorTints = (baseColor, count = 5) => {
    const rgb = hexToRgb(baseColor);
    const tints = [];
    
    for (let i = 0; i < count; i++) {
      const factor = (i + 1) / (count + 1);
      const r = Math.round(rgb.r + (255 - rgb.r) * factor);
      const g = Math.round(rgb.g + (255 - rgb.g) * factor);
      const b = Math.round(rgb.b + (255 - rgb.b) * factor);
      tints.push(rgbToHex(r, g, b));
    }
    
    return tints;
  };

  const clearHistory = () => {
    setColorHistory([]);
  };

  return (
    <div className="color-picker">
      {/* Header */}
      <div className="picker-header">
        <div className="header-left">
          <h2>🎨 Color Picker</h2>
          <div className="color-preview" style={{ backgroundColor: selectedColor }}></div>
        </div>
        <div className="header-actions">
          <button onClick={generateRandomColor} className="random-btn">
            🎲 Random
          </button>
        </div>
      </div>

      <div className="picker-content">
        {/* Main Color Picker */}
        <div className="main-picker-section">
          <div className="color-input-section">
            <label>Pick a Color</label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => updateColorFromHex(e.target.value)}
              className="color-input"
            />
          </div>

          {/* Color Values */}
          <div className="color-values-section">
            <h4>Color Values</h4>
            <div className="format-selector">
              {['hex', 'rgb', 'hsl', 'rgba'].map(format => (
                <button
                  key={format}
                  onClick={() => setColorFormat(format)}
                  className={`format-btn ${colorFormat === format ? 'active' : ''}`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
            
            <div className="color-value-display">
              <input
                type="text"
                value={getColorValue()}
                readOnly
                className="color-value-input"
              />
              <button
                onClick={() => copyToClipboard(getColorValue())}
                className={`copy-btn ${copied === getColorValue() ? 'copied' : ''}`}
              >
                {copied === getColorValue() ? '✓' : '📋'}
              </button>
            </div>
          </div>

          {/* RGB Sliders */}
          <div className="rgb-sliders">
            <h4>RGB Values</h4>
            <div className="slider-group">
              <label>Red: {rgbValues.r}</label>
              <input
                type="range"
                min="0"
                max="255"
                value={rgbValues.r}
                onChange={(e) => updateColorFromRgb(parseInt(e.target.value), rgbValues.g, rgbValues.b)}
                className="color-slider red"
              />
            </div>
            <div className="slider-group">
              <label>Green: {rgbValues.g}</label>
              <input
                type="range"
                min="0"
                max="255"
                value={rgbValues.g}
                onChange={(e) => updateColorFromRgb(rgbValues.r, parseInt(e.target.value), rgbValues.b)}
                className="color-slider green"
              />
            </div>
            <div className="slider-group">
              <label>Blue: {rgbValues.b}</label>
              <input
                type="range"
                min="0"
                max="255"
                value={rgbValues.b}
                onChange={(e) => updateColorFromRgb(rgbValues.r, rgbValues.g, parseInt(e.target.value))}
                className="color-slider blue"
              />
            </div>
          </div>
        </div>

        {/* Color Palettes */}
        <div className="palettes-section">
          <h4>Color Palettes</h4>
          {Object.entries(colorPalettes).map(([name, colors]) => (
            <div key={name} className="palette-group">
              <h5>{name.charAt(0).toUpperCase() + name.slice(1)}</h5>
              <div className="palette-colors">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="palette-color"
                    style={{ backgroundColor: color }}
                    onClick={() => updateColorFromHex(color)}
                    title={color}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Color Variations */}
        <div className="variations-section">
          <h4>Color Variations</h4>
          <div className="variation-group">
            <h5>Shades (Darker)</h5>
            <div className="variation-colors">
              {generateColorShades(selectedColor).map((shade, index) => (
                <div
                  key={index}
                  className="variation-color"
                  style={{ backgroundColor: shade }}
                  onClick={() => updateColorFromHex(shade)}
                  title={shade}
                ></div>
              ))}
            </div>
          </div>
          <div className="variation-group">
            <h5>Tints (Lighter)</h5>
            <div className="variation-colors">
              {generateColorTints(selectedColor).map((tint, index) => (
                <div
                  key={index}
                  className="variation-color"
                  style={{ backgroundColor: tint }}
                  onClick={() => updateColorFromHex(tint)}
                  title={tint}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* History */}
        {colorHistory.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <h4>Recent Colors</h4>
              <button onClick={clearHistory} className="clear-history-btn">
                Clear History
              </button>
            </div>
            <div className="history-colors">
              {colorHistory.map((item) => (
                <div
                  key={item.id}
                  className="history-item"
                  onClick={() => updateColorFromHex(item.color)}
                >
                  <div
                    className="history-color"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="history-info">
                    <div className="history-value">{item.value}</div>
                    <div className="history-time">{item.timestamp}</div>
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

export default ColorPicker;
