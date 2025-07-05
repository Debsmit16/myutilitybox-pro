import React, { useState, useEffect } from 'react';
import './PomodoroTimer.css';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (isBreak) {
        setTimeLeft(25 * 60); // Back to work
        setIsBreak(false);
      } else {
        setTimeLeft(5 * 60); // Break time
        setIsBreak(true);
      }
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setIsBreak(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pomodoro-timer">
      <div className="timer-header">
        <h2>⏰ Pomodoro Timer</h2>
        <p>{isBreak ? 'Break Time!' : 'Focus Time!'}</p>
      </div>
      
      <div className="timer-display">
        <div className="time-circle">
          <div className="time-text">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
      
      <div className="timer-controls">
        <button onClick={toggle} className={`control-btn ${isActive ? 'pause' : 'play'}`}>
          {isActive ? '⏸️ Pause' : '▶️ Start'}
        </button>
        <button onClick={reset} className="control-btn reset">
          🔄 Reset
        </button>
      </div>
      
      <div className="timer-info">
        <div className="session-type">
          <span className={!isBreak ? 'active' : ''}>🍅 Work</span>
          <span className={isBreak ? 'active' : ''}>☕ Break</span>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
