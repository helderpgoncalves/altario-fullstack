import Fastify from "fastify";
import cors from "@fastify/cors";
import { gridRoutes } from "./routes/grid";

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: true });
fastify.register(gridRoutes);

fastify.get("/", () => ({ message: "Hello from the backend!" }));

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log("Server is running on http://localhost:3000");
});
