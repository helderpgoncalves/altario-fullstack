import { FastifyInstance } from "fastify";

/**
 * Generates a 10x10 grid of random lowercase letters.
 * @param biasChar - Optional character to bias the grid towards (20% of cells).
 * @returns A 2D array representing the grid.
 */
function generateRandomGrid(biasChar: string | null = null): string[][] {
  // Create a 10x10 grid of random lowercase letters
  const grid = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26))
    )
  );

  // Apply 20% bias if a character is provided
  if (biasChar) {
    const biasCount = Math.floor(100 * 0.2); // 20% of 100 cells
    for (let i = 0; i < biasCount; i++) {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      grid[row][col] = biasChar;
    }
  }
  return grid;
}

/**
 * Calculates a two-digit code based on the occurrences of specific characters in the grid.
 * @param grid - The 2D array representing the grid.
 * @returns A two-digit string code.
 */
function calculateCode(grid: string[][]): string {
  const char1 = grid[3][6];
  const char2 = grid[6][3];

  const countChar1 = grid.flat().filter((char) => char === char1).length;
  const countChar2 = grid.flat().filter((char) => char === char2).length;

  const finalCount1 = countChar1 > 9 ? Math.floor(countChar1 / 2) : countChar1;
  const finalCount2 = countChar2 > 9 ? Math.floor(countChar2 / 2) : countChar2;

  return `${finalCount1}${finalCount2}`;
}

/**
 * Defines the routes for the grid functionality.
 * @param fastify - The Fastify instance.
 */
export async function gridRoutes(fastify: FastifyInstance) {
  fastify.get<{ Querystring: { bias?: string } }>("/grid", async (request, reply) => {
    const biasChar = request.query.bias || null;
    const grid = generateRandomGrid(biasChar);
    const code = calculateCode(grid);
    const seconds = new Date().getSeconds().toString().padStart(2, '0');

    return { grid, code, seconds };
  });
}
