import React from "react";
import Grid from "../components/Grid";
import GridGenerator from "../components/GridGenerator";
import CodeDisplay from "../components/CodeDisplay";
import { useGridContext } from "../contexts/GridContext";

const GridScreen: React.FC = () => {
  const { gridData, isGenerating, startGenerating, stopGenerating, biasChar, handleBiasChange } = useGridContext();

  const handleStartStop = () => {
    if (!isGenerating) {
      startGenerating();
    } else {
      stopGenerating();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        10x10 Grid Generator
      </h1>
      <GridGenerator
        isGenerating={isGenerating}
        onToggleGenerate={handleStartStop}
        biasChar={biasChar}
        onBiasChange={handleBiasChange}
      />
      {gridData.grid.length > 0 && <Grid grid={gridData.grid} biasChar={biasChar} />}
      {gridData.code && <CodeDisplay code={gridData.code} />}
    </div>
  );
};

export default GridScreen;
