import { describe, expect, test } from "vitest";
import { getHeroAction } from "./get-hero.action";

describe("getHeroAction", () => {
  test("should fetch hero data and return with complete image url", async () => {
    // Usa un ID válido de héroe, por ejemplo "batman" o el que tengas en tu mock/API
    const { image } = await getHeroAction("batman");
    expect(image).toBeDefined();
  });

  test("should throw an error if hero is not found", () => {});
});
