import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

// Import all the existing utility components
import TodoList from './TodoList';
import NotePad from './NotePad';
import Calculator from './Calculator';
import Clock from './Clock';
import ThemeSwitcher from './ThemeSwitcher';
import WeatherWidget from './WeatherWidget';
import PomodoroTimer from './PomodoroTimer';
import UnitConverter from './UnitConverter';
import PasswordGenerator from './PasswordGenerator';
import ColorPicker from './ColorPicker';
import TextTools from './TextTools';
import TipCalculator from './TipCalculator';
import BMICalculator from './BMICalculator';
import QRCodeGenerator from './QRCodeGenerator';
import WorldClock from './WorldClock';
import LinkShortener from './LinkShortener';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('todo');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('accentColor') || '#007bff';
  });
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    document.body.className = theme;
    document.documentElement.style.setProperty('--accent-color', accentColor);
    localStorage.setItem('theme', theme);
    localStorage.setItem('accentColor', accentColor);
  }, [theme, accentColor]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

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
      return (
        <div className="error-container">
          <h3>Something went wrong</h3>
          <p>Please try refreshing the page or selecting a different tool.</p>
        </div>
      );
    }
  };

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">
            <span className="title-icon">🚀</span>
            MyUtilityBox Pro
          </h1>
          <Clock />
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-greeting">
              Welcome, {currentUser?.displayName || currentUser?.email}!
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
          <ThemeSwitcher 
            theme={theme} 
            setTheme={setTheme}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
          />
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar Navigation */}
        <nav className="dashboard-sidebar">
          <div className="nav-categories">
            {toolCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="nav-category">
                <h3 className="category-title">{category.name}</h3>
                <div className="category-tools">
                  {category.tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTab(tool.id)}
                      className={`nav-tool ${activeTab === tool.id ? 'active' : ''}`}
                    >
                      <span className="tool-icon">{tool.icon}</span>
                      <span className="tool-name">{tool.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="dashboard-main">
          <div className="tool-container">
            {renderActiveComponent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
