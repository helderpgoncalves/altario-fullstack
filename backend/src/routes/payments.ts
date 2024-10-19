import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { v4 as uuidv4 } from "uuid";

/**
 * Represents a payment in the system.
 */
interface Payment {
  id: string;
  name: string;
  amount: number;
  code: string;
  grid: string[][];
  createdAt: Date;
}

/** Represents the input data for creating a new payment. */
type PaymentInput = Omit<Payment, "id" | "createdAt">;

/** Represents the data that can be updated for an existing payment. */
type PaymentUpdate = Partial<Pick<Payment, "name" | "amount">>;

/** In-memory storage for payments. */
let payments: Payment[] = [];

/**
 * Registers payment routes with the Fastify instance.
 * @param fastify - The Fastify instance to register routes with.
 */
export default async function paymentRoutes(fastify: FastifyInstance) {
  fastify.get("/payments", getAllPayments);
  fastify.post<{ Body: PaymentInput }>("/payments", createPayment);
  fastify.get<{ Params: { id: string } }>("/payments/:id", getPaymentById);
  fastify.put<{ Params: { id: string }; Body: PaymentUpdate }>(
    "/payments/:id",
    updatePayment
  );
  fastify.delete<{ Params: { id: string } }>("/payments/:id", deletePayment);
}

/**
 * Retrieves all payments.
 * @returns An object containing an array of all payments.
 */
async function getAllPayments() {
  return payments;
}

/**
 * Creates a new payment.
 * @param request - The FastifyRequest object containing the payment data.
 * @param reply - The FastifyReply object for sending the response.
 * @returns The created payment or an error response.
 */
async function createPayment(
  request: FastifyRequest<{ Body: PaymentInput }>,
  reply: FastifyReply
) {
  const { name, amount, code, grid } = request.body;
  const errors = validatePayment({ name, amount, code, grid });

  if (errors.length > 0) {
    return reply.code(400).send({ errors });
  }

  const newPayment: Payment = {
    id: uuidv4(),
    name: name.trim(),
    amount,
    code: code.trim(),
    grid,
    createdAt: new Date(),
  };

  payments.push(newPayment);
  return reply.code(200).send({ payment: newPayment });
}

/**
 * Retrieves a payment by its ID.
 * @param request - The FastifyRequest object containing the payment ID.
 * @param reply - The FastifyReply object for sending the response.
 * @returns The requested payment or a not found error.
 */
async function getPaymentById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const payment = findPaymentById(request.params.id);
  if (!payment) {
    return reply.code(404).send({ error: "Payment not found" });
  }
  return { payment };
}

/**
 * Updates an existing payment.
 * @param request - The FastifyRequest object containing the payment ID and update data.
 * @param reply - The FastifyReply object for sending the response.
 * @returns The updated payment or a not found error.
 */
async function updatePayment(
  request: FastifyRequest<{ Params: { id: string }; Body: PaymentUpdate }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const updateData = request.body;
  const paymentIndex = payments.findIndex((p) => p.id === id);

  if (paymentIndex === -1) {
    return reply.code(404).send({ error: "Payment not found" });
  }

  payments[paymentIndex] = { ...payments[paymentIndex], ...updateData };
  return { payment: payments[paymentIndex] };
}

/**
 * Deletes a payment by its ID.
 * @param request - The FastifyRequest object containing the payment ID.
 * @param reply - The FastifyReply object for sending the response.
 * @returns A success message or a not found error.
 */
async function deletePayment(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const paymentIndex = payments.findIndex((p) => p.id === id);

  if (paymentIndex === -1) {
    return reply.code(404).send({ error: "Payment not found" });
  }

  payments.splice(paymentIndex, 1);
  return { success: true };
}

/**
 * Validates the input for a payment.
 * @param payment - The payment input to validate.
 * @returns An array of error messages, empty if validation passes.
 */
function validatePayment(payment: PaymentInput): string[] {
  const { name, amount, code, grid } = payment;
  const errors: string[] = [];

  if (!name?.trim()) errors.push("Invalid name");
  if (typeof amount !== "number" || amount <= 0) errors.push("Invalid amount");
  if (!code?.trim()) errors.push("Invalid code");
  if (!isValidGrid(grid)) errors.push("Invalid grid");

  return errors;
}

/**
 * Checks if a grid is valid.
 * @param grid - The grid to validate.
 * @returns True if the grid is valid, false otherwise.
 */
function isValidGrid(grid: string[][]): boolean {
  return (
    Array.isArray(grid) &&
    grid.length > 0 &&
    grid.every((row) => Array.isArray(row) && row.length > 0)
  );
}

/**
 * Finds a payment by its ID.
 * @param id - The ID of the payment to find.
 * @returns The found payment or undefined if not found.
 */
function findPaymentById(id: string): Payment | undefined {
  return payments.find((p) => p.id === id);
}
