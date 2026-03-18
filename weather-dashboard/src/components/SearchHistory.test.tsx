import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchHistory } from './SearchHistory';

describe('SearchHistory component', () => {
  it('renders null when history is empty', () => {
    const { container } = render(
      <SearchHistory history={[]} onSelect={vi.fn()} onClear={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders history chips when history has items', () => {
    render(
      <SearchHistory 
        history={['London', 'Paris', 'Tokyo']} 
        onSelect={vi.fn()} 
        onClear={vi.fn()} 
      />
    );
    
    expect(screen.getByText('Recent Searches')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Tokyo')).toBeInTheDocument();
  });

  it('calls onSelect with the correct city when a history chip is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <SearchHistory 
        history={['London', 'Paris']} 
        onSelect={handleSelect} 
        onClear={vi.fn()} 
      />
    );
    
    fireEvent.click(screen.getByText('Paris'));
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith('Paris');
  });

  it('calls onClear when the clear button is clicked', () => {
    const handleClear = vi.fn();
    render(
      <SearchHistory 
        history={['London', 'Paris']} 
        onSelect={vi.fn()} 
        onClear={handleClear} 
      />
    );
    
    fireEvent.click(screen.getByText('Clear'));
    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
