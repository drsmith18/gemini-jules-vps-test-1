import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';
import { vi } from 'vitest';

describe('SearchBar component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input field and submit button', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText('Search city...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search city...');
    fireEvent.change(input, { target: { value: 'New York' } });
    
    expect(input).toHaveValue('New York');
  });

  it('calls onSearch with correct value when submitted', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search city...');
    fireEvent.change(input, { target: { value: 'Paris' } });
    
    const form = screen.getByRole('button').closest('form')!;
    fireEvent.submit(form);
    
    expect(mockOnSearch).toHaveBeenCalledWith('Paris');
  });

  it('does not call onSearch if input is empty or only whitespace', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search city...');
    const form = screen.getByRole('button').closest('form')!;
    
    // empty submit
    fireEvent.submit(form);
    expect(mockOnSearch).not.toHaveBeenCalled();

    // whitespace submit
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(form);
    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});
