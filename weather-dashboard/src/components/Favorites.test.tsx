import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Favorites } from './Favorites';

describe('Favorites component', () => {
  const mockFavorites = ['San Francisco', 'New York'];
  const onSelect = vi.fn();
  const onRemove = vi.fn();

  it('should render nothing if favorites are empty', () => {
    const { container } = render(
      <Favorites favorites={[]} onSelect={onSelect} onRemove={onRemove} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render the list of favorite cities', () => {
    render(
      <Favorites favorites={mockFavorites} onSelect={onSelect} onRemove={onRemove} />
    );
    expect(screen.getByText('San Francisco')).toBeDefined();
    expect(screen.getByText('New York')).toBeDefined();
  });

  it('should call onSelect when a city is clicked', () => {
    render(
      <Favorites favorites={mockFavorites} onSelect={onSelect} onRemove={onRemove} />
    );
    fireEvent.click(screen.getByText('San Francisco'));
    expect(onSelect).toHaveBeenCalledWith('San Francisco');
  });

  it('should call onRemove when the X button is clicked', () => {
    render(
      <Favorites favorites={mockFavorites} onSelect={onSelect} onRemove={onRemove} />
    );
    const removeButtons = screen.getAllByTitle('Remove from favorites');
    fireEvent.click(removeButtons[0]);
    expect(onRemove).toHaveBeenCalledWith('San Francisco');
  });
});
