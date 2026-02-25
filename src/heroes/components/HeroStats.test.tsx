import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { HeroStats } from "./HeroStats";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoriteHeroProvider } from "../context/FavoriteHeroContext";
import { useHeroSummary } from "@/hooks/useHeroSummary";
import { SummaryResponse } from "../types/get-summary.response";

vi.mock("@/hooks/useHeroSummary"); // Mock del hook useHeroSummary para controlar su comportamiento en los tests

const mockUseHeroSummary = vi.mocked(useHeroSummary);

// totalHeroes: number;
// strongestHero: Hero;
// smartestHero: Hero;
// heroCount: number;
// villainCount: number;

const mockHero = {
  id: "1",
  name: "Clark Kent",
  slug: "clark-kent",
  alias: "Superman",
  powers: [
    "Súper fuerza",
    "Vuelo",
    "Visión de calor",
    "Visión de rayos X",
    "Invulnerabilidad",
    "Súper velocidad",
  ],
  description:
    "El Último Hijo de Krypton, protector de la Tierra y símbolo de esperanza para toda la humanidad.",
  strength: 10,
  intelligence: 8,
  speed: 9,
  durability: 10,
  team: "Liga de la Justicia",
  image: "1.jpeg",
  firstAppearance: "1938",
  status: "Active",
  category: "Hero",
  universe: "DC",
};

const mockSummaryData: SummaryResponse = {
  totalHeroes: 25,
  strongestHero: {
    id: "1",
    name: "Clark Kent",
    slug: "clark-kent",
    alias: "Superman",
    powers: [
      "Súper fuerza",
      "Vuelo",
      "Visión de calor",
      "Visión de rayos X",
      "Invulnerabilidad",
      "Súper velocidad",
    ],
    description:
      "El Último Hijo de Krypton, protector de la Tierra y símbolo de esperanza para toda la humanidad.",
    strength: 10,
    intelligence: 8,
    speed: 9,
    durability: 10,
    team: "Liga de la Justicia",
    image: "1.jpeg",
    firstAppearance: "1938",
    status: "Active",
    category: "Hero",
    universe: "DC",
  },
  smartestHero: {
    id: "2",
    name: "Bruce Wayne",
    slug: "bruce-wayne",
    alias: "Batman",
    powers: [
      "Artes marciales",
      "Habilidades de detective",
      "Tecnología avanzada",
      "Sigilo",
      "Genio táctico",
    ],
    description:
      "El Caballero Oscuro de Ciudad Gótica, que utiliza el miedo como arma contra el crimen y la corrupción.",
    strength: 6,
    intelligence: 10,
    speed: 6,
    durability: 7,
    team: "Liga de la Justicia",
    image: "2.jpeg",
    firstAppearance: "1939",
    status: "Active",
    category: "Hero",
    universe: "DC",
  },
  heroCount: 18,
  villainCount: 7,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Desactiva reintentos para pruebas
    },
  },
});

const renderHeroStats = (mockdata?: Partial<SummaryResponse>) => {
  if (mockdata) {
    mockUseHeroSummary.mockReturnValue({
      data: mockdata,
    } as unknown as ReturnType<typeof useHeroSummary>); // Simula el estado inicial del hook sin datos
  } else {
    mockUseHeroSummary.mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useHeroSummary>); // Simula el estado inicial del hook sin datos
  }

  return render(
    <QueryClientProvider client={queryClient}>
      <FavoriteHeroProvider>
        <HeroStats />
      </FavoriteHeroProvider>
    </QueryClientProvider>,
  );
};

describe("HeroStats Component", () => {
  // Aquí irán los tests para el componente HeroStats
  test("should render component with default values", () => {
    const { container } = renderHeroStats();
    // screen.debug(); // Para ver el output en la consola durante el test
    expect(screen.getByText("Cargando estadísticas...")).toBeDefined(); //que se muestre el mensaje de carga inicialmente
    expect(container).toMatchSnapshot(); // Verifica que el componente renderice correctamente con los valores por defectoh
  });

  test("should render component with mock data", () => {
    const { container } = renderHeroStats(mockSummaryData);
    // screen.debug();
    expect(screen.getByText("Total Characters")).toBeDefined();
    expect(screen.getByText("25")).toBeDefined();
    expect(screen.getByText("Favorites")).toBeDefined();
    expect(screen.getByText("0")).toBeDefined(); // El conteo de favoritos debería ser 0 inicialmente
    expect(screen.getByText("Strongest")).toBeDefined(); // El título del card de héroe más fuerte
    expect(screen.getByText("Superman")).toBeDefined(); // El alias del héroe más fuerte
    expect(screen.getByText("Strength: 10/10")).toBeDefined();
    expect(container).toMatchSnapshot(); // Verifica que el componente renderice correctamente con los datos simulados
  });

  test("should changed the percentage when favorite count changes", () => {
    localStorage.setItem("favoriteHeroes", JSON.stringify([mockHero])); // Simula que el usuario ha marcado 2 héroes como favoritos
    const { container } = renderHeroStats(mockSummaryData);
    // screen.debug();
    const favoritePercentageElement = screen.getByTestId(
      "percentage-favorites",
    );
    const favoriteCountElement = screen.getByTestId("favorite-count");
    expect(favoritePercentageElement.innerHTML).toBe("4.0% of total"); // El porcentaje de favoritos debería ser 4.0% (1 favorito de 25 héroes)
    expect(favoriteCountElement.innerHTML).toBe("1"); // El conteo de favoritos debería ser 1
  });
});
