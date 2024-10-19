import React, { useState } from "react";
import { Payment } from "../types";
import GridModal from "./GridModal";

interface PaymentTableProps {
  payments: Payment[];
}

interface PaymentTableProps {
  payments: Payment[];
}

const PaymentTable: React.FC<PaymentTableProps> = ({ payments }) => {
  const [selectedGrid, setSelectedGrid] = useState<string[][] | null>(null);

  const openGridModal = (grid: string[][]) => {
    setSelectedGrid(grid);
  };

  const closeGridModal = () => {
    setSelectedGrid(null);
  };

  return (
    <>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Code</th>
              <th className="py-3 px-6 text-left">Grid</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{payment.name}</td>
                <td className="py-3 px-6 text-left">${payment.amount.toFixed(2)}</td>
                <td className="py-3 px-6 text-left">
                  <div className="truncate max-w-xs">{payment.code}</div>
                </td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => openGridModal(payment.grid)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    100
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <GridModal
        isOpen={selectedGrid !== null}
        onClose={closeGridModal}
        grid={selectedGrid || []}
      />
    </>
  );
};

export default PaymentTable;
