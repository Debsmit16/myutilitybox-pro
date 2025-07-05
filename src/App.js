import React, { useState, useEffect } from 'react';
import './App.css';
import TodoList from './components/TodoList';
import NotePad from './components/NotePad';
import Calculator from './components/Calculator';
import Clock from './components/Clock';
import ThemeSwitcher from './components/ThemeSwitcher';
import WeatherWidget from './components/WeatherWidget';
import PomodoroTimer from './components/PomodoroTimer';
import UnitConverter from './components/UnitConverter';
import PasswordGenerator from './components/PasswordGenerator';
import ColorPicker from './components/ColorPicker';
import TextTools from './components/TextTools';
import TipCalculator from './components/TipCalculator';
import BMICalculator from './components/BMICalculator';
import QRCodeGenerator from './components/QRCodeGenerator';
import WorldClock from './components/WorldClock';
import LinkShortener from './components/LinkShortener';

function App() {
  const [activeTab, setActiveTab] = useState('todo');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('accentColor') || '#007bff';
  });

  useEffect(() => {
    document.body.className = theme;
    document.documentElement.style.setProperty('--accent-color', accentColor);
    localStorage.setItem('theme', theme);
    localStorage.setItem('accentColor', accentColor);
  }, [theme, accentColor]);

  const toolCategories = [
    {
      name: '📋 Productivity',
      tools: [
        { id: 'todo', name: 'To-Do List', icon: '✓' },
        { id: 'notes', name: 'Notes', icon: '📝' },
        { id: 'pomodoro', name: 'Pomodoro', icon: '⏰' },
        { id: 'worldclock', name: 'World Clock', icon: '🌍' }
      ]
    },
    {
      name: '🔧 Tools & Utilities',
      tools: [
        { id: 'calculator', name: 'Calculator', icon: '🔢' },
        { id: 'converter', name: 'Unit Converter', icon: '📏' },
        { id: 'password', name: 'Password Gen', icon: '🔐' },
        { id: 'qrcode', name: 'QR Generator', icon: '📱' },
        { id: 'linkshortener', name: 'Link Shortener', icon: '🔗' }
      ]
    },
    {
      name: '🎨 Design & Text',
      tools: [
        { id: 'colors', name: 'Color Picker', icon: '🎨' },
        { id: 'text', name: 'Text Tools', icon: '📝' }
      ]
    },
    {
      name: '💰 Finance & Health',
      tools: [
        { id: 'tip', name: 'Tip Calculator', icon: '💳' },
        { id: 'bmi', name: 'BMI Calculator', icon: '🏃‍♂️' }
      ]
    },
    {
      name: '🌤️ Information',
      tools: [
        { id: 'weather', name: 'Weather', icon: '🌤️' }
      ]
    }
  ];

  const renderActiveComponent = () => {
    try {
      console.log('Rendering tab:', activeTab);
      switch (activeTab) {
        case 'todo':
          return <TodoList />;
        case 'notes':
          return <NotePad />;
        case 'calculator':
          return <Calculator />;
        case 'weather':
          return <WeatherWidget />;
        case 'pomodoro':
          return <PomodoroTimer />;
        case 'converter':
          return <UnitConverter />;
        case 'password':
          return <PasswordGenerator />;
        case 'colors':
          return <ColorPicker />;
        case 'text':
          return <TextTools />;
        case 'tip':
          return <TipCalculator />;
        case 'bmi':
          return <BMICalculator />;
        case 'qrcode':
          return <QRCodeGenerator />;
        case 'worldclock':
          return <WorldClock />;
        case 'linkshortener':
          return <LinkShortener />;
        default:
          return <TodoList />;
      }
    } catch (error) {
      console.error('Error rendering component:', error);
      return <div>Error loading component. Please try again.</div>;
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">🚀 MyUtilityBox Pro</h1>
        </div>
        <div className="header-center">
          <Clock />
        </div>
        <div className="header-right">
          <ThemeSwitcher
            theme={theme}
            setTheme={setTheme}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="app-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="nav-categories">
            {toolCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="nav-category">
                <div className="category-header">
                  <h3 className="category-title">{category.name}</h3>
                </div>
                <div className="category-tools">
                  {category.tools.map(tool => (
                    <button
                      key={tool.id}
                      className={`nav-tab ${activeTab === tool.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tool.id)}
                    >
                      <span className="tab-icon">{tool.icon}</span>
                      <span className="tab-name">{tool.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="main-panel">
          <div className="component-container">
            {renderActiveComponent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
