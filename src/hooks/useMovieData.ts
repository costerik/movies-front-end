import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Types
export interface Movie {
  tconst: string;
  title: string;
  original_title: string;
  year: string;
  runtime: string;
  genre: string;
}

export interface Principal {
  id: number;
  category: string;
  characters: string[];
  tconst: string;
  nconst: string;
}

export interface Name {
  nconst: string;
  name: string;
  birth_year: string;
  death_year: string | null;
  primary_professions: string;
}

// Cache for data
const cache = {
  movies: null as Movie[] | null,
  principals: null as Principal[] | null,
  names: null as Name[] | null,
  timestamp: 0,
  expiryTime: 5 * 60 * 1000, // 5 minutes
};

export const useMovieData = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [principals, setPrincipals] = useState<Principal[]>([]);
  const [names, setNames] = useState<Name[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Extract unique genres from movies
  const genres = [
    ...new Set(
      movies
        .filter((movie) => movie.genre)
        .flatMap((movie) => movie.genre.split(","))
        .map((genre) => genre.trim()),
    ),
  ].sort();

  // Fetch data with caching
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const now = Date.now();
      const isCacheValid =
        cache.movies &&
        cache.principals &&
        cache.names &&
        now - cache.timestamp < cache.expiryTime;

      if (isCacheValid) {
        setMovies(cache.movies!);
        setPrincipals(cache.principals!);
        setNames(cache.names!);
        setLoading(false);
        return;
      }
      // Fetch movies
      const moviesData = await axios.get<Movie[]>(
        "http://127.0.0.1:8000/api/movies/",
      );
      // Fetch names
      const namesData = await axios.get<Name[]>(
        "http://127.0.0.1:8000/api/names/",
      );
      // Fetch principals for the selected movie
      const principalsData = await axios.get<Principal[]>(
        "http://127.0.0.1:8000/api/principals/",
      );

      // Update cache
      cache.movies = moviesData.data;
      cache.principals = principalsData.data;
      cache.names = namesData.data;
      cache.timestamp = now;

      setMovies(moviesData.data);
      setPrincipals(principalsData.data);
      setNames(namesData.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load movie data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get actor name by nconst
  const getActorName = useCallback(
    (nconst: string) => {
      const actor = names.find((name) => name.nconst === nconst);
      return actor ? actor.name : "Unknown Actor";
    },
    [names],
  );

  // Get principals for a specific movie
  const getMoviePrincipals = useCallback(
    (movieId: string) => {
      return principals.filter((principal) => principal.tconst === movieId);
    },
    [principals],
  );

  // Get movie by ID
  const getMovie = useCallback(
    (id: string) => {
      return movies.find((movie) => movie.tconst === id) || null;
    },
    [movies],
  );

  // Get similar movies based on genre
  const getSimilarMovies = useCallback(
    (movie: Movie, limit: number = 6) => {
      if (!movie || !movie.genre) return [];

      const movieGenres = movie.genre.split(",").map((g) => g.trim());

      return movies
        .filter(
          (m) =>
            m.tconst !== movie.tconst && // Not the same movie
            m.genre && // Has genres
            movieGenres.some((genre) => m.genre.includes(genre)), // Shares at least one genre
        )
        .sort((a, b) => {
          // Count matching genres for each movie
          const aMatches = movieGenres.filter((genre) =>
            a.genre.includes(genre),
          ).length;
          const bMatches = movieGenres.filter((genre) =>
            b.genre.includes(genre),
          ).length;

          // Sort by number of matching genres (descending)
          if (aMatches !== bMatches) return bMatches - aMatches;

          // If same number of matching genres, sort by year (newest first)
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          return yearB - yearA;
        })
        .slice(0, limit);
    },
    [movies],
  );

  return {
    movies,
    principals,
    names,
    genres,
    loading,
    error,
    getActorName,
    getMoviePrincipals,
    getMovie,
    getSimilarMovies,
    refreshData: fetchData,
  };
};
