import React, { useState, useEffect } from 'react';
import './WeatherWidget.css';

const WeatherWidget = () => {
  const [city, setCity] = useState(() => {
    return localStorage.getItem('weatherCity') || 'New York';
  });
  const [weatherData, setWeatherData] = useState(null);
  const [inputCity, setInputCity] = useState('');
  const [loading, setLoading] = useState(false);

  // Simulated weather data - in a real app, you'd use an API like OpenWeatherMap
  const generateWeatherData = (cityName) => {
    const conditions = [
      { condition: 'Sunny', icon: '☀️', temp: 75 },
      { condition: 'Partly Cloudy', icon: '⛅', temp: 68 },
      { condition: 'Cloudy', icon: '☁️', temp: 62 },
      { condition: 'Rainy', icon: '🌧️', temp: 58 },
      { condition: 'Stormy', icon: '⛈️', temp: 55 },
      { condition: 'Snowy', icon: '❄️', temp: 32 }
    ];

    // Simple hash function to get consistent weather for same city
    let hash = 0;
    for (let i = 0; i < cityName.length; i++) {
      const char = cityName.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    const index = Math.abs(hash) % conditions.length;
    const baseWeather = conditions[index];
    
    // Add some randomness based on current time
    const now = new Date();
    const timeVariation = (now.getHours() + now.getDate()) % 10 - 5;
    
    return {
      city: cityName,
      condition: baseWeather.condition,
      icon: baseWeather.icon,
      temperature: baseWeather.temp + timeVariation,
      humidity: 45 + (Math.abs(hash) % 40),
      windSpeed: 5 + (Math.abs(hash) % 15),
      feelsLike: baseWeather.temp + timeVariation + (Math.abs(hash) % 6 - 3),
      uvIndex: Math.abs(hash) % 11,
      visibility: 8 + (Math.abs(hash) % 7),
      pressure: 29.8 + (Math.abs(hash) % 20) / 10,
      lastUpdated: new Date().toLocaleTimeString()
    };
  };

  useEffect(() => {
    loadWeatherData(city);
  }, []);

  const loadWeatherData = (cityName) => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const data = generateWeatherData(cityName);
      setWeatherData(data);
      setLoading(false);
      localStorage.setItem('weatherCity', cityName);
    }, 1000);
  };

  const handleCitySubmit = (e) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      loadWeatherData(inputCity.trim());
      setInputCity('');
    }
  };

  const refreshWeather = () => {
    loadWeatherData(city);
  };

  const getUVIndexColor = (uvIndex) => {
    if (uvIndex <= 2) return '#28a745'; // Low - Green
    if (uvIndex <= 5) return '#ffc107'; // Moderate - Yellow
    if (uvIndex <= 7) return '#fd7e14'; // High - Orange
    if (uvIndex <= 10) return '#dc3545'; // Very High - Red
    return '#6f42c1'; // Extreme - Purple
  };

  const getUVIndexLabel = (uvIndex) => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h2>🌤️ Weather Widget</h2>
        <div className="weather-disclaimer">
          <span>📍 Simulated weather data for demo purposes</span>
        </div>
      </div>

      <div className="city-input-section">
        <form onSubmit={handleCitySubmit} className="city-form">
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Enter city name..."
            className="city-input"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            🔍 Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner">🌀</div>
          <p>Loading weather data...</p>
        </div>
      ) : weatherData ? (
        <div className="weather-content">
          <div className="weather-main">
            <div className="current-weather">
              <div className="weather-icon">{weatherData.icon}</div>
              <div className="weather-info">
                <h3 className="city-name">{weatherData.city}</h3>
                <div className="temperature">{weatherData.temperature}°F</div>
                <div className="condition">{weatherData.condition}</div>
                <div className="feels-like">Feels like {weatherData.feelsLike}°F</div>
              </div>
              <button onClick={refreshWeather} className="refresh-btn" title="Refresh">
                🔄
              </button>
            </div>
          </div>

          <div className="weather-details">
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-icon">💧</div>
                <div className="detail-info">
                  <div className="detail-label">Humidity</div>
                  <div className="detail-value">{weatherData.humidity}%</div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">💨</div>
                <div className="detail-info">
                  <div className="detail-label">Wind Speed</div>
                  <div className="detail-value">{weatherData.windSpeed} mph</div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">👁️</div>
                <div className="detail-info">
                  <div className="detail-label">Visibility</div>
                  <div className="detail-value">{weatherData.visibility} mi</div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">📊</div>
                <div className="detail-info">
                  <div className="detail-label">Pressure</div>
                  <div className="detail-value">{weatherData.pressure} in</div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">☀️</div>
                <div className="detail-info">
                  <div className="detail-label">UV Index</div>
                  <div 
                    className="detail-value uv-index"
                    style={{ color: getUVIndexColor(weatherData.uvIndex) }}
                  >
                    {weatherData.uvIndex} ({getUVIndexLabel(weatherData.uvIndex)})
                  </div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">🕐</div>
                <div className="detail-info">
                  <div className="detail-label">Last Updated</div>
                  <div className="detail-value">{weatherData.lastUpdated}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="weather-tips">
            <h4>💡 Weather Tips</h4>
            <div className="tips-content">
              {weatherData.condition === 'Sunny' && (
                <p>Perfect day for outdoor activities! Don't forget sunscreen.</p>
              )}
              {weatherData.condition === 'Rainy' && (
                <p>Don't forget your umbrella! Great day for indoor activities.</p>
              )}
              {weatherData.condition === 'Cloudy' && (
                <p>Comfortable weather for a walk or outdoor exercise.</p>
              )}
              {weatherData.condition === 'Snowy' && (
                <p>Bundle up! Drive carefully and stay warm.</p>
              )}
              {weatherData.condition === 'Stormy' && (
                <p>Stay indoors and avoid unnecessary travel.</p>
              )}
              {weatherData.condition === 'Partly Cloudy' && (
                <p>Nice weather with some cloud cover. Perfect for most activities!</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="no-data">
          <p>Enter a city name to get weather information</p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
