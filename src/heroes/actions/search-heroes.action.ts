import { heroApi } from "../api/hero.api";
import { Hero } from "../types/hero.interface";

const BASE_URL = import.meta.env.VITE_API_URL;

export interface OptionsSearch {
  name?: string;
  team?: string;
  category?: string;
  universe?: string;
  status?: string;
  strength?: string;
}

export const searchHeroesAction = async (query: OptionsSearch = {}) => {
  const { name, team, category, universe, status, strength } = query;
  //al inicio no se envian parametros, por lo que se retorna un array vacio
  if (!name && !team && !category && !universe && !status && !strength) {
    return [];
  }

  const { data } = await heroApi.get<Hero[]>(`/search`, {
    params: { name, team, category, universe, status, strength },
  });
  const heroes = data.map((hero: Hero) => ({
    ...hero,
    image: `${BASE_URL}/images/${hero.image}`,
  }));
  return heroes;
};
