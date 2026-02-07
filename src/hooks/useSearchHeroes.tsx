import { searchHeroesAction } from "@/heroes/actions/search-heroes.action";
import { useQuery } from "@tanstack/react-query";

import type { OptionsSearch } from "@/heroes/actions/search-heroes.action";

export const useSearchHeroes = (query: OptionsSearch) => {
  return useQuery({
    queryKey: ["search-heroes", query],
    queryFn: () => searchHeroesAction(query),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
