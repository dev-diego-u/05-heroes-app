import { beforeEach, describe, expect, test } from "vitest";
import { getHeroesByPageAction } from "./get-heroes-by-page.action";
import AxiosMockAdapter from "axios-mock-adapter";
import { heroApi } from "../api/hero.api";
const BASE_URL = import.meta.env.VITE_API_URL;

describe("getHeroesByPageAction", () => {
  const heroesApiMock = new AxiosMockAdapter(heroApi);
  beforeEach(() => {
    heroesApiMock.reset();
  });
  test("should return default heroes ", async () => {
    // console.log(BASE_URL);
    heroesApiMock.onGet("/").reply(200, {
      heroes: [
        {
          id: 1,
          name: "Hero 1",
          image: "hero1.jpg",
          category: "all",
        },
        {
          id: 2,
          name: "Hero 2",
          image: "hero2.jpg",
          category: "all",
        },
      ],
      total: 2,
      pages: 1,
    });
    const response = await getHeroesByPageAction({});
    // console.log(response);
    expect(response).toStrictEqual({
      heroes: [
        {
          id: 1,
          name: "Hero 1",
          image: `${BASE_URL}/images/hero1.jpg`,
          category: "all",
        },
        {
          id: 2,
          name: "Hero 2",
          image: `${BASE_URL}/images/hero2.jpg`,
          category: "all",
        },
      ],
      total: 2,
      pages: 1,
    });
  });

  test("should return the correct heroes when page is not a number", async () => {
    const reponseObject = {
      total: 2,
      pages: 1,
      heroes: [],
    };

    heroesApiMock.onGet("/").reply(200, reponseObject);
    const response = await getHeroesByPageAction({ page: NaN });
    const request = heroesApiMock.history;
    // console.log(request);
    const params = request[0].params;
    expect(params).toEqual({
      limit: 6,
      offset: 0,
      category: "all",
    });
  });

  test("should call the api with correct parameters", async () => {
    const reponseObject = {
      total: 2,
      pages: 1,
      heroes: [],
    };
    heroesApiMock.onGet("/").reply(200, reponseObject);
    const response = await getHeroesByPageAction({
      page: 2,
      limit: 5,
      category: "super",
    });
    const request = heroesApiMock.history;
    const params = request[0].params;
    expect(params).toEqual({
      limit: 5,
      offset: 5,
      category: "super",
    });
  });
});
