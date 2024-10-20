import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { GridData, Payment } from "../types";
import {
  connectWebSocket,
  sendWebSocketMessage,
} from "../websocket/connection";
import { v4 as uuidv4 } from "uuid";

/**
 * Interface defining the shape of the GridContext
 */
interface GridContextType {
  gridData: GridData;
  isGenerating: boolean;
  biasChar: string;
  payments: Payment[];
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  handleBiasChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  startGenerating: () => void;
  stopGenerating: () => void;
  addPayment: (name: string, amount: number) => void;
}

const initialGridData: GridData = { grid: [], code: "", seconds: 0 };

const GridContext = createContext<GridContextType>({
  gridData: initialGridData,
  isGenerating: false,
  biasChar: "",
  payments: [],
  setIsGenerating: () => {},
  handleBiasChange: () => {},
  startGenerating: () => {},
  stopGenerating: () => {},
  addPayment: () => {},
});

/**
 * Custom hook to use the GridContext
 */
export const useGridContext = () => useContext(GridContext);

/**
 * GridProvider component to wrap the application and provide GridContext
 */
export const GridProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gridData, setGridData] = useState<GridData>(initialGridData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [biasChar, setBiasChar] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);

  /**
   * Refreshes the grid by sending a START_GENERATOR message
   */
  const refreshGrid = useCallback(() => {
    if (isGenerating) {
      sendWebSocketMessage({ type: "START_GENERATOR", payload: { biasChar } });
    }
  }, [isGenerating, biasChar]);

  useEffect(() => {
    /**
     * Handles incoming WebSocket messages
     */
    const handleWebSocketMessage = (data: any) => {
      switch (data.type) {
        case "GRID_UPDATE":
          setGridData(data.payload);
          break;
        case "PAYMENTS_LIST":
          setPayments(data.payload);
          break;
      }
    };

    connectWebSocket(handleWebSocketMessage);

    // Fetch initial payments
    sendWebSocketMessage({ type: "GET_PAYMENTS" });
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isGenerating) {
      intervalId = setInterval(refreshGrid, 2000);
    }
    return () => clearInterval(intervalId);
  }, [isGenerating, refreshGrid]);

  /**
   * Handles changes to the bias character input
   */
  const handleBiasChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    if (value.length <= 1 && /^[a-z]*$/.test(value)) {
      setBiasChar(value);
    }
  };

  /**
   * Starts the grid generation process
   */
  const startGenerating = () => {
    setIsGenerating(true);
    sendWebSocketMessage({ type: "START_GENERATOR", payload: { biasChar } });
  };

  /**
   * Stops the grid generation process
   */
  const stopGenerating = () => {
    setIsGenerating(false);
    sendWebSocketMessage({ type: "STOP_GENERATOR" });
  };

  /**
   * Adds a new payment to the list
   */
  const addPayment = useCallback(
    (name: string, amount: number) => {
      const newPayment: Payment = {
        id: uuidv4(),
        name,
        amount,
        code: gridData.code,
        grid: gridData.grid,
      };

      setPayments((prevPayments) => {
        const existingPayment = prevPayments.find(
          (p) =>
            p.name === name && p.amount === amount && p.code === gridData.code
        );

        if (existingPayment) return prevPayments;
        return [...prevPayments, newPayment];
      });

      sendWebSocketMessage({ type: "ADD_PAYMENT", payload: newPayment });
    },
    [gridData]
  );

  const contextValue: GridContextType = {
    gridData,
    isGenerating,
    biasChar,
    payments,
    setIsGenerating,
    handleBiasChange,
    startGenerating,
    stopGenerating,
    addPayment,
  };

  return (
    <GridContext.Provider value={contextValue}>{children}</GridContext.Provider>
  );
};
