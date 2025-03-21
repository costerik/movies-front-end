import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../../hooks/useMovieData';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  // Generate a placeholder image based on the movie title
  const placeholderImage = `https://source.unsplash.com/300x450/?movie,${encodeURIComponent(movie.title.split(' ')[0])}`;

  return (
    <Link
      to={`/movie/${movie.tconst}`}
      className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
      aria-label={`View details for ${movie.title} (${movie.year})`}
    >
      <div className="relative overflow-hidden bg-gray-200 pb-[150%]">
        <img
          src={placeholderImage}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className="inline-block rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
            {movie.year}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
          {movie.title}
        </h3>
        <div className="mt-2 flex items-center text-sm text-gray-600">
          {movie.runtime && (
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {movie.runtime} min
            </span>
          )}
        </div>
        {movie.genre && (
          <div className="mt-2 flex flex-wrap gap-1">
            {movie.genre
              .split(',')
              .slice(0, 2)
              .map(genre => (
                <span
                  key={genre}
                  className="inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-800"
                >
                  {genre.trim()}
                </span>
              ))}
            {movie.genre.split(',').length > 2 && (
              <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-800">
                +{movie.genre.split(',').length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
