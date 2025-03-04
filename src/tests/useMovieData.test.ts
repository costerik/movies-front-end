import { describe, beforeEach, test, vi, expect, Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { useMovieData, cache } from "../hooks/useMovieData"; // Update the import path
import { Movie, Name, Principal } from "../hooks/useMovieData";

vi.mock("axios");

const mockMovies: Movie[] = [
  {
    tconst: "1",
    title: "Movie 1",
    original_title: "",
    year: "2020",
    runtime: "120",
    genre: "Action,Adventure",
  },
  {
    tconst: "2",
    title: "Movie 2",
    original_title: "",
    year: "2021",
    runtime: "130",
    genre: "Drama",
  },
];

const mockNames: Name[] = [
  {
    nconst: "nm1",
    name: "Actor 1",
    birth_year: "1980",
    death_year: null,
    primary_professions: "actor",
  },
  {
    nconst: "nm2",
    name: "Actor 2",
    birth_year: "1990",
    death_year: null,
    primary_professions: "actress",
  },
];

const mockPrincipals: Principal[] = [
  {
    id: 1,
    category: "actor",
    characters: ["Hero"],
    tconst: "1",
    nconst: "nm1",
  },
  {
    id: 2,
    category: "actress",
    characters: ["Heroine"],
    tconst: "1",
    nconst: "nm2",
  },
];

describe("useMovieData Hook", () => {
  beforeEach(() => {
    // Reset cache and mocks before each test
    cache.movies = null;
    cache.principals = null;
    cache.names = null;
    cache.timestamp = 0;
    vi.clearAllMocks();
  });

  test("should initialize with loading state", async () => {
    (axios.get as Mock).mockResolvedValueOnce({ data: mockMovies });
    (axios.get as Mock).mockResolvedValueOnce({ data: mockNames });
    (axios.get as Mock).mockResolvedValueOnce({ data: mockPrincipals });

    const { result } = renderHook(() => useMovieData());

    expect(result.current.loading).toBe(true);
    expect(result.current.movies).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  test("should fetch and cache data successfully", async () => {
    (axios.get as Mock)
      .mockResolvedValueOnce({ data: mockMovies })
      .mockResolvedValueOnce({ data: mockNames })
      .mockResolvedValueOnce({ data: mockPrincipals });

    const { result } = renderHook(() => useMovieData());

    await waitFor(() => {
      expect(result.current.movies).toEqual(mockMovies);
      expect(result.current.names).toEqual(mockNames);
      expect(result.current.principals).toEqual(mockPrincipals);
      expect(cache.movies).toEqual(mockMovies);
      expect(cache.timestamp).toBeGreaterThan(0);
    });
  });

  test("should use cached data when valid", async () => {
    // Set valid cache
    cache.movies = mockMovies;
    cache.names = mockNames;
    cache.principals = mockPrincipals;
    cache.timestamp = Date.now() - 2 * 60 * 1000; // 2 minutes old

    const { result } = renderHook(() => useMovieData());

    expect(axios.get).not.toHaveBeenCalled();
    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.loading).toBe(false);
  });

  test("should fetch fresh data when cache expires", async () => {
    // Set expired cache
    cache.movies = mockMovies;
    cache.names = mockNames;
    cache.principals = mockPrincipals;
    cache.timestamp = Date.now() - 6 * 60 * 1000; // 6 minutes old

    (axios.get as Mock)
      .mockResolvedValueOnce({ data: mockMovies })
      .mockResolvedValueOnce({ data: mockNames })
      .mockResolvedValueOnce({ data: mockPrincipals });

    const { result } = renderHook(() => useMovieData());

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(3);
      expect(result.current.movies).toEqual(mockMovies);
    });
  });

  test("should handle errors gracefully", async () => {
    const errorMessage = "Network Error";
    (axios.get as Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useMovieData());

    await waitFor(() => {
      expect(result.current.error).toBe(
        "Failed to load movie data. Please try again later.",
      );
      expect(result.current.loading).toBe(false);
    });
  });

  test("should return correct genres", async () => {
    (axios.get as Mock)
      .mockResolvedValueOnce({ data: mockMovies })
      .mockResolvedValueOnce({ data: mockNames })
      .mockResolvedValueOnce({ data: mockPrincipals });

    const { result } = renderHook(() => useMovieData());

    await waitFor(() => {
      expect(result.current.genres).toEqual(["Action", "Adventure", "Drama"]);
    });
  });

  describe("Utility Functions", () => {
    beforeEach(async () => {
      (axios.get as Mock)
        .mockResolvedValueOnce({ data: mockMovies })
        .mockResolvedValueOnce({ data: mockNames })
        .mockResolvedValueOnce({ data: mockPrincipals });

      const { result } = renderHook(() => useMovieData());
      await waitFor(() => expect(result.current.loading).toBe(false));
      return result.current;
    });

    test("getActorName returns correct name", async () => {
      const { result } = renderHook(() => useMovieData());
      expect(result.current.getActorName("nm1")).toBe("Actor 1");
      expect(result.current.getActorName("invalid")).toBe("Unknown Actor");
    });

    test("getMoviePrincipals filters correctly", async () => {
      const { result } = renderHook(() => useMovieData());
      const principals = result.current.getMoviePrincipals("1");
      expect(principals).toHaveLength(2);
      expect(principals[0].nconst).toBe("nm1");
    });

    test("getMovie finds movie by ID", async () => {
      const { result } = renderHook(() => useMovieData());
      const movie = result.current.getMovie("1");
      expect(movie?.title).toBe("Movie 1");
      expect(result.current.getMovie("invalid")).toBeNull();
    });
  });
});

