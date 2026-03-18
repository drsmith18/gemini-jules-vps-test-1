import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from '@testing-library/react';
import { Forecast } from './Forecast';
import type { ForecastData } from '../hooks/useWeather';

describe('Forecast component', () => {
  const mockForecast: ForecastData[] = [
    { date: 'Mon', temperature: 15, description: 'sunny', icon: '01d' },
    { date: 'Tue', temperature: 12, description: 'rainy', icon: '10d' },
    { date: 'Wed', temperature: 10, description: 'cloudy', icon: '03d' },
  ];

  const mockConvertTemp = vi.fn((temp) => temp);

  it('renders the 5-day forecast heading', () => {
    render(
      <Forecast 
        forecast={mockForecast}
        unit="C"
        convertTemp={mockConvertTemp}
      />
    );
    expect(screen.getByText('5-Day Forecast')).toBeInTheDocument();
  });

  it('renders multiple ForecastCard components', () => {
    mockConvertTemp.mockClear();
    render(
      <Forecast 
        forecast={mockForecast}
        unit="C"
        convertTemp={mockConvertTemp}
      />
    );
    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    
    // Convert temp should be called once for each forecast item
    expect(mockConvertTemp).toHaveBeenCalledTimes(3);
  });
});
