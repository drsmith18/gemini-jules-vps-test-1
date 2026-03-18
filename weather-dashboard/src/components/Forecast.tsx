import React from 'react';
import { ForecastData, TemperatureUnit } from '../hooks/useWeather';
import { ForecastCard } from './ForecastCard';

interface ForecastProps {
  forecast: ForecastData[];
  unit: TemperatureUnit;
  convertTemp: (temp: number) => number;
}

export const Forecast: React.FC<ForecastProps> = ({ forecast, unit, convertTemp }) => {
  return (
    <section className="forecast-section">
      <h3>5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((day, index) => (
          <ForecastCard 
            key={index} 
            data={day} 
            unit={unit}
            convertedTemp={convertTemp(day.temperature)}
          />
        ))}
      </div>
    </section>
  );
};
