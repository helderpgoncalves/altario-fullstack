import React from 'react';
import Grid from './Grid';

interface GridModalProps {
  isOpen: boolean;
  onClose: () => void;
  grid: string[][];
}

const GridModal: React.FC<GridModalProps> = ({ isOpen, onClose, grid }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full">
        <h2 className="text-xl font-bold mb-4">Grid View</h2>
        <Grid grid={grid} biasChar="" />
        <button
          onClick={onClose}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default GridModal;

