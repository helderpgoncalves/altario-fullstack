import { FastifyInstance } from "fastify";
import { gridService } from "../services/gridService";

/**
 * Defines the routes for the grid functionality.
 * @param fastify - The Fastify instance.
 */
export async function gridRoutes(fastify: FastifyInstance) {
  let lastBiasRequestTime: number | null = null;

  fastify.get<{ Querystring: { bias?: string } }>(
    "/grid",
    async (request, reply) => {
      const biasChar = request.query.bias || null;

      // Check the timestamp for bias requests
      if (biasChar) {
        const now = Date.now();
        if (lastBiasRequestTime && now - lastBiasRequestTime < 4000) {
          return reply.status(429).send({
            error:
              "Too many requests. Please wait 4 seconds between bias requests.",
          });
        }
        lastBiasRequestTime = now; // Update the timestamp
      }

      return gridService.generateGridData(biasChar);
    }
  );
}
