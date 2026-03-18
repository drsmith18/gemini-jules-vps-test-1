import { render, screen } from '@testing-library/react';
import { ForecastCard } from './ForecastCard';
import type { ForecastData } from '../hooks/useWeather';

describe('ForecastCard component', () => {
  const mockData: ForecastData = {
    date: 'Mon',
    temperature: 15,
    description: 'sunny',
    icon: '01d'
  };

  it('renders forecast data correctly', () => {
    render(
      <ForecastCard
        data={mockData}
        unit="C"
        convertedTemp={15}
      />
    );

    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('15°C')).toBeInTheDocument();
    expect(screen.getByText('sunny')).toBeInTheDocument();

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://openweathermap.org/img/wn/01d.png');
    expect(img).toHaveAttribute('alt', 'sunny');
  });

  it('renders correctly with fahrenheit', () => {
    render(
      <ForecastCard
        data={mockData}
        unit="F"
        convertedTemp={59}
      />
    );
    expect(screen.getByText('59°F')).toBeInTheDocument();
  });
});
