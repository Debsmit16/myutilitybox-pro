import React, { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycle, setCycle] = useState(1);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [settings, setSettings] = useState({
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    cyclesUntilLongBreak: 4
  });
  const [showSettings, setShowSettings] = useState(false);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    playNotificationSound();
    
    if (!isBreak) {
      // Work session completed
      setCompletedCycles(prev => prev + 1);
      const newCompletedCycles = completedCycles + 1;
      
      if (newCompletedCycles % settings.cyclesUntilLongBreak === 0) {
        // Time for long break
        setTimeLeft(settings.longBreak * 60);
        setIsBreak(true);
        showNotification('Work session complete! Time for a long break.');
      } else {
        // Time for short break
        setTimeLeft(settings.shortBreak * 60);
        setIsBreak(true);
        showNotification('Work session complete! Time for a short break.');
      }
    } else {
      // Break completed
      setTimeLeft(settings.workTime * 60);
      setIsBreak(false);
      setCycle(prev => prev + 1);
      showNotification('Break time over! Ready for another work session?');
    }
  };

  const playNotificationSound = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const showNotification = (message) => {
    if (Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: message,
        icon: '⏰'
      });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const startTimer = () => {
    setIsActive(true);
    requestNotificationPermission();
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(settings.workTime * 60);
    setCycle(1);
  };

  const skipSession = () => {
    setTimeLeft(0);
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    if (!isActive) {
      setTimeLeft(newSettings.workTime * 60);
      setIsBreak(false);
    }
    setShowSettings(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = isBreak 
      ? (completedCycles % settings.cyclesUntilLongBreak === 0 ? settings.longBreak : settings.shortBreak) * 60
      : settings.workTime * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getCurrentSessionType = () => {
    if (isBreak) {
      return completedCycles % settings.cyclesUntilLongBreak === 0 ? 'Long Break' : 'Short Break';
    }
    return 'Work Session';
  };

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-header">
        <h2>⏰ Pomodoro Timer</h2>
        <button 
          onClick={() => setShowSettings(!showSettings)} 
          className="settings-btn"
          title="Settings"
        >
          ⚙️
        </button>
      </div>

      {showSettings && (
        <div className="settings-modal">
          <div className="settings-content">
            <h3>Timer Settings</h3>
            <div className="settings-form">
              <div className="setting-item">
                <label>Work Time (minutes):</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.workTime}
                  onChange={(e) => setSettings({...settings, workTime: parseInt(e.target.value)})}
                />
              </div>
              <div className="setting-item">
                <label>Short Break (minutes):</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreak}
                  onChange={(e) => setSettings({...settings, shortBreak: parseInt(e.target.value)})}
                />
              </div>
              <div className="setting-item">
                <label>Long Break (minutes):</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreak}
                  onChange={(e) => setSettings({...settings, longBreak: parseInt(e.target.value)})}
                />
              </div>
              <div className="setting-item">
                <label>Cycles until Long Break:</label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={settings.cyclesUntilLongBreak}
                  onChange={(e) => setSettings({...settings, cyclesUntilLongBreak: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="settings-actions">
              <button onClick={() => updateSettings(settings)} className="save-settings-btn">
                Save Settings
              </button>
              <button onClick={() => setShowSettings(false)} className="cancel-settings-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pomodoro-content">
        <div className="timer-display">
          <div className="session-info">
            <div className="session-type">{getCurrentSessionType()}</div>
            <div className="cycle-info">Cycle {cycle} • Completed: {completedCycles}</div>
          </div>
          
          <div className="timer-circle">
            <svg className="progress-ring" width="200" height="200">
              <circle
                className="progress-ring-background"
                stroke="var(--border-color)"
                strokeWidth="8"
                fill="transparent"
                r="90"
                cx="100"
                cy="100"
              />
              <circle
                className="progress-ring-progress"
                stroke="var(--accent-color)"
                strokeWidth="8"
                fill="transparent"
                r="90"
                cx="100"
                cy="100"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgress() / 100)}`}
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className="timer-text">
              <div className="time-display">{formatTime(timeLeft)}</div>
              <div className="time-label">
                {isBreak ? '☕ Break' : '💼 Work'}
              </div>
            </div>
          </div>

          <div className="timer-controls">
            {!isActive ? (
              <button onClick={startTimer} className="control-btn start-btn">
                ▶️ Start
              </button>
            ) : (
              <button onClick={pauseTimer} className="control-btn pause-btn">
                ⏸️ Pause
              </button>
            )}
            <button onClick={resetTimer} className="control-btn reset-btn">
              🔄 Reset
            </button>
            <button onClick={skipSession} className="control-btn skip-btn">
              ⏭️ Skip
            </button>
          </div>
        </div>

        <div className="pomodoro-stats">
          <h3>📊 Session Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{completedCycles}</div>
              <div className="stat-label">Completed Cycles</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{cycle}</div>
              <div className="stat-label">Current Cycle</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{Math.floor(completedCycles * settings.workTime / 60)}h {(completedCycles * settings.workTime) % 60}m</div>
              <div className="stat-label">Total Focus Time</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{Math.floor(completedCycles / settings.cyclesUntilLongBreak)}</div>
              <div className="stat-label">Long Breaks Earned</div>
            </div>
          </div>
        </div>

        <div className="pomodoro-tips">
          <h4>💡 Pomodoro Tips</h4>
          <ul>
            <li>🎯 Focus on one task during each work session</li>
            <li>📱 Turn off notifications and distractions</li>
            <li>☕ Use breaks to rest your eyes and stretch</li>
            <li>📝 Keep a notepad for thoughts that pop up</li>
            <li>🏆 Celebrate completed cycles!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
