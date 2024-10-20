import WebSocket from "ws";
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
   * @param {WebSocket} connection - The WebSocket connection
   */
  handleConnection: (connection: WebSocket) => {
    clients.add(connection);

    connection.on("message", (message: string) => {
      const data = JSON.parse(message);
      switch (data.type) {
        case "START_GENERATOR":
          handleStartGenerator(data.payload?.biasChar || null);
          break;
        case "ADD_PAYMENT":
          handleAddPayment(data.payload);
          break;
        case "GET_PAYMENTS":
          handleGetPayments(connection);
          break;
      }
    });

    connection.on("close", () => {
      clients.delete(connection);
    });
  },

  broadcastToAll: (message: any) => {
    const messageString = JSON.stringify(message);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  },
};

/**
 * Handles the START_GENERATOR message
 * Generates new grid data and broadcasts it to all clients
 */
function handleStartGenerator(biasChar: string | null): void {
  const gridData = gridService.generateGridData(biasChar);
  websocketHandlers.broadcastToAll({ type: "GRID_UPDATE", payload: gridData });
}

/**
 * Handles the ADD_PAYMENT message
 * Creates a new payment and broadcasts it to all clients
 * @param {any} paymentData - The payment data to be added
 */
function handleAddPayment(paymentData: any): void {
  const newPayment = paymentService.createPayment(paymentData);
  websocketHandlers.broadcastToAll({ type: "PAYMENT_ADDED", payload: newPayment });
}

/**
 * Handles the GET_PAYMENTS message
 * Retrieves the payment list and sends it to the client
 * @param {WebSocket} connection - The WebSocket connection
 */
function handleGetPayments(connection: WebSocket): void {
  const payments = paymentService.getAllPayments();
  connection.send(JSON.stringify({ type: "PAYMENTS_LIST", payload: payments }));
}
