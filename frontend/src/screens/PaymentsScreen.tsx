import React from "react";
import { useGridContext } from "../contexts/GridContext";

const PaymentsScreen: React.FC = () => {
  const { gridData } = useGridContext();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Current Code: {gridData.code}</h2>
      {/* Payment form and list will be added here */}
    </div>
  );
};

export default PaymentsScreen;
