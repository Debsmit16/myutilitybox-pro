import React, { useState } from 'react';
import './WeatherWidget.css';

const WeatherWidget = () => {
  const [city, setCity] = useState('New York');
  const [weather, setWeather] = useState({
    temperature: 22,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 8
  });

  const searchWeather = () => {
    // Simulate weather data
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Windy'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomTemp = Math.floor(Math.random() * 30) + 5;
    
    setWeather({
      temperature: randomTemp,
      condition: randomCondition,
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 15) + 5
    });
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Sunny': return '☀️';
      case 'Cloudy': return '☁️';
      case 'Rainy': return '🌧️';
      case 'Snowy': return '❄️';
      case 'Windy': return '💨';
      default: return '🌤️';
    }
  };

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <h2>🌤️ Weather</h2>
      </div>
      
      <div className="weather-search">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="city-input"
        />
        <button onClick={searchWeather} className="search-btn">
          Search
        </button>
      </div>
      
      <div className="weather-display">
        <div className="weather-main">
          <div className="weather-icon">
            {getWeatherIcon(weather.condition)}
          </div>
          <div className="weather-temp">
            {weather.temperature}°C
          </div>
          <div className="weather-condition">
            {weather.condition}
          </div>
          <div className="weather-city">
            {city}
          </div>
        </div>
        
        <div className="weather-details">
          <div className="detail-item">
            <span>💧 Humidity</span>
            <span>{weather.humidity}%</span>
          </div>
          <div className="detail-item">
            <span>💨 Wind Speed</span>
            <span>{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
