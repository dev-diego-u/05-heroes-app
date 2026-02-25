// Importaciones necesarias para los tests
import { describe, expect, test, vi } from "vitest"; // Vitest para testear
import { renderHook, waitFor } from "@testing-library/react"; // Para testear hooks
import { useHeroSummary } from "./useHeroSummary"; // El hook a testear
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // React Query para manejo de datos
import { PropsWithChildren } from "react"; // Tipado para el wrapper
import { getSummaryAction } from "@/heroes/actions/get-summary.action"; // Acción a mockear
import { SummaryResponse } from "@/heroes/types/get-summary.response"; // Tipado de la respuesta

// Mockeamos la función getSummaryAction para controlar su comportamiento en los tests
vi.mock("@/heroes/actions/get-summary.action", () => ({
  getSummaryAction: vi.fn(),
}));

// Referencia tipada al mock para poder usar métodos como mockResolvedValue
const mockGetSummaryAction = vi.mocked(getSummaryAction);

// Valor por defecto para evitar advertencias de React Query
mockGetSummaryAction.mockResolvedValue({} as SummaryResponse);

// Provider personalizado para envolver el hook y proveerle un QueryClient limpio en cada test
const tanStackCustomProvider = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // No reintentar en tests para evitar esperas innecesarias
      },
    },
  });

  // Retorna un componente que provee el QueryClient a los hijos
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Grupo de tests para el hook useHeroSummary
describe("useHeroSummary", () => {
  // Test 1: Estado inicial del hook
  test("should return the initial state(isLoading)", () => {
    // Renderizamos el hook dentro del provider personalizado
    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(),
    });
    // Verificamos que el estado inicial sea el esperado
    expect(result.current.isLoading).toBe(true); // Debe estar cargando
    expect(result.current.data).toBeUndefined(); // No hay datos aún
    expect(result.current.error).toBeNull(); // No hay error
  });

  // Test 2: Estado de éxito cuando la llamada a la API es exitosa
  test("should return success state with data when API call succeeds", async () => {
    // Datos simulados que devolverá el mock
    const mockSummaryData = {
      totalHeroes: 10,
      strongestHero: {
        id: "1",
        name: "Superman",
      },
      smartestHero: {
        id: "2",
        name: "Batman",
      },
      heroCount: 18,
      villainCount: 7,
    } as SummaryResponse;

    // Configuramos el mock para que devuelva los datos simulados
    mockGetSummaryAction.mockResolvedValueOnce(mockSummaryData);

    // Renderizamos el hook
    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(), // Usamos el provider personalizado para cada test
    });

    // Esperamos a que el hook cambie a estado de éxito
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true); // Debe estar en éxito
      expect(result.current.data).toEqual(mockSummaryData); // Los datos deben ser los simulados
      expect(result.current.error).toBeNull(); // No debe haber error
    });

    expect(result.current.isError).toBe(false); // No debe estar en error
    expect(mockGetSummaryAction).toBeCalled(); // La función mockeada debe haber sido llamada
  });

  test("should return error state when API call fails", async () => {
    // Configuramos el mock para que devuelva un error
    const mockError = new Error("API Error");
    mockGetSummaryAction.mockRejectedValueOnce(mockError);
    // Renderizamos el hook
    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(), // Usamos el provider personalizado para cada test
    });

    // Esperamos a que el hook cambie a estado de error
    await waitFor(() => {
      expect(result.current.isError).toBe(true); // Debe estar en error
      expect(result.current.error).toEqual(mockError); // El error debe ser el simulado
      expect(result.current.data).toBeUndefined(); // No debe haber datos
    });
    expect(result.current.isSuccess).toBe(false); // No debe estar en éxito
    expect(mockGetSummaryAction).toBeCalled(); // La función mockeada debe haber sido llamada
  });
});
