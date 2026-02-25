import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { FavoriteHeroProvider, useFavoriteHero } from "./FavoriteHeroContext";
import { Hero } from "../types/hero.interface";

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

const renderContextTest = () => {
  return render(
    <FavoriteHeroProvider>
      <TestComponent />
    </FavoriteHeroProvider>,
  );
};

describe("FavoriteHeroContext", () => {
  // Limpia el localStorage antes de cada prueba para asegurar un estado limpio
  beforeEach(() => {
    localStorage.clear();
  });

  test("should initialize with default values", () => {
    renderContextTest();
    // screen.debug();
    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("favorite-list").children.length).toBe(0);
  });
  test("should add  a hero from favorites", () => {
    renderContextTest();
    const toggleButton = screen.getByText("Toggle Favorite");
    fireEvent.click(toggleButton);
    // screen.debug();
    // console.log(localStorage.getItem("favoriteHeroes"));
    expect(screen.getByTestId("favorite-hero-1").textContent).toBe("batman");
    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("favorite-list").children.length).toBe(1);
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(localStorage.getItem("favoriteHeroes")).toBe(
      JSON.stringify([mockHero]), //convierte el array de héroes favoritos a una cadena JSON para compararla con el valor almacenado en localStorage
    );
  });

  test("should remove a hero from favorites", () => {
    localStorage.setItem("favoriteHeroes", JSON.stringify([mockHero])); // Configura el localStorage con un héroe favorito antes de renderizar el componente
    renderContextTest();
    const toggleButton = screen.getByText("Toggle Favorite");
    fireEvent.click(toggleButton);
    // screen.debug();
    expect(screen.queryByTestId("favorite-hero-1")).toBeNull(); // Verifica que el héroe ya no esté en la lista de favoritos después de hacer clic en el botón para eliminarlo
    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("favorite-list").children.length).toBe(0);
    expect(screen.getByTestId("is-favorite").textContent).toBe("false");
    expect(localStorage.getItem("favoriteHeroes")).toBe(
      JSON.stringify([]), // Verifica que el localStorage se haya actualizado correctamente a un array vacío después de eliminar el héroe favorito
    );
  });
});
