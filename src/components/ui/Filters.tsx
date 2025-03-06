import React from 'react';

interface FiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedGenre: string;
  onGenreChange: (value: string) => void;
  sortBy: 'title' | 'year' | 'runtime';
  onSortByChange: (value: 'title' | 'year' | 'runtime') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  yearRange: [number, number];
  onYearRangeChange: (range: [number, number]) => void;
  genres: string[];
  minYear: number;
  maxYear: number;
}

const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  yearRange,
  onYearRangeChange,
  genres,
  minYear,
  maxYear,
}) => {
  return (
    <div className="space-y-4 rounded-lg bg-white p-6 shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">Filters</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by title..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        {/* Genre Filter */}
        <div>
          <label htmlFor="genre" className="mb-1 block text-sm font-medium text-gray-700">
            Genre
          </label>
          <select
            id="genre"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedGenre}
            onChange={e => onGenreChange(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sortBy" className="mb-1 block text-sm font-medium text-gray-700">
            Sort By
          </label>
          <div className="flex">
            <select
              id="sortBy"
              className="flex-grow rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={e => onSortByChange(e.target.value as 'title' | 'year' | 'runtime')}
            >
              <option value="title">Title</option>
              <option value="year">Year</option>
              <option value="runtime">Runtime</option>
            </select>
            <button
              className="rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-3 py-2 hover:bg-gray-200"
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Year Range */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Year Range: {yearRange[0]} - {yearRange[1]}
          </label>
          <div className="px-2">
            <input
              type="range"
              min={minYear}
              max={maxYear}
              value={yearRange[0]}
              onChange={e => onYearRangeChange([parseInt(e.target.value), yearRange[1]])}
              className="w-full"
              aria-label="Minimum year"
            />
            <input
              type="range"
              min={minYear}
              max={maxYear}
              value={yearRange[1]}
              onChange={e => onYearRangeChange([yearRange[0], parseInt(e.target.value)])}
              className="w-full"
              aria-label="Maximum year"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
