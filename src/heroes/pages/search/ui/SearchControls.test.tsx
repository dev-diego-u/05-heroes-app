import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SearchControls } from "./SearchControls";
import { MemoryRouter } from "react-router";

// console.log(typeof window.ResizeObserver);
if (typeof window.ResizeObserver === "undefined") {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
}

const renderWithRouter = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SearchControls />
    </MemoryRouter>,
  );
};

describe("SearchControls", () => {
  test("should render searchControl with default values", async () => {
    const { container } = renderWithRouter();
    // // Busca el botón Filters
    expect(container).toMatchSnapshot();
  });

  test("should set input value when search param name is set", () => {
    renderWithRouter(["/?name=superman"]);
    const input = screen.getByPlaceholderText(
      "Search heroes, villains, powers, teams...",
    );
    // screen.debug(input);
    expect(input.getAttribute("value")).toBe("superman");
  });

  test("should change input value when input is changed and enter is pressed", () => {
    renderWithRouter(["/?name=superman"]);
    const input = screen.getByPlaceholderText(
      "Search heroes, villains, powers, teams...",
    );
    expect(input.getAttribute("value")).toBe("superman");

    fireEvent.change(input, { target: { value: "batman" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(input.getAttribute("value")).toBe("batman");
  });
  test("should change params strength when slider is changed", () => {
    renderWithRouter(["/?name=Batman&active-accordion=advance-filters"]);

    const slider = screen.getByRole("slider");

    expect(slider.getAttribute("aria-valuenow")).toBe("0");

    fireEvent.keyDown(slider, { key: "ArrowRight" });

    expect(slider.getAttribute("aria-valuenow")).toBe("1");
    // screen.debug(slider);
  });

  test("should accordion be open when active-accordion param is set", () => {
    renderWithRouter(["/?active-accordion=advance-filters"]);

    // Busca el acordeón por algún texto o atributo que indique que está abierto
    const accordion = screen.getByTestId("accordion");
    const accordionItem = accordion.querySelector("div");
    // screen.debug();
    expect(accordionItem?.getAttribute("data-state")).toBe("open");
  });

  test("should accordion be closed when active-accordion param is not set", () => {
    renderWithRouter(["/"]);

    const accordion = screen.getByTestId("accordion");
    const accordionItem = accordion.querySelector("div");
    // screen.debug();
    expect(accordionItem?.getAttribute("data-state")).toBe("closed");
  });
});
