import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { ThemeProvider } from './hooks/useTheme';


// Mock useWeather to avoid complex API setup in this test
vi.mock('./hooks/useWeather', () => ({
  useWeather: () => ({
    weather: null,
    forecast: [],
    loading: false,
    error: null,
    unit: 'C',
    favorites: [],
    searchHistory: [],
    fetchWeather: vi.fn(),
    toggleUnit: vi.fn(),
    convertTemp: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    clearHistory: vi.fn(),
  }),
}));

describe('App Theme Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render with default light theme and switch to dark theme when toggled', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    const container = screen.getByRole('main').parentElement;
    
    // Initially should have theme-light
    expect(container?.className).toContain('theme-light');
    
    // Find the theme toggle button (it's the one with title "Switch to dark mode")
    const toggleButton = screen.getByTitle('Switch to dark mode');
    expect(toggleButton).toBeInTheDocument();

    // Click to switch to dark theme
    fireEvent.click(toggleButton);

    // Now it should have theme-dark
    expect(container?.className).toContain('theme-dark');
    expect(screen.getByTitle('Switch to light mode')).toBeInTheDocument();
  });
});
