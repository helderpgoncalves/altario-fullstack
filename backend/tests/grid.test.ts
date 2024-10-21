import Fastify from "fastify";
import fp from "fastify-plugin";
import { gridRoutes } from "../src/routes/grid";

function build() {
  const app = Fastify();

  beforeAll(async () => {
    void app.register(fp(gridRoutes));
    await app.ready();
  });

  afterAll(() => app.close());

  return app;
}

describe("Grid Routes", () => {
  const app = build();

  test("should return a 10x10 grid, a code, and seconds", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/grid",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.grid).toHaveLength(10);
    expect(body.grid[0]).toHaveLength(10);
    expect(typeof body.code).toBe("string");
    expect(body.code.length).toBe(2);
    expect(typeof body.seconds).toBe("number");
    expect(body.seconds).toBeGreaterThanOrEqual(0);
    expect(body.seconds).toBeLessThan(60);
  });

  test("should return a biased grid when bias character is provided", async () => {
    const biasChar = 'z';
    const response = await app.inject({
      method: "GET",
      url: `/grid?bias=${biasChar}`,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.grid).toHaveLength(10);
    expect(body.grid[0]).toHaveLength(10);

    // Check that the grid contains exactly 20% bias characters (20 out of 100 cells)
    const flatGrid = body.grid.flat();
    const totalCells = flatGrid.length;
    const biasCharCount = flatGrid.filter((char: string) => char === biasChar).length;

    expect(totalCells).toBe(100);
    expect(biasCharCount).toBe(20);

    // Check that the remaining characters are random and not all the same
    const nonBiasChars = flatGrid.filter((char: string) => char !== biasChar);
    const uniqueNonBiasChars = new Set(nonBiasChars);
    expect(uniqueNonBiasChars.size).toBeGreaterThan(1);
  });

  test("should generate correct code based on grid and seconds", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/grid",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);

    const char1 = body.grid[3][6];
    const char2 = body.grid[6][3];

    const flatGrid = body.grid.flat();
    let count1 = flatGrid.filter((char: string) => char === char1).length;
    let count2 = flatGrid.filter((char: string) => char === char2).length;

    // Apply exception rule
    while (count1 > 9) count1 = Math.floor(count1 / 2);
    while (count2 > 9) count2 = Math.floor(count2 / 2);

    const expectedCode = `${count1}${count2}`;
    expect(body.code).toBe(expectedCode);
  });

  test("should reject requests with bias parameter if less than 4 seconds have passed", async () => {
    // First request
    await app.inject({
      method: "GET",
      url: "/grid?bias=a",
    });

    // Second request immediately after
    const response = await app.inject({
      method: "GET",
      url: "/grid?bias=b",
    });

    expect(response.statusCode).toBe(429); // Too Many Requests
    const body = JSON.parse(response.body);
    expect(body.error).toBe(
      "Too many requests. Please wait 4 seconds between bias requests."
    );
  });
});
