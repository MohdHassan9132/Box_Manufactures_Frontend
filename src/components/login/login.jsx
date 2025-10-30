import React, { useState } from "react";
import API from "../../api";
import "./login.css";

export default function Login() {
  const [form, setForm] = useState({ name: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      if (res.data.success) {
        window.location.href = "/enterprise";
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Enterprise Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Enterprise Name" onChange={handleChange} />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
      <p className="msg">{message}</p>
      <p>Don’t have an account? <a href="/register">Register</a></p>
    </div>
  );
}
