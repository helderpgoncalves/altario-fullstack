import React, { useEffect, useState, useCallback } from 'react';
import Grid from './components/Grid';
import GridGenerator from './components/GridGenerator';
import CodeDisplay from './components/CodeDisplay';

interface GridData {
  grid: string[][];
  code: string;
}

const API_URL = 'http://localhost:3000';
const UPDATE_INTERVAL = 2000; // 2 seconds

const App: React.FC = () => {
  const [gridData, setGridData] = useState<GridData>({ grid: [], code: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [biasChar, setBiasChar] = useState('');

  const fetchGridData = useCallback(async () => {
    try {
      const url = new URL(`${API_URL}/grid`);
      if (biasChar) url.searchParams.append('bias', biasChar);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Network response was not ok');

      const data: GridData = await response.json();
      setGridData(data);
    } catch (error) {
      console.error('Error fetching grid data:', error);
    }
  }, [biasChar]);

  useEffect(() => {
    if (!isGenerating) return;

    const intervalId = setInterval(fetchGridData, UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [isGenerating, fetchGridData]);

  const handleStartStop = () => setIsGenerating(prev => !prev);

  const handleBiasChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    if (value.length <= 1 && /^[a-z]*$/.test(value)) {
      setBiasChar(value);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        10x10 Grid Generator
      </h1>
      <GridGenerator
        isGenerating={isGenerating}
        onToggleGenerate={handleStartStop}
        biasChar={biasChar}
        onBiasChange={handleBiasChange}
      />
      {gridData.grid.length > 0 && <Grid grid={gridData.grid} />}
      {gridData.code && <CodeDisplay code={gridData.code} />}
    </div>
  );
};

export default App;
