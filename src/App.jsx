import React from "react";
import Register from "./components/register/register";
import Login from "./components/login/login";
import Enterprise from "./components/enterprise/enterprise";

export default function App() {
  const path = window.location.pathname;

  if (path === "/login") return <Login />;
  if (path === "/register") return <Register />;
  if (path === "/enterprise") return <Enterprise />;
  return <Login />; // default redirect
}
