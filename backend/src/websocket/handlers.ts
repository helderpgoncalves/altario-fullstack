import { WebSocket } from "ws";
import { gridService } from "../services/gridService";
import { paymentService } from "../services/paymentService";

/**
 * Set of connected WebSocket clients
 */
const clients: Set<WebSocket> = new Set();

/**
 * WebSocket handlers for managing connections and messages
 */
export const websocketHandlers = {
  /**
   * Handles a new WebSocket connection
   * @param connection - The WebSocket connection
   */
  handleConnection: (connection: WebSocket) => {
    clients.add(connection);

    connection.on("message", (message: string) => {
      const data = JSON.parse(message);
      switch (data.type) {
        case "START_GENERATOR":
          handleStartGenerator();
          break;
        case "ADD_PAYMENT":
          handleAddPayment(data.payload);
          break;
      }
    });

    connection.on("close", () => {
      clients.delete(connection);
    });
  },
};

/**
 * Handles the START_GENERATOR message
 * Generates new grid data and broadcasts it to all clients
 */
function handleStartGenerator(): void {
  const gridData = gridService.generateGridData();
  broadcast({ type: "GRID_UPDATE", payload: gridData });
}

/**
 * Handles the ADD_PAYMENT message
 * Creates a new payment and broadcasts it to all clients
 * @param paymentData - The payment data to be added
 */
function handleAddPayment(paymentData: any): void {
  const newPayment = paymentService.createPayment(paymentData);
  broadcast({ type: "PAYMENT_ADDED", payload: newPayment });
}

/**
 * Broadcasts a message to all connected clients
 * @param message - The message to broadcast
 */
function broadcast(message: any): void {
  const messageString = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    }
  });
}
