import React, { useEffect, useState } from "react";
import API from "../../api";
import "./enterprise.css";

export default function Enterprise() {
  const [enterprise, setEnterprise] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await API.get("/auth/me");
      if (res.data.success) {
        setEnterprise(res.data.enterprise || res.data.data);
      }
    } catch (err) {
      window.location.href = "/login"; // not logged in
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await API.post("/auth/logout");
    window.location.href = "/login";
  };

  if (loading) return <h2>Loading...</h2>;
  if (!enterprise) return <h2>No enterprise found.</h2>;

  return (
    <div className="enterprise-container">
      <h1>Welcome, {enterprise.name}</h1>
      <p>Owner: {enterprise.owner_name}</p>
      <p>Address: {enterprise.address}</p>
      <p>GST: {enterprise.gst}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
