let socket: WebSocket | null = null;

export const connectWebSocket = () => {
  socket = new WebSocket("ws://localhost:3000/ws");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case "GRID_UPDATE":
        // Handle grid update
        break;
      case "PAYMENT_ADDED":
        // Handle new payment
        break;
    }
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };
};

export const sendWebSocketMessage = (message: any) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
};

