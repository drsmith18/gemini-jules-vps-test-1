import React from 'react';
import type { ForecastData, TemperatureUnit } from '../hooks/useWeather';

interface ForecastCardProps {
  data: ForecastData;
  unit: TemperatureUnit;
  convertedTemp: number;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ data, unit, convertedTemp }) => {
  return (
    <div className="forecast-card">
      <span className="forecast-date">{data.date}</span>
      <img 
        src={`https://openweathermap.org/img/wn/${data.icon}.png`} 
        alt={data.description} 
      />
      <span className="forecast-temp">{convertedTemp}°{unit}</span>
      <span className="forecast-desc">{data.description}</span>
    </div>
  );
};
