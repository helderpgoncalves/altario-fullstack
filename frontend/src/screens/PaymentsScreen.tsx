import React, { useState, useEffect } from "react";
import { useGridContext } from "../contexts/GridContext";

const PaymentsScreen: React.FC = () => {
  const { gridData } = useGridContext();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // TODO: Fetch payments from API
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Current Code: {gridData.code}</h2>
      {/* TODO: Add payment form */}
      {/* TODO: Add payments list */}
    </div>
  );
};

export default PaymentsScreen;
