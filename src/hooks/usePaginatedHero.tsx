import { getHeroesByPageAction } from "@/heroes/actions/get-heroes-by-page.action";
import { useQuery } from "@tanstack/react-query";

export interface PaginatedHeroProps {
  page: number;
  limit: number;
  category?: string;
}
export const usePaginatedHero = ({
  page,
  limit,
  category = "all",
}: PaginatedHeroProps) => {
  return useQuery({
    queryKey: ["heroes", { page, limit, category }], // Clave única para esta consulta
    queryFn: () =>
      getHeroesByPageAction({ page: +page, limit: +limit, category: category }), // Función que ejecuta la petición
    staleTime: 1000 * 60 * 5, // 5 minutos la datos se consideran frescos y se evita refetching innecesario
  });
};
