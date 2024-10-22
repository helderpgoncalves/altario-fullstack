// Define the WebSocketMessage type
export type WebSocketMessage = {
  type: string;
  payload: unknown;
};

let socket: WebSocket | null = null;

export const connectWebSocket = (
  onMessage: (data: WebSocketMessage) => void
) => {
  socket = new WebSocket("ws://localhost:3000/ws");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data) as WebSocketMessage;
    onMessage(data);
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
    // Implement reconnection logic here
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

export const sendWebSocketMessage = (message: WebSocketMessage) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error("WebSocket is not connected");
  }
};
