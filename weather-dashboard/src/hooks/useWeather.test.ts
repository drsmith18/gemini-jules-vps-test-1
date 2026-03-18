import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useWeather } from './useWeather';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useWeather hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useWeather());
    expect(result.current.unit).toBe('C');
    expect(result.current.favorites).toEqual([]);
    expect(result.current.weather).toBeNull();
  });

  it('should toggle temperature unit', () => {
    const { result } = renderHook(() => useWeather());
    act(() => {
      result.current.toggleUnit();
    });
    expect(result.current.unit).toBe('F');
    act(() => {
      result.current.toggleUnit();
    });
    expect(result.current.unit).toBe('C');
  });

  it('should convert temperature correctly', () => {
    const { result } = renderHook(() => useWeather());
    
    // Celsius (default)
    expect(result.current.convertTemp(20)).toBe(20);
    
    // Switch to Fahrenheit
    act(() => {
      result.current.toggleUnit();
    });
    // (20 * 9/5) + 32 = 68
    expect(result.current.convertTemp(20)).toBe(68);
  });

  it('should manage favorite cities', () => {
    const { result } = renderHook(() => useWeather());
    
    act(() => {
      result.current.addFavorite('London');
    });
    expect(result.current.favorites).toContain('London');
    
    act(() => {
      result.current.addFavorite('Paris');
    });
    expect(result.current.favorites).toEqual(['London', 'Paris']);
    
    act(() => {
      result.current.removeFavorite('London');
    });
    expect(result.current.favorites).toEqual(['Paris']);
  });

  it('should persist favorites in localStorage', () => {
    const { result } = renderHook(() => useWeather());
    
    act(() => {
      result.current.addFavorite('New York');
    });
    
    const stored = JSON.parse(localStorage.getItem('favoriteCities') || '[]');
    expect(stored).toContain('New York');
  });

  it('should fetch weather data successfully', async () => {
    const { result } = renderHook(() => useWeather());
    
    act(() => {
      result.current.fetchWeather('Tokyo');
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.weather?.city).toBe('Tokyo');
    expect(result.current.forecast.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch weather error', async () => {
    const { result } = renderHook(() => useWeather());
    
    act(() => {
      result.current.fetchWeather('error');
    });
    
    expect(result.current.loading).toBe(true);
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.weather).toBeNull();
    expect(result.current.forecast).toEqual([]);
    expect(result.current.error).toBe('City not found. Please try again.');
  });

  it('should add successful searches to searchHistory', async () => {
    const { result } = renderHook(() => useWeather());
    
    act(() => {
      result.current.fetchWeather('London');
    });
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.searchHistory).toEqual(['London']);
  });

  it('should prevent duplicate entries and move existing to front', async () => {
    const { result } = renderHook(() => useWeather());
    
    act(() => { result.current.fetchWeather('London'); });
    await act(async () => { vi.advanceTimersByTime(1000); });
    
    act(() => { result.current.fetchWeather('Paris'); });
    await act(async () => { vi.advanceTimersByTime(1000); });
    
    // Test case-insensitive duplicate prevention
    act(() => { result.current.fetchWeather('london'); });
    await act(async () => { vi.advanceTimersByTime(1000); });

    expect(result.current.searchHistory).toEqual(['london', 'Paris']);
  });

  it('should limit searchHistory to 5 entries', async () => {
    const { result } = renderHook(() => useWeather());
    
    const cities = ['City1', 'City2', 'City3', 'City4', 'City5', 'City6'];
    
    for (const city of cities) {
      act(() => { result.current.fetchWeather(city); });
      await act(async () => { vi.advanceTimersByTime(1000); });
    }

    expect(result.current.searchHistory).toEqual([
      'City6', 'City5', 'City4', 'City3', 'City2'
    ]);
  });

  it('should clear searchHistory', async () => {
    const { result } = renderHook(() => useWeather());
    
    act(() => { result.current.fetchWeather('London'); });
    await act(async () => { vi.advanceTimersByTime(1000); });
    
    expect(result.current.searchHistory.length).toBe(1);
    
    act(() => {
      result.current.clearHistory();
    });
    
    expect(result.current.searchHistory).toEqual([]);
  });

  it('should persist searchHistory in localStorage', async () => {
    const { result } = renderHook(() => useWeather());
    
    act(() => { result.current.fetchWeather('Berlin'); });
    await act(async () => { vi.advanceTimersByTime(1000); });
    
    const stored = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    expect(stored).toContain('Berlin');
  });

  it('should ignore empty string searches in searchHistory', async () => {
    const { result } = renderHook(() => useWeather());
    
    act(() => { result.current.fetchWeather('   '); });
    await act(async () => { vi.advanceTimersByTime(1000); });
    
    expect(result.current.searchHistory).toEqual([]);
  });
});
