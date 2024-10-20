export interface GridData {
  grid: string[][];
  code: string;
  seconds: number;
}

export const gridService = {
  generateRandomGrid(biasChar: string | null = null): string[][] {
    const gridSize = 10;
    const totalCells = gridSize ** 2;
    const grid: string[][] = createRandomGrid(gridSize, biasChar);

    if (biasChar) {
      addBiasCharacters(grid, biasChar, totalCells, gridSize);
    }

    return grid;
  },

  calculateCode(grid: string[][]): string {
    const char1 = grid[3][6];
    const char2 = grid[6][3];

    const countChar1 = grid.flat().filter((char) => char === char1).length;
    const countChar2 = grid.flat().filter((char) => char === char2).length;

    const finalCount1 = countChar1 > 9 ? Math.floor(countChar1 / 2) : countChar1;
    const finalCount2 = countChar2 > 9 ? Math.floor(countChar2 / 2) : countChar2;

    return `${finalCount1}${finalCount2}`;
  },

  generateGridData(biasChar: string | null = null): GridData {
    const grid = this.generateRandomGrid(biasChar);
    const code = this.calculateCode(grid);
    const seconds = new Date().getSeconds();

    return { grid, code, seconds };
  }
};

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
