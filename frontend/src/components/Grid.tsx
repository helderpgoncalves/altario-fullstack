import React from 'react';

interface GridProps {
  grid: string[][];
  biasChar?: string;
}

const Grid: React.FC<GridProps> = ({ grid, biasChar }) => (
  <div className="grid grid-cols-10 gap-0.5 sm:gap-1 p-1 sm:p-2 bg-gray-800 rounded-md">
    {grid.map((row, rowIndex) =>
      row.map((cell, cellIndex) => (
        <div
          key={`${rowIndex}-${cellIndex}`}
          className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-sm shadow-sm text-xs sm:text-sm md:text-base ${
            cell === biasChar ? 'bg-yellow-300' : 'bg-white'
          }`}
        >
          {cell}
        </div>
      ))
    )}
  </div>
);

export default Grid;
