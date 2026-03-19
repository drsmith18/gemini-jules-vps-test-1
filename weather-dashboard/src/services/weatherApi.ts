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

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const handleApiError = (error: unknown): Error => {
  if (error instanceof ApiError && error.status) {
    switch (error.status) {
      case 404:
        return new Error("City not found. Please check the spelling and try again.");
      case 401:
        return new Error("Unauthorized. Please check your API key.");
      case 500:
        return new Error("Server error. Please try again later.");
      default:
        return new Error(`API Error: ${error.status}`);
    }
  }
  
  if (error instanceof Error && error.message.toLowerCase().includes('network')) {
    return new Error("Network error. Please check your internet connection.");
  }

  if (error instanceof Error) {
    return new Error(error.message || "An unexpected error occurred. Please try again.");
  }

  return new Error("An unexpected error occurred. Please try again.");
};

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
        const lowerCity = city.toLowerCase();
        try {
          if (lowerCity === 'error-404' || lowerCity === 'error') {
            throw new ApiError("Not Found", 404);
          } else if (lowerCity === 'error-401') {
            throw new ApiError("Unauthorized", 401);
          } else if (lowerCity === 'error-500') {
            throw new ApiError("Internal Server Error", 500);
          } else if (lowerCity === 'error-network') {
            throw new Error("Network connection lost");
          } else if (lowerCity === 'error-unknown') {
            throw new Error();
          } else {
            resolve({ ...MOCK_WEATHER, city });
          }
        } catch (error) {
          reject(handleApiError(error));
        }
      }, 1000);
    });
  },

  async fetchForecast(city: string): Promise<ForecastData[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const lowerCity = city.toLowerCase();
        try {
          if (lowerCity.startsWith('error')) {
            if (lowerCity === 'error-404' || lowerCity === 'error') {
              throw new ApiError("Not Found", 404);
            } else if (lowerCity === 'error-401') {
              throw new ApiError("Unauthorized", 401);
            } else if (lowerCity === 'error-500') {
              throw new ApiError("Internal Server Error", 500);
            } else if (lowerCity === 'error-network') {
              throw new Error("Network connection lost");
            } else if (lowerCity === 'error-unknown') {
              throw new Error();
            }
          }
          resolve(MOCK_FORECAST);
        } catch (error) {
          reject(handleApiError(error));
        }
      }, 1000);
    });
  }
};
