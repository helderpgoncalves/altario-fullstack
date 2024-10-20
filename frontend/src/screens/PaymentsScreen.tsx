import React, { useState, useEffect } from "react";
import { useGridContext } from "../contexts/GridContext";
import { fetchPayments, createPayment } from "../api/payments";
import { Payment } from "../types";
import CodeDisplay from "../components/CodeDisplay";
import PaymentForm from "../components/PaymentForm";
import PaymentTable from "../components/PaymentTable";
import { sendWebSocketMessage } from "../websocket/connection";

const PaymentsScreen: React.FC = () => {
  const { gridData } = useGridContext();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    const handleWebSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "PAYMENT_ADDED") {
        setPayments((prevPayments) => [...prevPayments, data.payload]);
      }
    };

    window.addEventListener("message", handleWebSocketMessage);
    return () => {
      window.removeEventListener("message", handleWebSocketMessage);
    };
  }, []);

  const loadPayments = async () => {
    try {
      const fetchedPayments = await fetchPayments();
      if (Array.isArray(fetchedPayments)) {
        setPayments(fetchedPayments);
      } else {
        console.error("Fetched payments is not an array:", fetchedPayments);
        setError("Invalid data received from API");
      }
    } catch (error) {
      console.error("Error loading payments:", error);
      setError("Failed to load payments. Please try again later.");
    }
  };

  const handleSubmit = async (name: string, amount: number) => {
    try {
      sendWebSocketMessage({
        type: "ADD_PAYMENT",
        payload: {
          name,
          amount,
          code: gridData.code,
          grid: gridData.grid,
        },
      });
    } catch (error) {
      console.error("Error creating payment:", error);
      setError("Failed to create payment. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mx-auto mt-16">
        <CodeDisplay code={gridData.code} />
        <PaymentForm onSubmit={handleSubmit} gridData={gridData} />
      </div>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {Array.isArray(payments) && payments.length > 0 ? (
        <PaymentTable payments={payments} />
      ) : (
        <p className="text-center text-gray-500">No payments available.</p>
      )}
    </div>
  );
};

export default PaymentsScreen;
