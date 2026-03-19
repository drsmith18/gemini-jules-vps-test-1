import { useState, useEffect, useCallback } from 'react';
import { weatherApiService } from '../services/weatherApi';
import type { WeatherData, ForecastData } from '../services/weatherApi';

export type TemperatureUnit = 'C' | 'F';
export type { WeatherData, ForecastData };

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem('favoriteCities');
    return stored ? JSON.parse(stored) : [];
  });
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const stored = localStorage.getItem('searchHistory');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoriteCities', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

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

  const updateHistory = useCallback((city: string) => {
    if (!city.trim()) return;
    const trimmedCity = city.trim();
    setSearchHistory(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== trimmedCity.toLowerCase());
      return [trimmedCity, ...filtered].slice(0, 5);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherApiService.fetchWeather(city),
        weatherApiService.fetchForecast(city)
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
      setLastUpdated(new Date());
      updateHistory(city);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshWeather = useCallback(() => {
    if (weather) {
      fetchWeather(weather.city);
    }
  }, [weather, fetchWeather]);

  return {
    weather,
    forecast,
    loading,
    error,
    unit,
    lastUpdated,
    favorites,
    searchHistory,
    fetchWeather,
    toggleUnit,
    convertTemp,
    addFavorite,
    removeFavorite,
    clearHistory,
    refreshWeather,
  };
}
