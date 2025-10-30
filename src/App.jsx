import React from "react";
import Register from "./components/register/register";
import Login from "./components/login/login";
import Enterprise from "./components/enterprise/enterprise";
import Inventory from "./components/inventory/inventory.jsx";

export default function App() {
  const path = window.location.pathname;

  if (path === "/login") return <Login />;
  if (path === "/register") return <Register />;
  if (path === "/enterprise") return <Enterprise />;
  if (path === "/inventory") return <Inventory />;

  return <Login />; // default fallback
}
