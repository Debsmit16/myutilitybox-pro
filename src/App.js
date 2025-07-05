import React, { useState, useEffect } from 'react';
import './App.css';
import TodoList from './components/TodoList';
import NotePad from './components/NotePad';
import Calculator from './components/Calculator';
import Clock from './components/Clock';
import ThemeSwitcher from './components/ThemeSwitcher';
import WeatherWidget from './components/WeatherWidget';
import PomodoroTimer from './components/PomodoroTimer';

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

  const tabs = [
    { id: 'todo', name: 'To-Do List', icon: '✓' },
    { id: 'notes', name: 'Notes', icon: '📝' },
    { id: 'calculator', name: 'Calculator', icon: '🔢' },
    { id: 'weather', name: 'Weather', icon: '🌤️' },
    { id: 'pomodoro', name: 'Pomodoro', icon: '⏰' }
  ];

  const renderActiveComponent = () => {
    try {
      console.log('Rendering tab:', activeTab);
      switch (activeTab) {
        case 'todo':
          return <TodoList />;
        case 'notes':
          return <div style={{padding: '20px'}}><h2>📝 NotePad</h2><p>Note-taking functionality coming soon...</p></div>;
        case 'calculator':
          return <div style={{padding: '20px'}}><h2>🔢 Calculator</h2><p>Calculator functionality coming soon...</p></div>;
        case 'weather':
          return <div style={{padding: '20px'}}><h2>🌤️ Weather</h2><p>Weather widget coming soon...</p></div>;
        case 'pomodoro':
          return <div style={{padding: '20px'}}><h2>⏰ Pomodoro Timer</h2><p>Pomodoro timer coming soon...</p></div>;
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
          <nav className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-name">{tab.name}</span>
              </button>
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
