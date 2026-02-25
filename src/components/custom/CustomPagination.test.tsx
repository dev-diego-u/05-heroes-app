import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { CustomPagination } from "./CustomPagination";
import { MemoryRouter } from "react-router";
import { PropsWithChildren } from "react";

const renderWithRouter = (
  component: React.ReactElement,
  initialEntries?: string[],
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>,
  );
};

//para que no sea tan ruidoso el test, mockeamos el componente Button
vi.mock("../ui/button", () => ({
  Button: ({ children, ...props }: PropsWithChildren) => (
    <button {...props}>{children}</button>
  ),
}));

describe("CustomPagination", () => {
  test("should render component with default values", () => {
    renderWithRouter(<CustomPagination totalPages={5} />);
    // screen.debug();
    expect(screen.getByText("Previous")).toBeDefined(); // Verificar que el botón "Previous" esté presente
    expect(screen.getByText("Next")).toBeDefined(); // Verificar que el botón "Next" esté presente
    expect(screen.getByText("1")).toBeDefined(); // Verificar que el botón de la página 1 esté presente
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
    expect(screen.getByText("4")).toBeDefined();
    expect(screen.getByText("5")).toBeDefined();
  });

  test("should disable Previous button on first page", () => {
    renderWithRouter(<CustomPagination totalPages={5} />);
    const previousButton = screen.getByText("Previous");
    // screen.debug();
    expect(previousButton.getAttributeNames()).toContain("disabled"); // Verificar que el botón "Previous" esté deshabilitado
  });

  test("should disable Next button on last page", () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ["/?page=5"]);
    const nextButton = screen.getByText("Next");
    // screen.debug();
    expect(nextButton.getAttributeNames()).toContain("disabled"); // Verificar que el botón "Next" esté deshabilitado
  });

  test("should disable button 3 when currentPage is 3", () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ["/?page=3"]);
    const pageButton1 = screen.getByText("3");
    const pageButton2 = screen.getByText("2");
    // screen.debug();
    expect(pageButton1.getAttribute("variant")).toBe("default"); // Verificar que el botón de la página 3 tenga el atributo "variant" establecido en "default"
    expect(pageButton2.getAttribute("variant")).toBe("outline"); // Verificar que el botón de la página 2 tenga el atributo "variant" establecido en "outline"
  });

  test("should change page when clicking on number button", () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ["/?page=3"]);
    const pageButton2 = screen.getByText("2");
    const pageButton1 = screen.getByText("3");
    expect(pageButton1.getAttribute("variant")).toBe("default");
    expect(pageButton2.getAttribute("variant")).toBe("outline");
    fireEvent.click(pageButton2);
    // screen.debug();
    expect(pageButton1.getAttribute("variant")).toBe("outline"); // Verificar que el botón de la página 3 tenga el atributo "variant" establecido en "outline" después de hacer clic en el botón de la página 2
    expect(pageButton2.getAttribute("variant")).toBe("default"); // Verificar que el botón de la página 2 tenga el atributo "variant" establecido en "default" después de hacer clic en él
  });
});
