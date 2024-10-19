import React, { useState } from "react";
import { useGridContext } from "../contexts/GridContext";
import CodeDisplay from "../components/CodeDisplay";

const PaymentsScreen: React.FC = () => {
  const { gridData } = useGridContext();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save payment
    console.log("Payment submitted:", {
      name,
      code: gridData.code,
      grid: gridData.grid,
    });
    setName("");
    setAmount("");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <CodeDisplay code={gridData.code} />
      <div className="flex flex-col items-center mt-2">
        <form onSubmit={handleSubmit} className="mb-8">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Payment Name"
            className="mr-2 p-2 border rounded"
            required
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="mr-2 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-purple-500 text-white p-2 rounded"
          >
            Add Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentsScreen;
