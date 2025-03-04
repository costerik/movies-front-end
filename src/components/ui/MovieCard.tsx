import React from "react";
import { Link } from "react-router-dom";
import { Movie } from "../../hooks/useMovieData";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  // Generate a placeholder image based on the movie title
  const placeholderImage = `https://source.unsplash.com/300x450/?movie,${encodeURIComponent(movie.title.split(' ')[0])}`;
  
  return (
    <Link
      to={`/movie/${movie.tconst}`}
      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      aria-label={`View details for ${movie.title} (${movie.year})`}
    >
      <div className="relative pb-[150%] overflow-hidden bg-gray-200">
        <img
          src={placeholderImage}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
            {movie.year}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {movie.title}
        </h3>
        <div className="mt-2 flex items-center text-sm text-gray-600">
          {movie.runtime && (
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
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
            {movie.genre.split(',').slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded"
              >
                {genre.trim()}
              </span>
            ))}
            {movie.genre.split(',').length > 2 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
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