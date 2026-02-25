import type { PropsWithChildren } from "react"; // Tipado para el wrapper
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { usePaginatedHero } from "./usePaginatedHero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // React Query para manejo de datos
import { getHeroesByPageAction } from "@/heroes/actions/get-heroes-by-page.action";
import { beforeEach } from "vitest";

vi.mock("@/heroes/actions/get-heroes-by-page.action", () => ({
  getHeroesByPageAction: vi.fn(),
})); // Mock del módulo de acciones

const mockGetHeroesByPageAction = vi.mocked(getHeroesByPageAction); // Tipado del mock
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // No reintentar en tests para evitar esperas innecesarias
    },
  },
});

// Provider personalizado para envolver el hook y proveerle un QueryClient limpio en cada test
const tanStackCustomProvider = () => {
  // Retorna un componente que provee el QueryClient a los hijos
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePaginatedHero", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Limpiar mocks antes de cada test para evitar interferencias
    queryClient.clear(); // Limpiar el cache de React Query antes de cada test para evitar interferencias
  });

  // Test 1: Estado inicial del hook
  test("should return the initial state(isLoading)", () => {
    // Renderizamos el hook dentro del provider personalizado
    const { result } = renderHook(
      () => usePaginatedHero({ page: 1, limit: 10 }),
      {
        wrapper: tanStackCustomProvider(),
      },
    );
    // Verificamos que el estado inicial sea el esperado
    expect(result.current.isLoading).toBe(true); // Debe estar cargando
    expect(result.current.data).toBeUndefined(); // No hay datos aún
    expect(result.current.error).toBeNull(); // No hay error
  });

  test("should return success state with data when API call is successful", async () => {
    const mockData = {
      heroes: [],
      total: 2,
      pages: 1,
    };
    // Configuramos el mock para que devuelva datos simulados
    mockGetHeroesByPageAction.mockResolvedValue(mockData);

    const { result } = renderHook(
      () => usePaginatedHero({ page: 1, limit: 10 }),
      {
        wrapper: tanStackCustomProvider(),
      },
    );

    // Esperamos a que el hook actualice su estado a éxito
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true); // Debe haber éxito
      expect(result.current.data).toBeDefined();
      expect(result.current.error).toBeNull(); // No debe haber error
      // console.log(result.current.data);
    });

    expect(result.current.status).toBe("success"); // El estado debe ser "success"
    expect(result.current.data).toEqual(mockData); // Los datos deben ser los simulados
    expect(mockGetHeroesByPageAction).toBeCalled();
    expect(mockGetHeroesByPageAction).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      category: "all",
    }); // Verificamos que se llamó con los parámetros correctos
  });

  test("should return error state when API call fails", async () => {
    const mockError = new Error("Failed to fetch heroes");
    // Configuramos el mock para que devuelva un error simulado
    mockGetHeroesByPageAction.mockRejectedValue(mockError);
    const { result } = renderHook(
      () => usePaginatedHero({ page: 1, limit: 10, category: "heroes" }),
      {
        wrapper: tanStackCustomProvider(),
      },
    );
    // Esperamos a que el hook actualice su estado a error
    await waitFor(() => {
      expect(result.current.isError).toBe(true); // Debe haber error
      expect(result.current.data).toBeUndefined(); // No debe haber datos
      expect(result.current.error).toEqual(mockError); // El error debe ser el simulado
    });
    expect(result.current.status).toBe("error"); // El estado debe ser "error"
    expect(mockGetHeroesByPageAction).toBeCalled();
    expect(mockGetHeroesByPageAction).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      category: "heroes",
    }); // Verificamos que se llamó con los parámetros correctos
  });
});
