import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CoinProvider } from "./context/CoinContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* 🔥 COIN PROVIDER MUST BE HERE */}
        <CoinProvider>
          <App />
        </CoinProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);