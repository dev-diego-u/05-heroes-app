import { describe, expect, test, vi } from "vitest";
import { getSummaryAction } from "./get-summary.action";
import { heroApi } from "../api/hero.api";

describe("getSummaryAction", () => {
  test("should fetch summary and return complete information", async () => {
    const mockSummary = {
      totalHeroes: 25,
      strongestHero: {
        id: "1",
        name: "Clark Kent",
        slug: "clark-kent",
        alias: "Superman",
        powers: [
          "Súper fuerza",
          "Vuelo",
          "Visión de calor",
          "Visión de rayos X",
          "Invulnerabilidad",
          "Súper velocidad",
        ],
        description:
          "El Último Hijo de Krypton, protector de la Tierra y símbolo de esperanza para toda la humanidad.",
        strength: 10,
        intelligence: 8,
        speed: 9,
        durability: 10,
        team: "Liga de la Justicia",
        image: "1.jpeg",
        firstAppearance: "1938",
        status: "Active",
        category: "Hero",
        universe: "DC",
      },
      smartestHero: {
        id: "2",
        name: "Bruce Wayne",
        slug: "bruce-wayne",
        alias: "Batman",
        powers: [
          "Artes marciales",
          "Habilidades de detective",
          "Tecnología avanzada",
          "Sigilo",
          "Genio táctico",
        ],
        description:
          "El Caballero Oscuro de Ciudad Gótica, que utiliza el miedo como arma contra el crimen y la corrupción.",
        strength: 6,
        intelligence: 10,
        speed: 6,
        durability: 7,
        team: "Liga de la Justicia",
        image: "2.jpeg",
        firstAppearance: "1939",
        status: "Active",
        category: "Hero",
        universe: "DC",
      },
      heroCount: 18,
      villainCount: 7,
    };

    vi.spyOn(heroApi, "get").mockResolvedValueOnce({ data: mockSummary });

    const summary = await getSummaryAction();
    expect(summary).toBeDefined();
    expect(summary).toStrictEqual(mockSummary);
  });
});
