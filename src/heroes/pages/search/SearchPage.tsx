import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { SearchControls } from "./ui/SearchControls";
import { CustomBreadCrumbs } from "@/components/custom/CustomBreadCrumbs";
import { useSearchParams } from "react-router";
import { useSearchHeroes } from "@/hooks/useSearchHeroes";
import { HeroGrid } from "@/heroes/components/HeroGrid";

export const SearchPage = () => {
  const [searchParams] = useSearchParams();

  //estraccion de parametros de busqueda
  const name = searchParams.get("name") || "";
  const strength = searchParams.get("strength") || "0";
  const { data: searchResponse } = useSearchHeroes({ name, strength });
  // console.log(searchResponse);
  return (
    <>
      {/* Jumbotron */}
      <CustomJumbotron
        title="Search Heroes"
        description="Explore y gestiona tu colección de héroes y villanos favoritos."
      />

      {/* Breadcrumbs */}
      <CustomBreadCrumbs pageName="Buscar" />

      {/* Stats Dashboard */}
      <HeroStats />

      {/* Controls */}
      <SearchControls />

      {/* Search Results */}
      <HeroGrid heroes={searchResponse || []} />
    </>
  );
};

export default SearchPage;
