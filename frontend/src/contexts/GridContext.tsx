import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { GridData } from "../types";
import { sendWebSocketMessage } from "../websocket/connection";

interface GridContextType {
  gridData: GridData;
  isGenerating: boolean;
  biasChar: string;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  handleBiasChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const API_URL = 'http://localhost:3000';
const UPDATE_INTERVAL = 2000; // 2 seconds

const GridContext = createContext<GridContextType>({
  gridData: { grid: [], code: '' },
  isGenerating: false,
  biasChar: '',
  setIsGenerating: () => {},
  handleBiasChange: () => {},
});

export const useGridContext = () => useContext(GridContext);

export const GridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const handleBiasChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    if (value.length <= 1 && /^[a-z]*$/.test(value)) {
      setBiasChar(value);
    }
  };

  const startGenerating = () => {
    setIsGenerating(true);
    sendWebSocketMessage({ type: "START_GENERATOR" });
  };

  useEffect(() => {
    const handleWebSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "GRID_UPDATE") {
        setGridData(data.payload);
      }
    };

    window.addEventListener("message", handleWebSocketMessage);
    return () => {
      window.removeEventListener("message", handleWebSocketMessage);
    };
  }, []);

  return (
    <GridContext.Provider 
      value={{ 
        gridData, 
        isGenerating, 
        biasChar, 
        setIsGenerating, 
        handleBiasChange 
      }}
    >
      {children}
    </GridContext.Provider>
  );
};
