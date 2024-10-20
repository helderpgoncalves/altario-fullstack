import { v4 as uuidv4 } from "uuid";
import { websocketHandlers } from "../websocket/handlers";

export interface Payment {
  id: string;
  name: string;
  amount: number;
  code: string;
  grid: string[][];
  createdAt: Date;
}

export type PaymentInput = Omit<Payment, "id" | "createdAt">;
export type PaymentUpdate = Partial<Pick<Payment, "name" | "amount">>;

let payments: Payment[] = [];

// Load initial payments from a file or database here
// For simplicity, we'll just keep it in memory for now, but in a real application,
// you'd want to persist this data

export const paymentService = {
  getAllPayments: (): Payment[] => payments,

  createPayment: (input: PaymentInput): Payment => {
    const newPayment: Payment = {
      id: uuidv4(),
      ...input,
      name: input.name.trim(),
      code: input.code.trim(),
      createdAt: new Date(),
    };
    payments.push(newPayment);
    return newPayment;
  },

  getPaymentById: (id: string): Payment | undefined =>
    payments.find((p) => p.id === id),

  updatePayment: (id: string, updateData: PaymentUpdate): Payment | undefined => {
    const paymentIndex = payments.findIndex((p) => p.id === id);
    if (paymentIndex === -1) return undefined;
    payments[paymentIndex] = { ...payments[paymentIndex], ...updateData };
    return payments[paymentIndex];
  },

  deletePayment: (id: string): boolean => {
    const initialLength = payments.length;
    payments = payments.filter((p) => p.id !== id);
    return payments.length < initialLength;
  },

  validatePayment: (payment: PaymentInput): string[] => {
    const errors: string[] = [];
    if (!payment.name?.trim()) errors.push("Invalid name");
    if (typeof payment.amount !== "number" || payment.amount <= 0) errors.push("Invalid amount");
    if (!payment.code?.trim()) errors.push("Invalid code");
    if (!isValidGrid(payment.grid)) errors.push("Invalid grid");
    return errors;
  },

  loadPayments: () => {
    return payments;
  },
};

function isValidGrid(grid: string[][]): boolean {
  return (
    Array.isArray(grid) &&
    grid.length > 0 &&
    grid.every((row) => Array.isArray(row) && row.length > 0)
  );
}

// Call loadPayments when the server starts
paymentService.loadPayments();
