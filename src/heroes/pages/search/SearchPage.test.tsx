import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import SearchPage from "./SearchPage";
import { MemoryRouter } from "react-router";
import { Query, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";
import { useSearchHeroes } from "@/hooks/useSearchHeroes";
import { Hero } from "@/heroes/types/hero.interface";

vi.mock("@/hooks/useSearchHeroes");
const mockUseSearchHeroes = vi.mocked(useSearchHeroes);

vi.mock("@/heroes/components/HeroGrid", () => ({
  HeroGrid: ({ heroes }: { heroes: Hero[] }) => (
    <div data-testid="hero-grid">
      {heroes.map((hero) => (
        <div key={hero.id}>{hero.name}</div>
      ))}
    </div>
  ),
}));

vi.mock("@/components/custom/CustomJumbotron", () => ({
  CustomJumbotron: () => <div data-testid="custom-jumbotron" />,
}));

vi.mock("./ui/SearchControls", () => ({
  SearchControls: () => <div data-testid="search-controls" />,
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderSearchPage = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <FavoriteHeroProvider>
          <SearchPage />
        </FavoriteHeroProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("SearchPage", () => {
  beforeEach(() => {
    mockUseSearchHeroes.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);
  });

  test("should render SearchPage with default values", () => {
    renderSearchPage();
    expect(mockUseSearchHeroes).toHaveBeenCalledWith({
      name: undefined,
      strength: undefined,
    });
    // screen.debug();
  });

  test("should read query params correctly", () => {
    renderSearchPage(["/search?name=batman&strength=80"]);

    expect(mockUseSearchHeroes).toHaveBeenCalledWith({
      name: "batman",
      strength: "80",
    });
  });

  //test snapshot
  test("should match snapshot", () => {
    const { container } = render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <FavoriteHeroProvider>
            <SearchPage />
          </FavoriteHeroProvider>
        </QueryClientProvider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  test("should call search action  with name parameter", () => {
    renderSearchPage(["/search?name=superman"]);

    expect(mockUseSearchHeroes).toHaveBeenCalledWith({
      name: "superman",
      strength: undefined,
    });
  });

  test("should call search action with  strength parameter ", () => {
    renderSearchPage(["/search?strength=6"]);

    expect(mockUseSearchHeroes).toHaveBeenCalledWith({
      name: undefined,
      strength: "6",
    });
  });

  test("should call search action with name and  strength parameter ", () => {
    renderSearchPage(["/search?name=superman&strength=6"]);

    expect(mockUseSearchHeroes).toHaveBeenCalledWith({
      name: "superman",
      strength: "6",
    });
  });

  test("should render HeroGrid with search results", () => {
    const mockHeroes = [
      { id: "1", name: "Clark Kent" } as unknown as Hero,
      { id: "2", name: "Bruce Wayne" } as unknown as Hero,
    ];
    mockUseSearchHeroes.mockReturnValue({
      data: mockHeroes,
      isLoading: false,
      error: null,
    } as any);
    renderSearchPage();

    const heroGrid = screen.getByTestId("hero-grid");
    // screen.debug(heroGrid);

    expect(screen.getByText("Clark Kent")).toBeDefined();
    expect(screen.getByText("Bruce Wayne")).toBeDefined();
  });
});
