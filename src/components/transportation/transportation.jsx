import React, { useEffect, useState } from "react";
import "./transportation.css";

const Transportation = () => {
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    driver_name: "",
    source: "",
    destination: "",
    transport_wage: "",
    no_of_sacks: "",
    no_of_boxes: "",
    job_name: "",
    work_type: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch today's transportation logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/transportation", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setLogs(data.data);
      else setMessage("❌ Failed to load transport logs");
    } catch (err) {
      console.error("Error fetching logs:", err);
      setMessage("❌ Error loading logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/transportation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Transportation log added!");
        setFormData({
          driver_name: "",
          source: "",
          destination: "",
          transport_wage: "",
          no_of_sacks: "",
          no_of_boxes: "",
          job_name: "",
          work_type: "",
        });
        fetchLogs();
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error adding transport");
    }
  };

  return (
    <div className="transport-page">
      <h2>🚚 Transportation Logs (Today)</h2>

      <form className="transport-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="driver_name"
          placeholder="Driver Name"
          value={formData.driver_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="source"
          placeholder="Source"
          value={formData.source}
          onChange={handleChange}
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
        />
        <input
          type="number"
          name="transport_wage"
          placeholder="Transport Wage"
          value={formData.transport_wage}
          onChange={handleChange}
        />
        <input
          type="number"
          name="no_of_sacks"
          placeholder="No. of Sacks"
          value={formData.no_of_sacks}
          onChange={handleChange}
        />
        <input
          type="number"
          name="no_of_boxes"
          placeholder="No. of Boxes"
          value={formData.no_of_boxes}
          onChange={handleChange}
        />
        <input
          type="text"
          name="job_name"
          placeholder="Job Name"
          value={formData.job_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="work_type"
          placeholder="Work Type"
          value={formData.work_type}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Log"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      <h3>📋 Today's Transport Logs</h3>
      {logs.length === 0 ? (
        <p>No logs for today.</p>
      ) : (
        <div className="transport-list">
          {logs.map((log) => (
            <div key={log._id} className="transport-card">
              <p><strong>Driver:</strong> {log.driver_name}</p>
              <p><strong>Source → Destination:</strong> {log.source} → {log.destination}</p>
              <p><strong>Job:</strong> {log.job_name || "N/A"}</p>
              <p><strong>Type:</strong> {log.work_type || "N/A"}</p>
              <p><strong>Wage:</strong> ₹{log.transport_wage || 0}</p>
              <p><strong>Sacks:</strong> {log.no_of_sacks || 0}</p>
              <p><strong>Boxes:</strong> {log.no_of_boxes || 0}</p>
              <p><em>{new Date(log.createdAt).toLocaleTimeString()}</em></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transportation;
