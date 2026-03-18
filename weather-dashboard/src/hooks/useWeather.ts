import { useState, useEffect, useCallback } from 'react';

export type TemperatureUnit = 'C' | 'F';

export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  condition: string;
}

export interface ForecastData {
  date: string;
  temperature: number;
  description: string;
  icon: string;
}

const MOCK_WEATHER: WeatherData = {
  city: "San Francisco",
  temperature: 18,
  description: "Partly cloudy",
  humidity: 65,
  windSpeed: 12,
  icon: "03d",
  condition: "Clouds"
};

const MOCK_FORECAST: ForecastData[] = [
  { date: "Mon", temperature: 19, description: "Sunny", icon: "01d" },
  { date: "Tue", temperature: 17, description: "Cloudy", icon: "03d" },
  { date: "Wed", temperature: 16, description: "Rain", icon: "10d" },
  { date: "Thu", temperature: 18, description: "Partly cloudy", icon: "02d" },
  { date: "Fri", temperature: 20, description: "Clear", icon: "01d" },
];

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem('favoriteCities');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoriteCities', JSON.stringify(favorites));
  }, [favorites]);

  const toggleUnit = useCallback(() => {
    setUnit(prev => prev === 'C' ? 'F' : 'C');
  }, []);

  const convertTemp = useCallback((temp: number) => {
    if (unit === 'F') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  }, [unit]);

  const addFavorite = useCallback((city: string) => {
    setFavorites(prev => {
      if (prev.includes(city)) return prev;
      return [...prev, city];
    });
  }, []);

  const removeFavorite = useCallback((city: string) => {
    setFavorites(prev => prev.filter(f => f !== city));
  }, []);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      if (city.toLowerCase() === 'error') {
        setError("City not found. Please try again.");
        setWeather(null);
        setForecast([]);
      } else {
        setWeather({ ...MOCK_WEATHER, city });
        setForecast(MOCK_FORECAST);
      }
      setLoading(false);
    }, 1000);
  };

  return {
    weather,
    forecast,
    loading,
    error,
    unit,
    favorites,
    fetchWeather,
    toggleUnit,
    convertTemp,
    addFavorite,
    removeFavorite,
  };
}
