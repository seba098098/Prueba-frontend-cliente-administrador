import React from "react";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/pages/Login";

export default function App() {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
}
