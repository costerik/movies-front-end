import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMovieData, Movie } from "../hooks/useMovieData";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import MovieCard from "../components/ui/MovieCard";

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMovie, getMoviePrincipals, getActorName, getSimilarMovies, loading } = useMovieData();
  const [activeTab, setActiveTab] = useState<"cast" | "details" | "similar">("cast");
  const [isLoading, setIsLoading] = useState(true);

  const movie = id ? getMovie(id) : null;
  const principals = id ? getMoviePrincipals(id) : [];
  const similarMovies = movie ? getSimilarMovies(movie) : [];

  // Group principals by category
  const principalsByCategory = principals.reduce((acc, principal) => {
    const category = principal.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(principal);
    return acc;
  }, {} as Record<string, typeof principals>);

  // Categories order
  const categoryOrder = [
    "actor", "actress", "director", "writer", "producer", 
    "cinematographer", "composer", "editor", "production_designer",
    "costume_designer", "self", "archive_footage"
  ];

  // Sort categories
  const sortedCategories = Object.keys(principalsByCategory).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // Generate a placeholder image based on the movie title
  const placeholderImage = movie 
    ? `https://source.unsplash.com/800x1200/?movie,${encodeURIComponent(movie.title.split(' ')[0])}`
    : '';

  useEffect(() => {
    if (!loading) {
      if (!movie) {
        navigate("/404");
      } else {
        setIsLoading(false);
      }
    }
  }, [movie, loading, navigate]);

  if (isLoading || loading) {
    return <LoadingSpinner message="Loading movie details..." />;
  }

  if (!movie) {
    return null; // Will redirect to 404
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link 
        to="/" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Movies
      </Link>

      {/* Movie Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 lg:w-1/4 bg-gray-100">
            <div className="relative pb-[150%]">
              <img
                src={placeholderImage}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="p-6 md:w-2/3 lg:w-3/4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                {movie.year}
              </span>
              {movie.runtime && (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded">
                  {movie.runtime} min
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{movie.title}</h1>
            
            {movie.original_title !== movie.title && (
              <p className="text-gray-600 mb-4">
                Original Title: {movie.original_title}
              </p>
            )}
            
            {movie.genre && (
              <div className="mb-6">
                <h2 className="text-sm text-gray-500 mb-2">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.genre.split(',').map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {genre.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <div className="flex border-b">
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "cast"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("cast")}
                  aria-selected={activeTab === "cast"}
                  role="tab"
                >
                  Cast & Crew
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "details"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("details")}
                  aria-selected={activeTab === "details"}
                  role="tab"
                >
                  Details
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "similar"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("similar")}
                  aria-selected={activeTab === "similar"}
                  role="tab"
                >
                  Similar Movies
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === "cast" && (
          <div className="space-y-6 animate-fadeIn" role="tabpanel" aria-label="Cast & Crew">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cast & Crew</h2>
            
            {sortedCategories.length > 0 ? (
              sortedCategories.map((category) => (
                <div key={category} className="mb-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-3 capitalize">
                    {category.replace("_", " ")}s
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {principalsByCategory[category].map((principal) => (
                      <div
                        key={principal.id}
                        className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="font-medium text-gray-900">
                          {getActorName(principal.nconst)}
                        </div>
                        {principal.characters && principal.characters.length > 0 && (
                          <div className="text-sm text-gray-600 mt-1">
                            as {principal.characters.join(", ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No cast or crew information available for this movie.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-6 animate-fadeIn" role="tabpanel" aria-label="Movie Details">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Movie Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Information</h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Title</td>
                      <td className="py-2 font-medium text-gray-900">{movie.title}</td>
                    </tr>
                    {movie.original_title !== movie.title && (
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Original Title</td>
                        <td className="py-2 font-medium text-gray-900">{movie.original_title}</td>
                      </tr>
                    )}
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Year</td>
                      <td className="py-2 font-medium text-gray-900">{movie.year}</td>
                    </tr>
                    {movie.runtime && (
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Runtime</td>
                        <td className="py-2 font-medium text-gray-900">{movie.runtime} minutes</td>
                      </tr>
                    )}
                    {movie.genre && (
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Genres</td>
                        <td className="py-2 font-medium text-gray-900">{movie.genre}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-2 text-gray-600">ID</td>
                      <td className="py-2 font-medium text-gray-900">{movie.tconst}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Statistics</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-blue-600">{principals.length}</div>
                      <div className="text-sm text-gray-600 mt-1">Cast & Crew</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-blue-600">
                        {sortedCategories.length}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Departments</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-blue-600">
                        {movie.genre ? movie.genre.split(',').length : 0}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Genres</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-blue-600">
                        {2025 - parseInt(movie.year)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Years Old</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "similar" && (
          <div className="space-y-6 animate-fadeIn" role="tabpanel" aria-label="Similar Movies">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Similar Movies</h2>
            
            {similarMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {similarMovies.map((similarMovie) => (
                  <MovieCard key={similarMovie.tconst} movie={similarMovie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No similar movies found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;