import React, { useState } from "react";
import API from "../../api";
import "./register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    owner_name: "",
    gst: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      if (res.data.success) {
        setMessage("Registered successfully! Redirecting...");
        window.location.href = "/login";
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div className="register-container">
      <h2>Register Enterprise</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Enterprise Name" onChange={handleChange} />
        <input name="owner_name" placeholder="Owner Name" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <input name="gst" placeholder="GST" onChange={handleChange} />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      <p className="msg">{message}</p>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}
