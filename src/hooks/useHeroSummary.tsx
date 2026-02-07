import { getSummaryAction } from "@/heroes/actions/get-summary.action";
import { useQuery } from "@tanstack/react-query";

export const useHeroSummary = () => {
  return useQuery({
    queryKey: ["hero-summary"],
    queryFn: () => getSummaryAction(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
