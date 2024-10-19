import Fastify from "fastify";
import cors from "@fastify/cors";

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: true });

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
