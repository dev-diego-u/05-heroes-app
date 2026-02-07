// Imports de componentes UI y hooks personalizados
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { HeroGrid } from "@/heroes/components/HeroGrid";
// import { useState } from "react";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomBreadCrumbs } from "@/components/custom/CustomBreadCrumbs";
import { useSearchParams } from "react-router";
import { useMemo } from "react";
import { useHeroSummary } from "@/hooks/useHeroSummary";
import { usePaginatedHero } from "@/hooks/usePaginatedHero";
import { useFavoriteHero } from "@/heroes/context/FavoriteHeroContext";

// Tipos de pestañas disponibles
// all - Todos los personajes
// favorites - Personajes favoritos
// heroes - Solo héroes
// villains - Solo villanos
export type ActiveTab = "all" | "favorites" | "heroes" | "villains";

export const HomePage = () => {
  // Manejo de parámetros de URL para estado persistente
  // const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [searchParams, setSearchParams] = useSearchParams();
  // console.log(searchParams.get("limit"));

  // Extracción de parámetros de URL con valores por defecto
  const activeTab = searchParams.get("tab") ?? "all";
  // Mejor - Convertir una sola vez
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "6");
  const category = searchParams.get("category") ?? "all";

  // Validación de pestaña activa para evitar valores inválidos
  const selectedTab = useMemo(() => {
    const validTabs: ActiveTab[] = ["all", "favorites", "heroes", "villains"];
    const tab = validTabs.includes(activeTab as ActiveTab)
      ? (activeTab as ActiveTab)
      : "all";

    return tab;
  }, [activeTab]);

  // Hook para obtener conteo de favoritos
  const { favoriteCount, favorites } = useFavoriteHero();
  const pagesFavorites = Math.ceil(favoriteCount / +limit); //redonde hacia arriba

  const sliceFavorites = useMemo(() => {
    // console.log("se dispara slice favorites");
    const start = (page - 1) * limit;
    const end = start + limit;
    return favorites.slice(start, end);
  }, [favorites, page, limit]);

  // Hook para obtener héroes paginados según página y límite
  const { data: heroesResponse } = usePaginatedHero({
    page: +page,
    limit: +limit,
    category: category,
  });

  // Hook para obtener resumen de estadísticas (conteos)
  const { data: summary } = useHeroSummary();

  return (
    <>
      <>
        {/* Banner principal con título y descripción */}
        <CustomJumbotron
          title="Universo de superheroes"
          description="Explore y gestiona tu colección de héroes y villanos favoritos."
        />

        {/* Ruta de navegación */}
        <CustomBreadCrumbs />

        {/* Panel de estadísticas generales */}
        <HeroStats />

        {/* Sistema de pestañas para filtrar personajes */}
        <Tabs value={selectedTab} className="mb-8">
          {/* Lista de pestañas disponibles */}
          <TabsList className="grid w-full grid-cols-4">
            {/* Pestaña: Todos los personajes */}
            <TabsTrigger
              value="all"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("page", "1");
                  prev.set("tab", "all");
                  prev.delete("category");
                  return prev; //preserving other params
                })
              }
            >
              All Characters ({summary?.totalHeroes})
            </TabsTrigger>
            {/* Pestaña: Favoritos */}
            <TabsTrigger
              value="favorites"
              className="flex items-center gap-2"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("page", "1");
                  prev.set("tab", "favorites");

                  return prev; //preserving other params
                })
              }
            >
              Favorites ({favoriteCount})
            </TabsTrigger>
            {/* Pestaña: Solo héroes */}
            <TabsTrigger
              value="heroes"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("page", "1");
                  prev.set("tab", "heroes");
                  prev.set("category", "hero");
                  return prev;
                })
              }
            >
              Heroes ({summary?.heroCount})
            </TabsTrigger>
            {/* Pestaña: Solo villanos */}
            <TabsTrigger
              value="villains"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("page", "1");
                  prev.set("tab", "villains");
                  prev.set("category", "villain");
                  return prev; //preserving other params
                })
              }
            >
              Villains ({summary?.villainCount})
            </TabsTrigger>
          </TabsList>

          {/* Contenido: Todos los personajes con datos reales */}
          <TabsContent value="all">
            {/* todos los personajes */}
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>
          {/* Contenido: Favoritos (pendiente implementar filtro) */}
          <TabsContent value="favorites">
            {/* LOS FAVORITOS */}
            <HeroGrid heroes={sliceFavorites} />
          </TabsContent>
          {/* Contenido: Héroes (pendiente implementar filtro) */}
          <TabsContent value="heroes">
            {/* TODOS LOS HEROES */}
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>
          {/* Contenido: Villanos (pendiente implementar filtro) */}
          <TabsContent value="villains">
            {/* TODOS LOS VILLANOS */}
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>
        </Tabs>

        {/* Character Grid */}
        {/* <HeroGrid /> */}

        {/* Componente de paginación para navegar entre páginas */}
        {selectedTab === "favorites" ? (
          <CustomPagination totalPages={pagesFavorites || 1} />
        ) : (
          <CustomPagination totalPages={heroesResponse?.pages ?? 1} />
        )}
      </>
    </>
  );
};
