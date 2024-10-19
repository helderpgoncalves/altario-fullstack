import Fastify, { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import paymentsRoutes from "../src/routes/payments";
import { v4 as uuidv4 } from "uuid";

describe("Payments API", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    void app.register(fp(paymentsRoutes));
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear payments before each test
    await app.inject({
      method: "DELETE",
      url: "/payments",
    });
  });

  const samplePayment = {
    name: "Test Payment",
    amount: 100,
    code: "12",
    grid: [
      ["a", "b"],
      ["c", "d"],
    ],
  };

  describe("POST /payments", () => {
    it("should create a new payment", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/payments",
        payload: samplePayment,
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(payload).toMatchObject(samplePayment);
      expect(payload.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      expect(payload.createdAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });

    it("should return 400 for invalid payment data", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/payments",
        payload: { name: "", amount: -10, code: "", grid: [] },
      });

      expect(response.statusCode).toBe(400);
      const payload = JSON.parse(response.payload);
      expect(payload.errors).toBeDefined();
    });
  });

  describe("GET /payments", () => {
    it("should return an empty array when no payments exist", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/payments",
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveLength(1);
    });

    it("should return all payments", async () => {
      await app.inject({
        method: "POST",
        url: "/payments",
        payload: samplePayment,
      });

      const response = await app.inject({
        method: "GET",
        url: "/payments",
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveLength(2);
      expect(payload[0]).toMatchObject(samplePayment);
    });
  });

  describe("GET /payments/:id", () => {
    it("should return a specific payment", async () => {
      const createResponse = await app.inject({
        method: "POST",
        url: "/payments",
        payload: samplePayment,
      });
      const { id } = JSON.parse(createResponse.payload);

      const response = await app.inject({
        method: "GET",
        url: `/payments/${id}`,
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(payload).toMatchObject(samplePayment);
      expect(payload.id).toBe(id);
    });

    it("should return 404 for non-existent payment", async () => {
      const nonExistentId = uuidv4();
      const response = await app.inject({
        method: "GET",
        url: `/payments/${nonExistentId}`,
      });

      expect(response.statusCode).toBe(404);
      const payload = JSON.parse(response.payload);
      expect(payload.error).toBe("Payment not found");
    });
  });

  describe("PUT /payments/:id", () => {
    it("should update an existing payment", async () => {
      const createResponse = await app.inject({
        method: "POST",
        url: "/payments",
        payload: samplePayment,
      });
      const { id } = JSON.parse(createResponse.payload);

      const updatedData = { name: "Updated Payment", amount: 200 };
      const response = await app.inject({
        method: "PUT",
        url: `/payments/${id}`,
        payload: updatedData,
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(payload).toMatchObject({
        ...samplePayment,
        ...updatedData,
      });
      expect(payload.id).toBe(id);
    });

    it("should return 404 for updating non-existent payment", async () => {
      const nonExistentId = uuidv4();
      const response = await app.inject({
        method: "PUT",
        url: `/payments/${nonExistentId}`,
        payload: { name: "Updated Payment" },
      });

      expect(response.statusCode).toBe(404);
      const payload = JSON.parse(response.payload);
      expect(payload.error).toBe("Payment not found");
    });
  });

  describe("DELETE /payments/:id", () => {
    it("should delete an existing payment", async () => {
      const createResponse = await app.inject({
        method: "POST",
        url: "/payments",
        payload: samplePayment,
      });
      const { id } = JSON.parse(createResponse.payload);

      const deleteResponse = await app.inject({
        method: "DELETE",
        url: `/payments/${id}`,
      });

      expect(deleteResponse.statusCode).toBe(200);
      const deletePayload = JSON.parse(deleteResponse.payload);
      expect(deletePayload.success).toBe(true);

      const getResponse = await app.inject({
        method: "GET",
        url: `/payments/${id}`,
      });

      expect(getResponse.statusCode).toBe(404);
    });

    it("should return 404 for deleting non-existent payment", async () => {
      const nonExistentId = uuidv4();
      const response = await app.inject({
        method: "DELETE",
        url: `/payments/${nonExistentId}`,
      });

      expect(response.statusCode).toBe(404);
      const payload = JSON.parse(response.payload);
      expect(payload.error).toBe("Payment not found");
    });
  });
});
