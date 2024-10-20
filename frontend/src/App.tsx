import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import GridScreen from "./screens/GridScreen";
import PaymentsScreen from "./screens/PaymentsScreen";
import { GridProvider } from "./contexts/GridContext";
import { connectWebSocket } from "./websocket/connection";

const App: React.FC = () => {
  useEffect(() => {
    connectWebSocket();
  }, []);

  return (
    <GridProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<GridScreen />} />
              <Route path="/payments" element={<PaymentsScreen />} />
            </Routes>
          </main>
        </div>
      </Router>
    </GridProvider>
  );
};

export default App;
