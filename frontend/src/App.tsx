import React, { useEffect, useState, useCallback } from 'react';
import Grid from './components/Grid';
import GridGenerator from './components/GridGenerator';
import CodeDisplay from './components/CodeDisplay';

interface GridData {
  grid: string[][];
  code: string;
}

const App: React.FC = () => {
  const [gridData, setGridData] = useState<GridData>({ grid: [], code: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [biasChar, setBiasChar] = useState('');

  const fetchGridData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/grid${biasChar ? `?bias=${biasChar}` : ''}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setGridData(data);
    } catch (error) {
      console.error('Error fetching grid data:', error);
    }
  }, [biasChar]);

  useEffect(() => {
    let intervalId: number;

    if (isGenerating) {
      fetchGridData();
      intervalId = window.setInterval(fetchGridData, 1000);
    }

    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
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
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-blue-600">10x10 Grid Generator</h1>
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
