import React from 'react';

interface GridGeneratorProps {
  isGenerating: boolean;
  onToggleGenerate: () => void;
  biasChar: string;
  onBiasChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const GridGenerator: React.FC<GridGeneratorProps> = ({
  isGenerating,
  onToggleGenerate,
  biasChar,
  onBiasChange,
}) => (
  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
    <button
      onClick={onToggleGenerate}
      className={`px-4 py-2 rounded-md text-white font-semibold transition duration-300 ${
        isGenerating ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
      }`}
    >
      {isGenerating ? 'Stop Generator' : 'Start Generator'}
    </button>
    <input
      type="text"
      value={biasChar}
      onChange={onBiasChange}
      placeholder="Enter bias character"
      maxLength={1}
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default GridGenerator;

