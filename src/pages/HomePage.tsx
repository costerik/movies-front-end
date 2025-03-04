import React, { useState, useEffect, useMemo } from "react";
import { useMovieData } from "../hooks/useMovieData";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import MovieCard from "../components/ui/MovieCard";

const HomePage: React.FC = () => {
  const { movies, loading, error, genres } = useMovieData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [yearRange, setYearRange] = useState<[number, number]>([1900, 2030]);
  const [sortBy, setSortBy] = useState<"title" | "year" | "runtime">("year");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 20;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGenre, yearRange, sortBy, sortOrder]);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    return movies
      .filter((movie) => {
        // Search filter
        const matchesSearch = movie.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        // Genre filter
        const matchesGenre =
          !selectedGenre ||
          (movie.genre &&
            movie.genre.toLowerCase().includes(selectedGenre.toLowerCase()));

        // Year filter
        const year = parseInt(movie.year) || 0;
        const matchesYear = year >= yearRange[0] && year <= yearRange[1];

        return matchesSearch && matchesGenre && matchesYear;
      })
      .sort((a, b) => {
        if (sortBy === "title") {
          return sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else if (sortBy === "year") {
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          return sortOrder === "asc" ? yearA - yearB : yearB - yearA;
        } else if (sortBy === "runtime") {
          const runtimeA = parseInt(a.runtime) || 0;
          const runtimeB = parseInt(b.runtime) || 0;
          return sortOrder === "asc"
            ? runtimeA - runtimeB
            : runtimeB - runtimeA;
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
  const minYear = Math.min(...movies.map((m) => parseInt(m.year) || 2030));
  const maxYear = Math.max(...movies.map((m) => parseInt(m.year) || 1900));

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Discover Movies</h1>
        <p className="opacity-90">
          Explore our collection of classic and modern films
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Genre Filter */}
          <div>
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Genre
            </label>
            <select
              id="genre"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label
              htmlFor="sortBy"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sort By
            </label>
            <div className="flex">
              <select
                id="sortBy"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "title" | "year" | "runtime")
                }
              >
                <option value="title">Title</option>
                <option value="year">Year</option>
                <option value="runtime">Runtime</option>
              </select>
              <button
                className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-md hover:bg-gray-200"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                aria-label={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          {/* Year Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Range: {yearRange[0]} - {yearRange[1]}
            </label>
            <div className="px-2">
              <input
                type="range"
                min={minYear}
                max={maxYear}
                value={yearRange[0]}
                onChange={(e) =>
                  setYearRange([parseInt(e.target.value), yearRange[1]])
                }
                className="w-full"
              />
              <input
                type="range"
                min={minYear}
                max={maxYear}
                value={yearRange[1]}
                onChange={(e) =>
                  setYearRange([yearRange[0], parseInt(e.target.value)])
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Movies{" "}
            <span className="text-gray-500 text-sm">
              ({filteredMovies.length} results)
            </span>
          </h2>
        </div>

        {paginatedMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedMovies.map((movie) => (
                <MovieCard key={movie.tconst} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav
                  className="flex items-center space-x-2"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-100"
                        }`}
                        aria-label={`Page ${pageNum}`}
                        aria-current={
                          currentPage === pageNum ? "page" : undefined
                        }
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
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
                setSearchTerm("");
                setSelectedGenre("");
                setYearRange([minYear, maxYear]);
                setSortBy("year");
                setSortOrder("desc");
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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

