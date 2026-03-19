import { describe, it, expect } from 'vitest';
import { handleApiError, ApiError, weatherApiService } from './weatherApi';

describe('weatherApiService error handling', () => {
  describe('handleApiError', () => {
    it('should handle 404 ApiError', () => {
      const error = new ApiError("Not found", 404);
      const result = handleApiError(error);
      expect(result.message).toBe("City not found. Please check the spelling and try again.");
    });

    it('should handle 401 ApiError', () => {
      const error = new ApiError("Unauthorized", 401);
      const result = handleApiError(error);
      expect(result.message).toBe("Unauthorized. Please check your API key.");
    });

    it('should handle 500 ApiError', () => {
      const error = new ApiError("Server Error", 500);
      const result = handleApiError(error);
      expect(result.message).toBe("Server error. Please try again later.");
    });

    it('should handle unknown ApiError', () => {
      const error = new ApiError("Teapot", 418);
      const result = handleApiError(error);
      expect(result.message).toBe("API Error: 418");
    });

    it('should handle Network Error', () => {
      const error = new Error("A network connection was lost");
      const result = handleApiError(error);
      expect(result.message).toBe("Network error. Please check your internet connection.");
    });

    it('should fallback to standard Error message', () => {
      const error = new Error("Some standard error");
      const result = handleApiError(error);
      expect(result.message).toBe("Some standard error");
    });

    it('should fallback to default error message if error is unknown', () => {
      const result = handleApiError({});
      expect(result.message).toBe("An unexpected error occurred. Please try again.");
    });
  });

  describe('fetchWeather', () => {
    it('should reject with clean message for 404', async () => {
      await expect(weatherApiService.fetchWeather('error-404')).rejects.toThrow('City not found. Please check the spelling and try again.');
      await expect(weatherApiService.fetchWeather('error')).rejects.toThrow('City not found. Please check the spelling and try again.');
    });

    it('should reject with clean message for 401', async () => {
      await expect(weatherApiService.fetchWeather('error-401')).rejects.toThrow('Unauthorized. Please check your API key.');
    });

    it('should reject with clean message for 500', async () => {
      await expect(weatherApiService.fetchWeather('error-500')).rejects.toThrow('Server error. Please try again later.');
    });

    it('should reject with clean message for network error', async () => {
      await expect(weatherApiService.fetchWeather('error-network')).rejects.toThrow('Network error. Please check your internet connection.');
    });

    it('should reject with default error for unknown errors', async () => {
      await expect(weatherApiService.fetchWeather('error-unknown')).rejects.toThrow('An unexpected error occurred. Please try again.');
    });
  });

  describe('fetchForecast', () => {
    it('should reject with clean message for 404', async () => {
      await expect(weatherApiService.fetchForecast('error-404')).rejects.toThrow('City not found. Please check the spelling and try again.');
      await expect(weatherApiService.fetchForecast('error')).rejects.toThrow('City not found. Please check the spelling and try again.');
    });
  });
});
