import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { gridRoutes } from "./routes/grid";
import paymentRoutes from "./routes/payments";
import { websocketHandlers } from "./websocket/handlers";

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: true });
fastify.register(websocket);
fastify.register(gridRoutes);
fastify.register(paymentRoutes);

fastify.get("/ws", { websocket: true }, websocketHandlers.handleConnection);

fastify.get("/", () => ({ message: "Hello from the backend!" }));

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
