import { FastifyInstance } from "fastify";

/**
 * Generates a 10x10 grid of random lowercase letters, optionally biased towards a specific character.
 *
 * @param {string | null} biasChar - Optional character to bias the grid towards. If provided, approximately 20% of the cells will contain this character.
 * @returns {string[][]} A 2D array representing the 10x10 grid of lowercase letters.
 */
function generateRandomGrid(biasChar: string | null = null): string[][] {
  const gridSize = 10;
  const totalCells = gridSize ** 2; // Total number of cells in the grid
  const grid: string[][] = createRandomGrid(gridSize, biasChar);

  if (biasChar) {
    addBiasCharacters(grid, biasChar, totalCells, gridSize);
  }

  return grid;
}

/**
 * Creates a 10x10 grid filled with random lowercase letters.
 *
 * @param {number} gridSize - The size of the grid (10).
 * @param {string | null} biasChar - Character to avoid in the initial grid.
 * @returns {string[][]} A 2D array filled with random letters.
 */
function createRandomGrid(gridSize: number, biasChar: string | null): string[][] {
  return Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => {
      let char;
      do {
        char = String.fromCharCode(97 + Math.floor(Math.random() * 26));
      } while (char === biasChar);
      return char;
    })
  );
}

/**
 * Adds the bias character to the grid at random positions.
 *
 * @param {string[][]} grid - The 2D array representing the grid.
 * @param {string} biasChar - The character to be added.
 * @param {number} totalCells - Total number of cells in the grid.
 * @param {number} gridSize - The size of the grid (10).
 */
function addBiasCharacters(grid: string[][], biasChar: string, totalCells: number, gridSize: number): void {
  const targetBiasCount = Math.floor(totalCells * 0.2);
  const biasPositions = new Set<number>();

  while (biasPositions.size < targetBiasCount) {
    const position = Math.floor(Math.random() * totalCells);
    if (!biasPositions.has(position)) {
      biasPositions.add(position);
      const row = Math.floor(position / gridSize);
      const col = position % gridSize;
      grid[row][col] = biasChar;
    }
  }
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
  let lastBiasRequestTime: number | null = null;

  fastify.get<{ Querystring: { bias?: string } }>(
    "/grid",
    async (request, reply) => {
      const biasChar = request.query.bias || null;

      // Check the timestamp for bias requests
      if (biasChar) {
        const now = Date.now();
        if (lastBiasRequestTime && now - lastBiasRequestTime < 4000) {
          return reply.status(429).send({
            error:
              "Too many requests. Please wait 4 seconds between bias requests.",
          });
        }
        lastBiasRequestTime = now; // Update the timestamp
      }

      const grid = generateRandomGrid(biasChar);
      const code = calculateCode(grid);
      const seconds = new Date().getSeconds(); // Change here

      return { grid, code, seconds };
    }
  );
}
