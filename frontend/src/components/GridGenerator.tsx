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
  <div className="flex flex-col space-y-3 mb-4 w-full max-w-xs mx-auto">
    <button
      onClick={onToggleGenerate}
      className={`w-full px-3 py-2 rounded-md text-white font-semibold transition duration-300 text-base ${
        isGenerating ? 'bg-red-500 hover:bg-red-600 active:bg-red-700' : 'bg-green-500 hover:bg-green-600 active:bg-green-700'
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
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
    />
  </div>
);

export default GridGenerator;
