import React, { useState, useEffect } from 'react';
import './WorldClock.css';

const WorldClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimezones, setSelectedTimezones] = useState([
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney'
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTimezone, setShowAddTimezone] = useState(false);

  const timezones = [
    // Americas
    { name: 'New York', timezone: 'America/New_York', country: 'USA', flag: '🇺🇸' },
    { name: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'USA', flag: '🇺🇸' },
    { name: 'Chicago', timezone: 'America/Chicago', country: 'USA', flag: '🇺🇸' },
    { name: 'Toronto', timezone: 'America/Toronto', country: 'Canada', flag: '🇨🇦' },
    { name: 'Mexico City', timezone: 'America/Mexico_City', country: 'Mexico', flag: '🇲🇽' },
    { name: 'São Paulo', timezone: 'America/Sao_Paulo', country: 'Brazil', flag: '🇧🇷' },
    { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', country: 'Argentina', flag: '🇦🇷' },
    
    // Europe
    { name: 'London', timezone: 'Europe/London', country: 'UK', flag: '🇬🇧' },
    { name: 'Paris', timezone: 'Europe/Paris', country: 'France', flag: '🇫🇷' },
    { name: 'Berlin', timezone: 'Europe/Berlin', country: 'Germany', flag: '🇩🇪' },
    { name: 'Rome', timezone: 'Europe/Rome', country: 'Italy', flag: '🇮🇹' },
    { name: 'Madrid', timezone: 'Europe/Madrid', country: 'Spain', flag: '🇪🇸' },
    { name: 'Amsterdam', timezone: 'Europe/Amsterdam', country: 'Netherlands', flag: '🇳🇱' },
    { name: 'Moscow', timezone: 'Europe/Moscow', country: 'Russia', flag: '🇷🇺' },
    
    // Asia
    { name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan', flag: '🇯🇵' },
    { name: 'Shanghai', timezone: 'Asia/Shanghai', country: 'China', flag: '🇨🇳' },
    { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', country: 'Hong Kong', flag: '🇭🇰' },
    { name: 'Singapore', timezone: 'Asia/Singapore', country: 'Singapore', flag: '🇸🇬' },
    { name: 'Seoul', timezone: 'Asia/Seoul', country: 'South Korea', flag: '🇰🇷' },
    { name: 'Mumbai', timezone: 'Asia/Kolkata', country: 'India', flag: '🇮🇳' },
    { name: 'Dubai', timezone: 'Asia/Dubai', country: 'UAE', flag: '🇦🇪' },
    
    // Oceania
    { name: 'Sydney', timezone: 'Australia/Sydney', country: 'Australia', flag: '🇦🇺' },
    { name: 'Melbourne', timezone: 'Australia/Melbourne', country: 'Australia', flag: '🇦🇺' },
    { name: 'Auckland', timezone: 'Pacific/Auckland', country: 'New Zealand', flag: '🇳🇿' },
    
    // Africa
    { name: 'Cairo', timezone: 'Africa/Cairo', country: 'Egypt', flag: '🇪🇬' },
    { name: 'Lagos', timezone: 'Africa/Lagos', country: 'Nigeria', flag: '🇳🇬' },
    { name: 'Cape Town', timezone: 'Africa/Johannesburg', country: 'South Africa', flag: '🇿🇦' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeInTimezone = (timezone) => {
    return new Date().toLocaleString('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getDateInTimezone = (timezone) => {
    return new Date().toLocaleDateString('en-US', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimezoneOffset = (timezone) => {
    const now = new Date();
    const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    const targetTime = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
    const localTime = new Date(utc.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
    
    const offsetMs = targetTime.getTime() - localTime.getTime();
    const offsetHours = offsetMs / (1000 * 60 * 60);
    
    const sign = offsetHours >= 0 ? '+' : '';
    return `UTC${sign}${offsetHours.toFixed(1)}`;
  };

  const getTimeDifference = (timezone) => {
    try {
      const now = new Date();
      const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Get current time in both timezones
      const localTime = new Date(now.toLocaleString('en-US', { timeZone: localTz }));
      const targetTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));

      const diffMs = targetTime.getTime() - localTime.getTime();
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));

      if (diffHours === 0) return 'Same time';
      if (diffHours > 0) return `+${diffHours}h ahead`;
      return `${Math.abs(diffHours)}h behind`;
    } catch (error) {
      return 'Unknown';
    }
  };

  const isDaytime = (timezone) => {
    const hour = parseInt(getTimeInTimezone(timezone).split(':')[0]);
    return hour >= 6 && hour < 18;
  };

  const addTimezone = (timezone) => {
    if (!selectedTimezones.includes(timezone)) {
      setSelectedTimezones([...selectedTimezones, timezone]);
    }
    setShowAddTimezone(false);
    setSearchTerm('');
  };

  const removeTimezone = (timezone) => {
    setSelectedTimezones(selectedTimezones.filter(tz => tz !== timezone));
  };

  const filteredTimezones = timezones.filter(tz =>
    tz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tz.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTimezoneInfo = (timezone) => {
    return timezones.find(tz => tz.timezone === timezone) || {
      name: timezone.split('/').pop().replace('_', ' '),
      timezone,
      country: 'Unknown',
      flag: '🌍'
    };
  };

  return (
    <div className="world-clock">
      {/* Header */}
      <div className="clock-header">
        <div className="header-left">
          <h2>🌍 World Clock</h2>
          <span className="timezone-count">{selectedTimezones.length} timezones</span>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => setShowAddTimezone(!showAddTimezone)} 
            className="add-timezone-btn"
          >
            ➕ Add Timezone
          </button>
        </div>
      </div>

      <div className="clock-content">
        {/* Add Timezone Panel */}
        {showAddTimezone && (
          <div className="add-timezone-panel">
            <div className="search-section">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cities or countries..."
                className="timezone-search"
              />
            </div>
            <div className="timezone-list">
              {filteredTimezones.map((tz) => (
                <div
                  key={tz.timezone}
                  onClick={() => addTimezone(tz.timezone)}
                  className={`timezone-option ${selectedTimezones.includes(tz.timezone) ? 'selected' : ''}`}
                >
                  <span className="timezone-flag">{tz.flag}</span>
                  <div className="timezone-info">
                    <div className="timezone-name">{tz.name}</div>
                    <div className="timezone-country">{tz.country}</div>
                  </div>
                  <div className="timezone-time">
                    {getTimeInTimezone(tz.timezone)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Local Time */}
        <div className="local-time-section">
          <h4>Your Local Time</h4>
          <div className="local-time-card">
            <div className="time-display">
              <div className="current-time">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <div className="current-date">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div className="timezone-details">
              <div className="timezone-name">
                {Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop().replace('_', ' ')}
              </div>
              <div className="timezone-offset">
                {getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone)}
              </div>
            </div>
          </div>
        </div>

        {/* World Clocks */}
        <div className="world-clocks-section">
          <h4>World Clocks</h4>
          <div className="clocks-grid">
            {selectedTimezones.map((timezone) => {
              const tzInfo = getTimezoneInfo(timezone);
              const isDay = isDaytime(timezone);
              
              return (
                <div key={timezone} className={`clock-card ${isDay ? 'daytime' : 'nighttime'}`}>
                  <button
                    onClick={() => removeTimezone(timezone)}
                    className="remove-btn"
                    title="Remove timezone"
                  >
                    ✕
                  </button>
                  
                  <div className="clock-header-info">
                    <span className="clock-flag">{tzInfo.flag}</span>
                    <div className="clock-location">
                      <div className="city-name">{tzInfo.name}</div>
                      <div className="country-name">{tzInfo.country}</div>
                    </div>
                    <div className="day-night-indicator">
                      {isDay ? '☀️' : '🌙'}
                    </div>
                  </div>

                  <div className="clock-time">
                    <div className="time-large">
                      {getTimeInTimezone(timezone)}
                    </div>
                    <div className="date-small">
                      {getDateInTimezone(timezone)}
                    </div>
                  </div>

                  <div className="clock-details">
                    <div className="timezone-offset">
                      {getTimezoneOffset(timezone)}
                    </div>
                    <div className="time-difference">
                      {getTimeDifference(timezone)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Add Popular Timezones */}
        <div className="quick-add-section">
          <h4>Quick Add Popular Timezones</h4>
          <div className="quick-add-buttons">
            {timezones.slice(0, 8).map((tz) => (
              <button
                key={tz.timezone}
                onClick={() => addTimezone(tz.timezone)}
                className={`quick-add-btn ${selectedTimezones.includes(tz.timezone) ? 'added' : ''}`}
                disabled={selectedTimezones.includes(tz.timezone)}
              >
                <span className="quick-flag">{tz.flag}</span>
                <span className="quick-name">{tz.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Zone Converter */}
        <div className="converter-section">
          <h4>Time Zone Converter</h4>
          <div className="converter-info">
            <p>Compare times across your selected timezones at a glance. Perfect for scheduling meetings and calls across different time zones.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldClock;
