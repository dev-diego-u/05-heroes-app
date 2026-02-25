import { describe, expect, test, vi } from "vitest";
import { appRouter } from "./app.router";
import { render, screen } from "@testing-library/react";
import {
  RouterProvider,
  Outlet,
  createMemoryRouter,
  useParams,
} from "react-router";

vi.mock("@/heroes/pages/home/HomePage", () => ({
  HomePage: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock("@/heroes/layouts/HeroesLayout", () => ({
  HeroesLayout: () => (
    <div data-testid="heroes-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock("@/heroes/pages/hero/HeroPage", () => ({
  HeroPage: () => {
    const { idSlug = "" } = useParams();
    return <div data-testid="hero-page">Hero Page {idSlug}</div>;
  },
}));

vi.mock("@/heroes/pages/search/SearchPage", () => ({
  default: () => <div data-testid="search-page"></div>,
}));

describe("AppRouter", () => {
  test("should be configured as expected", () => {
    // console.log(appRouter.routes);
    expect(appRouter.routes).toMatchSnapshot();
  });

  test("should render home page at root path", () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={router} />);
    // screen.debug();
    expect(screen.getByTestId("home-page")).toBeDefined();
  });

  test("should render hero page at /hero/:idSlug path", () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ["/hero/superman"],
    });
    render(<RouterProvider router={router} />);
    // screen.debug();
    expect(screen.getByTestId("hero-page").textContent).toBe(
      "Hero Page superman",
    );
  });

  test("should render search page at /search path", async () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ["/search"],
    });
    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId("search-page")).toBeDefined();
    // screen.debug();
  });

  test("should redirect  to home page for unknown paths", () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ["/unknown"],
    });
    render(<RouterProvider router={router} />);
    // screen.debug();
    expect(screen.getByTestId("home-page")).toBeDefined();
  });
});
