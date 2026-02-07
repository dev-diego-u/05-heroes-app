import { heroApi } from "../api/hero.api";
import { HeroesResponse } from "../types/get-heroes.response";
const BASE_URL = import.meta.env.VITE_API_URL;

export interface GetHeroesByPageActionProps {
  page?: number; // define la página de héroes a obtener, por defecto es 1
  limit?: number; // define el número de héroes por página, por defecto es 10
  category?: string; // define la categoría de héroes a obtener, por defecto es "all"
}

export const getHeroesByPageAction = async ({
  page = 1,
  limit = 6,
  category = "all",
}: GetHeroesByPageActionProps): Promise<HeroesResponse> => {
  //validacion de page y limit
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 6;

  const { data } = await heroApi.get<HeroesResponse>(`/`, {
    params: {
      limit,
      offset: (page - 1) * limit,
      category,
    },
  });
  const heroes = data.heroes.map((hero) => ({
    ...hero,
    image: `${BASE_URL}/images/${hero.image}`,
  }));
  return {
    ...data,
    heroes,
  };
};
