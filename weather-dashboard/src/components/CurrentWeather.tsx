import React from 'react';
import { Droplets, Wind, Star } from 'lucide-react';
import type { WeatherData, TemperatureUnit } from '../hooks/useWeather';

interface CurrentWeatherProps {
  weather: WeatherData;
  unit: TemperatureUnit;
  convertedTemp: number;
  isFavorite: boolean;
  onToggleFavorite: (city: string) => void;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weather,
  unit,
  convertedTemp,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <section className="current-weather">
      <div className="main-info">
        <div className="city-header">
          <h2 className="city-name">{weather.city}</h2>
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(weather.city)}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star size={24} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="temp-container">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
            alt={weather.description}
            className="weather-icon"
          />
          <span className="temperature">{convertedTemp}°{unit}</span>
        </div>
        <p className="description">{weather.description}</p>
      </div>

      <div className="details-grid">
        <div className="detail-card">
          <Droplets size={24} />
          <span>Humidity</span>
          <strong>{weather.humidity}%</strong>
        </div>
        <div className="detail-card">
          <Wind size={24} />
          <span>Wind Speed</span>
          <strong>{weather.windSpeed} km/h</strong>
        </div>
      </div>
    </section>
  );
};
