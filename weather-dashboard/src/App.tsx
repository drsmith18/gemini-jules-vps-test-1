import { SearchBar } from './components/SearchBar'
import { CurrentWeather } from './components/CurrentWeather'
import { Forecast } from './components/Forecast'
import { Favorites } from './components/Favorites'
import { SearchHistory } from './components/SearchHistory'
import { useWeather } from './hooks/useWeather'
import { useTheme } from './hooks/useTheme'
import { Sun, Moon } from 'lucide-react'
import './styles/App.css'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { 
    weather, 
    forecast, 
    loading, 
    error, 
    unit,
    favorites,
    searchHistory,
    fetchWeather, 
    toggleUnit,
    convertTemp,
    addFavorite,
    removeFavorite,
    clearHistory,
  } = useWeather()

  const handleSearch = (city: string) => {
    fetchWeather(city)
  }

  const handleToggleFavorite = (city: string) => {
    if (favorites.includes(city)) {
      removeFavorite(city);
    } else {
      addFavorite(city);
    }
  };

  return (
    <div className={`app-container theme-${theme} ${weather?.condition?.toLowerCase() || 'default'}`}>
      <main className="dashboard">
        <header className="header">
          <div className="header-top">
            <h1>Weather Dashboard</h1>
            <div className="header-actions">
              <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button className="unit-toggle" onClick={toggleUnit} title="Toggle Temperature Unit">
                Switch to °{unit === 'C' ? 'F' : 'C'}
              </button>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          <SearchHistory 
            history={searchHistory} 
            onSelect={fetchWeather} 
            onClear={clearHistory} 
          />
        </header>

        <div className="layout-main">
          <Favorites 
            favorites={favorites} 
            onSelect={fetchWeather} 
            onRemove={removeFavorite} 
          />
          
          <div className="content-area">
            {loading && <div className="status">Loading weather data...</div>}
            {error && <div className="status error">{error}</div>}

            {!loading && !error && !weather && (
              <div className="status welcome">
                <h2>Welcome!</h2>
                <p>Search for a city to see the current weather and 5-day forecast.</p>
              </div>
            )}

            {weather && !loading && !error && (
              <div className="weather-content">
                <CurrentWeather 
                  weather={weather} 
                  unit={unit}
                  convertedTemp={convertTemp(weather.temperature)}
                  isFavorite={favorites.includes(weather.city)}
                  onToggleFavorite={handleToggleFavorite}
                />
                <Forecast 
                  forecast={forecast} 
                  unit={unit}
                  convertTemp={convertTemp}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
