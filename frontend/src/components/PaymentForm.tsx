import React, { useState } from "react";
import { GridData } from "../types";

interface PaymentFormProps {
  onSubmit: (name: string, amount: number) => void;
  gridData: GridData;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, gridData }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(name, parseFloat(amount));
    setName("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-4 sm:space-y-0 sm:flex sm:items-end sm:space-x-4">
      <div className="flex-grow space-y-4 sm:space-y-0 sm:flex sm:space-x-4 mt-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Payment Name"
          className="w-full p-3 border rounded-lg text-base"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-full p-3 border rounded-lg text-base"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto bg-purple-500 text-white p-3 rounded-lg text-base font-semibold disabled:opacity-50 hover:bg-purple-600 transition-colors"
        disabled={!name || !amount || !gridData.code}
      >
        Add Payment
      </button>
    </form>
  );
};

export default PaymentForm;

