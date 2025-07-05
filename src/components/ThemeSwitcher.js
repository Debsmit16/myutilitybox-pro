import React, { useState } from 'react';
import './ThemeSwitcher.css';

const ThemeSwitcher = ({ theme, setTheme, accentColor, setAccentColor }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const themes = [
    { id: 'light', name: 'Light', icon: '☀️' },
    { id: 'dark', name: 'Dark', icon: '🌙' },
    { id: 'sepia', name: 'Sepia', icon: '📜' }
  ];

  const presetColors = [
    '#007bff', '#28a745', '#dc3545', '#ffc107', 
    '#17a2b8', '#6f42c1', '#e83e8c', '#fd7e14'
  ];

  return (
    <div className="theme-switcher">
      <div className="theme-buttons">
        {themes.map(themeOption => (
          <button
            key={themeOption.id}
            className={`theme-btn ${theme === themeOption.id ? 'active' : ''}`}
            onClick={() => setTheme(themeOption.id)}
            title={themeOption.name}
          >
            {themeOption.icon}
          </button>
        ))}
      </div>
      
      <div className="color-picker-container">
        <button
          className="color-picker-btn"
          onClick={() => setShowColorPicker(!showColorPicker)}
          style={{ backgroundColor: accentColor }}
          title="Choose accent color"
        >
          🎨
        </button>
        
        {showColorPicker && (
          <div className="color-picker-dropdown">
            <div className="color-presets">
              {presetColors.map(color => (
                <button
                  key={color}
                  className={`color-preset ${accentColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setAccentColor(color);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
            <div className="custom-color">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="color-input"
              />
              <span>Custom</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
