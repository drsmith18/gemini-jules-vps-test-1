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
});
