import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { HomePage } from "./HomePage";
import { MemoryRouter } from "react-router";
import { usePaginatedHero } from "@/hooks/usePaginatedHero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";
vi.mock("@/hooks/usePaginatedHero");

const mockUsePaginatedHero = vi.mocked(usePaginatedHero);
mockUsePaginatedHero.mockReturnValue({
  data: {},
  isLoading: false,
  isError: false,
} as unknown as ReturnType<typeof usePaginatedHero>);

const queryClient = new QueryClient();

const renderHomePage = (initialEntries?: string[]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <FavoriteHeroProvider>
          <HomePage />
        </FavoriteHeroProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render homePage with default values", () => {
    const { container } = renderHomePage();
    // screen.debug(container);
    expect(container).toMatchSnapshot();
  });

  test("should call usePaginatedHero with correct parameters", () => {
    renderHomePage();
    expect(mockUsePaginatedHero).toHaveBeenCalledWith({
      page: 1,
      limit: 6,
      category: "all",
    });
  });

  test("should call usePaginatedHero with custom query params", () => {
    renderHomePage(["/?page=2&limit=10&category=villains"]);
    expect(mockUsePaginatedHero).toHaveBeenCalledWith({
      page: 2,
      limit: 10,
      category: "villains",
    });
  });

  test("should XXXX", () => {
    renderHomePage(["/?tab=favorites"]);
    const [, , , villainsTab] = screen.getAllByRole("tab");
    fireEvent.click(villainsTab);
    expect(mockUsePaginatedHero).toHaveBeenCalledWith({
      page: 1,
      limit: 6,
      category: "villain",
    });
  });
});
