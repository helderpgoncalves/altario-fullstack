import React from "react";
import { useGridContext } from "../contexts/GridContext";
import CodeDisplay from "../components/CodeDisplay";
import PaymentForm from "../components/PaymentForm";
import PaymentTable from "../components/PaymentTable";

const PaymentsScreen: React.FC = () => {
  const { gridData, payments, addPayment } = useGridContext();

  const handleSubmit = async (name: string, amount: number) => {
    await addPayment(name, amount);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <h1 className="text-3xl font-bold">Payments</h1>
      <CodeDisplay code={gridData.code} />
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add Payment</h2>
        <PaymentForm onSubmit={handleSubmit} gridData={gridData} />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
        <PaymentTable payments={payments} />
      </div>
    </div>
  );
};

export default PaymentsScreen;
