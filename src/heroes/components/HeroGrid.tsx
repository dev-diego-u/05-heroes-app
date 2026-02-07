import { Hero } from "../types/hero.interface";
import { HeroGridCard } from "./HeroGridCard";

export interface Props {
  heroes: Hero[];
}

export const HeroGrid = ({ heroes }: Props) => {
  // console.log("Heroes recibidos:", heroes);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {/* Hero Card 1 - Superman */}

        {heroes?.map((hero) => (
          <HeroGridCard key={hero.id} hero={hero} />
        ))}

        {/* Hero Card 2 - Batman */}
        {/* <HeroGridCard /> */}
        {/* Hero Card 3 - Wonder Woman */}
        {/* <HeroGridCard /> */}
        {/* Hero Card 4 - Flash */}
        {/* <HeroGridCard /> */}
        {/* Hero Card 5 - Green Lantern */}
        {/* <HeroGridCard /> */}
        {/* Hero Card 6 - Aquaman */}
        {/* <HeroGridCard /> */}
      </div>
    </>
  );
};
