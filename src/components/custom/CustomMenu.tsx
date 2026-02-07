import { Link, useLocation } from "react-router";
import { NavigationMenu, NavigationMenuList } from "../ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";

export const CustomMenu = () => {
  const { pathname } = useLocation();
  // console.log(pathname);
  const isActive = (path: string) => pathname === path;
  return (
    <>
      <NavigationMenu className="py-5">
        <NavigationMenuList className="flex gap-6">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary pb-1",
                  isActive("/")
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                )}
              >
                Inicio
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/search"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary pb-1",
                  isActive("/search")
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                )}
              >
                Buscar
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};
