import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { paymentService, PaymentInput, PaymentUpdate } from "../services/paymentService";

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
  return paymentService.getAllPayments();
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
  const errors = paymentService.validatePayment(request.body);
  if (errors.length > 0) {
    return reply.code(400).send({ errors });
  }
  const newPayment = paymentService.createPayment(request.body);
  return reply.code(201).send(newPayment);
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
  const payment = paymentService.getPaymentById(request.params.id);
  if (!payment) {
    return reply.code(404).send({ error: "Payment not found" });
  }
  return payment;
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
  const updatedPayment = paymentService.updatePayment(id, request.body);
  if (!updatedPayment) {
    return reply.code(404).send({ error: "Payment not found" });
  }
  return updatedPayment;
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
  const deleted = paymentService.deletePayment(id);
  if (!deleted) {
    return reply.code(404).send({ error: "Payment not found" });
  }
  return { success: true };
}
