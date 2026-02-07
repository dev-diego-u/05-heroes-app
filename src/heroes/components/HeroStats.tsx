import { Badge } from "@/components/ui/badge";
import { Heart, Trophy, Users, Zap } from "lucide-react";
import { HeroStatCard } from "./HeroStatCard";
import { useHeroSummary } from "@/hooks/useHeroSummary";
import { useFavoriteHero } from "../context/FavoriteHeroContext";

export const HeroStats = () => {
  const { data: summary } = useHeroSummary();

  // Hook para obtener conteo de favoritos
  const { favoriteCount } = useFavoriteHero();

  const PorcentajeFavoritos =
    summary && summary.totalHeroes > 0
      ? ((favoriteCount / summary.totalHeroes) * 100).toFixed(1)
      : "0";

  // console.log(summary);
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <HeroStatCard
          title="Total Characters"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="text-2xl font-bold">{summary?.totalHeroes}</div>
          <div className="flex gap-1 mt-2">
            <Badge variant="secondary" className="text-xs">
              {summary?.heroCount}
            </Badge>
            <Badge variant="destructive" className="text-xs">
              {summary?.villainCount}
            </Badge>
          </div>
        </HeroStatCard>

        <HeroStatCard
          title="Favorites"
          icon={<Heart className="h-4 w-4 text-muted-foreground" />}
        >
          {/* todo: por hacer */}
          <div className="text-2xl font-bold text-red-600">{favoriteCount}</div>
          <p className="text-xs text-muted-foreground">
            {PorcentajeFavoritos}% of total
          </p>
        </HeroStatCard>

        <HeroStatCard
          title="Strongest"
          icon={<Zap className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="text-lg font-bold">
            {summary?.strongestHero.alias}
          </div>
          <p className="text-xs text-muted-foreground">
            Strength: {summary?.strongestHero.strength}/10
          </p>
        </HeroStatCard>

        <HeroStatCard
          title="Smartest"
          icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="text-lg font-bold">{summary?.smartestHero.alias}</div>
          <p className="text-xs text-muted-foreground">
            Intelligence: {summary?.smartestHero.intelligence}/10
          </p>
        </HeroStatCard>
      </div>
    </>
  );
};
