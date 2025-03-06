import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import { Movie } from '../hooks/useMovieData';

// Mock the useMovieData hook
vi.mock('../hooks/useMovieData', () => ({
  useMovieData: () => ({
    movies: [
      {
        tconst: 'tt0111161',
        title: 'The Shawshank Redemption',
        original_title: 'The Shawshank Redemption',
        year: '1994',
        runtime: '142',
        genre: 'Drama',
      },
      {
        tconst: 'tt0068646',
        title: 'The Godfather',
        original_title: 'The Godfather',
        year: '1972',
        runtime: '175',
        genre: 'Crime,Drama',
      },
      {
        tconst: 'tt0071562',
        title: 'The Godfather: Part II',
        original_title: 'The Godfather: Part II',
        year: '1974',
        runtime: '202',
        genre: 'Crime,Drama',
      },
    ],
    loading: false,
    error: null,
    genres: ['Crime', 'Drama'],
  }),
}));

// Mock MovieCard component
vi.mock('../components/ui/MovieCard', () => ({
  default: ({ movie }: { movie: Movie }) => (
    <div data-testid={`movie-card-${movie.tconst}`}>
      <h3>{movie.title}</h3>
      <p>{movie.year}</p>
      <p>{movie.genre}</p>
    </div>
  ),
}));

describe('HomePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all movies initially', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );

    // Check if all movies are rendered
    expect(screen.getByTestId('movie-card-tt0111161')).toBeInTheDocument();
    expect(screen.getByTestId('movie-card-tt0068646')).toBeInTheDocument();
    expect(screen.getByTestId('movie-card-tt0071562')).toBeInTheDocument();
  });

  it('filters movies by search term', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );

    // Enter search term
    const searchInput = screen.getByPlaceholderText('Search by title...');
    fireEvent.change(searchInput, { target: { value: 'godfather' } });

    // Check if only Godfather movies are displayed
    expect(screen.queryByTestId('movie-card-tt0111161')).not.toBeInTheDocument();
    expect(screen.getByTestId('movie-card-tt0068646')).toBeInTheDocument();
    expect(screen.getByTestId('movie-card-tt0071562')).toBeInTheDocument();
  });

  it('filters movies by genre', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );

    // Select genre
    const genreSelect = screen.getByLabelText('Genre');
    fireEvent.change(genreSelect, { target: { value: 'Crime' } });

    // Check if only Crime movies are displayed
    expect(screen.queryByTestId('movie-card-tt0111161')).not.toBeInTheDocument();
    expect(screen.getByTestId('movie-card-tt0068646')).toBeInTheDocument();
    expect(screen.getByTestId('movie-card-tt0071562')).toBeInTheDocument();
  });

  it('resets filters when reset button is clicked', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );

    // Apply filters
    const searchInput = screen.getByPlaceholderText('Search by title...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    // Wait for no results message
    await waitFor(() => {
      expect(screen.getByText('No movies found matching your filters')).toBeInTheDocument();
    });

    // Click reset button
    const resetButton = screen.getByText('Reset Filters');
    fireEvent.click(resetButton);

    // Check if all movies are displayed again
    expect(screen.getByTestId('movie-card-tt0111161')).toBeInTheDocument();
    expect(screen.getByTestId('movie-card-tt0068646')).toBeInTheDocument();
    expect(screen.getByTestId('movie-card-tt0071562')).toBeInTheDocument();
  });
});
