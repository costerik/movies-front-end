import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MovieDetailsPage from "../pages/MovieDetailsPage";

// Mock the useMovieData hook
vi.mock("../hooks/useMovieData", () => ({
  useMovieData: () => ({
    loading: false,
    getMovie: (id: string) => {
      if (id === "tt0111161") {
        return {
          tconst: "tt0111161",
          title: "The Shawshank Redemption",
          original_title: "The Shawshank Redemption",
          year: "1994",
          runtime: "142",
          genre: "Drama",
        };
      }
      return null;
    },
    getMoviePrincipals: (id: string) => {
      if (id === "tt0111161") {
        return [
          {
            id: 1,
            category: "actor",
            characters: ["Andy Dufresne"],
            tconst: "tt0111161",
            nconst: "nm0000209",
          },
          {
            id: 2,
            category: "actor",
            characters: ["Ellis Boyd 'Red' Redding"],
            tconst: "tt0111161",
            nconst: "nm0000151",
          },
        ];
      }
      return [];
    },
    getActorName: (nconst: string) => {
      if (nconst === "nm0000209") return "Tim Robbins";
      if (nconst === "nm0000151") return "Morgan Freeman";
      return "Unknown Actor";
    },
    getSimilarMovies: () => [],
  }),
}));

// Mock the navigate function
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("MovieDetailsPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders movie details correctly", () => {
    render(
      <MemoryRouter initialEntries={["/movie/tt0111161"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    // Check if movie title is displayed
    expect(screen.getByText("The Shawshank Redemption")).toBeInTheDocument();

    // Check if year is displayed
    expect(screen.getByText("1994")).toBeInTheDocument();

    // Check if runtime is displayed
    expect(screen.getByText("142 min")).toBeInTheDocument();

    // Check if genre is displayed
    expect(screen.getByText("Drama")).toBeInTheDocument();
  });

  it("displays cast members correctly", () => {
    render(
      <MemoryRouter initialEntries={["/movie/tt0111161"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    // Check if actor names are displayed
    expect(screen.getByText("Tim Robbins")).toBeInTheDocument();
    expect(screen.getByText("Morgan Freeman")).toBeInTheDocument();

    // Check if character names are displayed
    expect(screen.getByText("as Andy Dufresne")).toBeInTheDocument();
    expect(screen.getByText("as Ellis Boyd 'Red' Redding")).toBeInTheDocument();
  });

  it("navigates to 404 page when movie is not found", () => {
    render(
      <MemoryRouter initialEntries={["/movie/nonexistent"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith("/404");
  });
});
