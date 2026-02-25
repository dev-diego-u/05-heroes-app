// Importación de utilidades de testing y dependencias
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { FavoriteHeroProvider, useFavoriteHero } from "./FavoriteHeroContext";
import { Hero } from "../types/hero.interface";

// Heroe de prueba para los tests
const mockHero: Hero = {
  id: "1",
  name: "batman",
  slug: "batman",
  alias: "Bruce Wayne",
  powers: ["mocking", "faking"],
  description: "A hero used for testing purposes.",
  strength: 50,
  intelligence: 70,
  speed: 60,
  durability: 80,
  team: "Mockers",
  image: "mock-hero.png",
  firstAppearance: "Mock Comics #1",
  status: "active",
  category: "test",
  universe: "Mock Universe",
};

// Mock de localStorage para aislar el test del navegador
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

// Reemplaza localStorage real por el mock
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Componente de prueba para consumir el contexto
const TestComponent = () => {
  const { favoriteCount, favorites, isFavorite, toggleFavorite } =
    useFavoriteHero();
  return (
    <div>
      <div data-testid="favorite-count">{favoriteCount}</div>
      <div data-testid="favorite-list">
        {favorites.map((hero) => (
          <div key={hero.id} data-testid={`favorite-hero-${hero.id}`}>
            {hero.name}
          </div>
        ))}
      </div>
      <div data-testid="is-favorite">
        {isFavorite(mockHero) ? "true" : "false"}
      </div>
      <button onClick={() => toggleFavorite(mockHero)}>Toggle Favorite</button>
    </div>
  );
};

// Función para renderizar el contexto y el componente de prueba
const renderContextTest = () => {
  return render(
    <FavoriteHeroProvider>
      <TestComponent />
    </FavoriteHeroProvider>,
  );
};

// Tests del contexto de héroes favoritos
describe("FavoriteHeroContext", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Limpia mocks antes de cada test
  });

  test("should initialize with default values", () => {
    renderContextTest(); // Renderiza el contexto
    expect(screen.getByTestId("favorite-count").textContent).toBe("0"); // Verifica valor inicial
    expect(screen.getByTestId("favorite-list").children.length).toBe(0); // Lista vacía
  });

  test("should add  a hero from favorites when toggled", () => {
    renderContextTest();
    const toggleButton = screen.getByText("Toggle Favorite");
    fireEvent.click(toggleButton); // Simula click para agregar favorito

    expect(screen.getByTestId("favorite-count").textContent).toBe("1"); // Debe aumentar el contador
    expect(screen.getByTestId("is-favorite").textContent).toBe("true"); // Debe ser favorito
    expect(screen.getByTestId("favorite-hero-1").textContent).toBe("batman"); // Aparece en la lista

    expect(localStorageMock.setItem).toBeCalled(); // Se guarda en localStorage
    expect(localStorageMock.setItem).toBeCalledWith(
      "favoriteHeroes",
      JSON.stringify([mockHero]),
    ); // Argumentos correctos
  });

  test("should remove a hero from favorites when toggled again", () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockHero])); // Inicializa con favorito
    renderContextTest();
    const toggleButton = screen.getByText("Toggle Favorite");
    fireEvent.click(toggleButton); // Simula click para quitar favorito
    expect(screen.queryByTestId("favorite-hero-1")).toBeNull(); // Ya no está en la lista
    expect(screen.getByTestId("favorite-count").textContent).toBe("0"); // Contador vuelve a cero
    expect(screen.getByTestId("favorite-list").children.length).toBe(0);
    expect(screen.getByTestId("is-favorite").textContent).toBe("false"); // Ya no es favorito
    expect(localStorageMock.setItem).toBeCalledWith(
      "favoriteHeroes",
      JSON.stringify([]), // Se actualiza localStorage vacío
    );
  });
  // ...otros tests comentados para referencia...
});
