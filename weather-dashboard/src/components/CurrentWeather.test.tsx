import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from '@testing-library/react';
import { CurrentWeather } from './CurrentWeather';
import type { WeatherData } from '../hooks/useWeather';

describe('CurrentWeather component', () => {
  const mockWeather: WeatherData = {
    city: 'London',
    temperature: 15,
    description: 'scattered clouds',
    humidity: 75,
    windSpeed: 10,
    icon: '03d',
    condition: 'Clouds'
  };

  const mockOnToggleFavorite = vi.fn();

  it('renders correctly with given weather data', () => {
    render(
      <CurrentWeather 
        weather={mockWeather}
        unit="C"
        convertedTemp={15}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('15°C')).toBeInTheDocument();
    expect(screen.getByText('scattered clouds')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('10 km/h')).toBeInTheDocument();
    
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('src', 'https://openweathermap.org/img/wn/03d@4x.png');
    expect(icon).toHaveAttribute('alt', 'scattered clouds');
  });

  it('handles favorite toggle', () => {
    render(
      <CurrentWeather 
        weather={mockWeather}
        unit="C"
        convertedTemp={15}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const favoriteBtn = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(favoriteBtn);
    expect(mockOnToggleFavorite).toHaveBeenCalledWith('London');
  });

  it('shows active state when isFavorite is true', () => {
    render(
      <CurrentWeather 
        weather={mockWeather}
        unit="C"
        convertedTemp={15}
        isFavorite={true}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const favoriteBtn = screen.getByRole('button', { name: /remove from favorites/i });
    expect(favoriteBtn).toHaveClass('active');
  });
});
