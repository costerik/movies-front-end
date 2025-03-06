import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Filters from '../components/ui/Filters';

describe('Filters Component', () => {
  const defaultProps = {
    searchTerm: '',
    onSearchChange: vi.fn(),
    selectedGenre: '',
    onGenreChange: vi.fn(),
    sortBy: 'year' as const,
    onSortByChange: vi.fn(),
    sortOrder: 'desc' as const,
    onSortOrderChange: vi.fn(),
    yearRange: [1900, 2025] as [number, number],
    onYearRangeChange: vi.fn(),
    genres: ['Action', 'Drama', 'Comedy'],
    minYear: 1900,
    maxYear: 2025,
  };

  it('renders all filter controls', () => {
    render(<Filters {...defaultProps} />);

    // Check if all filter sections are present
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Genre')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort By')).toBeInTheDocument();
    expect(screen.getByText(/Year Range:/)).toBeInTheDocument();
  });

  it('handles search input changes', () => {
    render(<Filters {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search by title...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test');
  });

  it('handles genre selection changes', () => {
    render(<Filters {...defaultProps} />);

    const genreSelect = screen.getByLabelText('Genre');
    fireEvent.change(genreSelect, { target: { value: 'Drama' } });

    expect(defaultProps.onGenreChange).toHaveBeenCalledWith('Drama');
  });

  it('handles sort by changes', () => {
    render(<Filters {...defaultProps} />);

    const sortSelect = screen.getByLabelText('Sort By');
    fireEvent.change(sortSelect, { target: { value: 'title' } });

    expect(defaultProps.onSortByChange).toHaveBeenCalledWith('title');
  });

  it('handles sort order changes', () => {
    render(<Filters {...defaultProps} />);

    const sortOrderButton = screen.getByLabelText('Sort ascending');
    fireEvent.click(sortOrderButton);

    expect(defaultProps.onSortOrderChange).toHaveBeenCalledWith('asc');
  });

  it('handles year range changes', () => {
    render(<Filters {...defaultProps} />);

    const [minYearInput, maxYearInput] = screen.getAllByRole('slider');

    fireEvent.change(minYearInput, { target: { value: '1950' } });
    expect(defaultProps.onYearRangeChange).toHaveBeenCalledWith([1950, 2025]);

    fireEvent.change(maxYearInput, { target: { value: '2000' } });
    expect(defaultProps.onYearRangeChange).toHaveBeenCalledWith([1900, 2000]);
  });

  it('displays all available genres in the dropdown', () => {
    render(<Filters {...defaultProps} />);

    const genreSelect = screen.getByLabelText('Genre');
    const options = Array.from(genreSelect.getElementsByTagName('option'));

    expect(options).toHaveLength(4); // Including "All Genres" option
    expect(options[0]).toHaveTextContent('All Genres');
    expect(options[1]).toHaveTextContent('Action');
    expect(options[2]).toHaveTextContent('Drama');
    expect(options[3]).toHaveTextContent('Comedy');
  });

  it('displays current year range values', () => {
    const yearRange: [number, number] = [1950, 2000];
    render(<Filters {...defaultProps} yearRange={yearRange} />);

    expect(screen.getByText(`Year Range: ${yearRange[0]} - ${yearRange[1]}`)).toBeInTheDocument();
  });
});
