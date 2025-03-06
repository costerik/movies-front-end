import React, { useState, useEffect, useMemo } from 'react';
import { useMovieData } from '../hooks/useMovieData';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import MovieCard from '../components/ui/MovieCard';
import Pagination from '../components/ui/Pagination';
import Filters from '../components/ui/Filters';

const HomePage: React.FC = () => {
  const { movies, loading, error, genres } = useMovieData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [yearRange, setYearRange] = useState<[number, number]>([1900, 2030]);
  const [sortBy, setSortBy] = useState<'title' | 'year' | 'runtime'>('year');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 20;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGenre, yearRange, sortBy, sortOrder]);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    return movies
      .filter(movie => {
        // Search filter
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());

        // Genre filter
        const matchesGenre =
          !selectedGenre ||
          (movie.genre && movie.genre.toLowerCase().includes(selectedGenre.toLowerCase()));

        // Year filter
        const year = parseInt(movie.year) || 0;
        const matchesYear = year >= yearRange[0] && year <= yearRange[1];

        return matchesSearch && matchesGenre && matchesYear;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return sortOrder === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else if (sortBy === 'year') {
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          return sortOrder === 'asc' ? yearA - yearB : yearB - yearA;
        } else if (sortBy === 'runtime') {
          const runtimeA = parseInt(a.runtime) || 0;
          const runtimeB = parseInt(b.runtime) || 0;
          return sortOrder === 'asc' ? runtimeA - runtimeB : runtimeB - runtimeA;
        }
        return 0;
      });
  }, [movies, searchTerm, selectedGenre, yearRange, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * moviesPerPage,
    currentPage * moviesPerPage,
  );

  // Year range for the slider
  const minYear = Math.min(...movies.map(m => parseInt(m.year) || 2030));
  const maxYear = Math.max(...movies.map(m => parseInt(m.year) || 1900));

  if (loading) return <LoadingSpinner message="Loading movies..." />;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <h1 className="mb-2 text-3xl font-bold">Discover Movies</h1>
        <p className="opacity-90">Explore our collection of classic and modern films</p>
      </div>

      {/* Filters */}
      <Filters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        yearRange={yearRange}
        onYearRangeChange={setYearRange}
        genres={genres}
        minYear={minYear}
        maxYear={maxYear}
      />

      {/* Results */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Movies <span className="text-sm text-gray-500">({filteredMovies.length} results)</span>
          </h2>
        </div>

        {paginatedMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedMovies.map(movie => (
                <MovieCard key={movie.tconst} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-8"
            />
          </>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-4 h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg">No movies found matching your filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('');
                setYearRange([minYear, maxYear]);
                setSortBy('year');
                setSortOrder('desc');
              }}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
