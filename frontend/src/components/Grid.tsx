import React from 'react';

interface GridProps {
  grid: string[][];
}

const Grid: React.FC<GridProps> = ({ grid }) => (
  <div className="grid grid-cols-10 gap-1 p-2 bg-gray-200 rounded-md">
    {grid.map((row, rowIndex) =>
      row.map((cell, cellIndex) => (
        <div
          key={`${rowIndex}-${cellIndex}`}
          className="w-12 h-12 flex items-center justify-center bg-white rounded-sm shadow-sm"
        >
          {cell}
        </div>
      ))
    )}
  </div>
);

export default Grid;
