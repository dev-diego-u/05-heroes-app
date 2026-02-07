import {
  createContext,
  type PropsWithChildren,
  useState,
  useEffect,
  useContext,
} from "react";
import type { Hero } from "../types/hero.interface";

// Definición del tipo para el contexto de héroes favoritos
export interface FavoriteHeroContextType {
  favorites: Hero[];
  favoriteCount: number;
  isFavorite: (hero: Hero) => boolean;
  toggleFavorite: (hero: Hero) => void;
}

// Creación del contexto
export const FavoriteHeroContext = createContext<
  FavoriteHeroContextType | undefined
>(undefined);

const getFavoriteHeroesFromStorage = (): Hero[] => {
  const storedFavorites = localStorage.getItem("favoriteHeroes");
  return storedFavorites ? JSON.parse(storedFavorites) : [];
};

// Provider que maneja el estado y lógica de favoritos
export const FavoriteHeroProvider = ({ children }: PropsWithChildren) => {
  const [favorites, setFavorites] = useState<Hero[]>(() =>
    getFavoriteHeroesFromStorage()
  );

  // Verifica si un héroe está en la lista de favoritos
  const isFavorite = (hero: Hero): boolean => {
    return favorites.some((h) => h.id === hero.id);
  };

  // Agrega o elimina un héroe de favoritos
  const toggleFavorite = (hero: Hero): void => {
    const heroExists = favorites.find((h) => h.id === hero.id);

    if (heroExists) {
      // Si existe, lo eliminamos
      setFavorites((prev) => prev.filter((h) => h.id !== hero.id));
      return;
    }

    // Si no existe, lo agregamos
    setFavorites((prev) => [...prev, hero]);
  };

  useEffect(() => {
    localStorage.setItem("favoriteHeroes", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <FavoriteHeroContext.Provider
      value={{
        favorites,
        favoriteCount: favorites.length,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoriteHeroContext.Provider>
  );
};

// // Hook para usar el contexto de favoritos
export const useFavoriteHero = () => {
  const context = useContext(FavoriteHeroContext);

  if (!context) {
    throw new Error(
      "useFavoriteHero debe usarse dentro de FavoriteHeroProvider"
    );
  }

  return context;
};
