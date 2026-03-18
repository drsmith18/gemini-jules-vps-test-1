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

export const weatherApiService = {
  async fetchWeather(city: string): Promise<WeatherData> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (city.toLowerCase() === 'error') {
          reject(new Error("City not found. Please try again."));
        } else {
          resolve({ ...MOCK_WEATHER, city });
        }
      }, 1000);
    });
  },

  async fetchForecast(_city: string): Promise<ForecastData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_FORECAST);
      }, 1000);
    });
  }
};
