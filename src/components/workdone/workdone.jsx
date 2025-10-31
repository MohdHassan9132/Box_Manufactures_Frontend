import React, { useEffect, useState } from "react";
import "./workdone.css";

const WorkDone = () => {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    labour_name: "",
    work_type: "",
    job_name: "",
    no_of_sheets: "",
    wage: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch today's work done
  const fetchWork = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/workdone", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setRecords(data.data);
      else setMessage({ text: "❌ Failed to load records", type: "error" });
    } catch (err) {
      console.error("Error fetching work:", err);
      setMessage({ text: "❌ Error loading records", type: "error" });
    }
  };

  useEffect(() => {
    fetchWork();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/workdone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: "✅ Work added successfully", type: "success" });
        setFormData({
          date: new Date().toISOString().split("T")[0],
          labour_name: "",
          work_type: "",
          job_name: "",
          no_of_sheets: "",
          wage: "",
        });
        fetchWork();
      } else {
        setMessage({ text: "❌ " + data.message, type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "❌ Error adding work", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workdone-page">
      <h2>👷 Work Done (Today)</h2>

      <form className="workdone-form" onSubmit={handleSubmit}>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="labour_name"
          placeholder="Labour Name"
          value={formData.labour_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="work_type"
          placeholder="Work Type"
          value={formData.work_type}
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
          type="number"
          name="no_of_sheets"
          placeholder="No. of Sheets"
          value={formData.no_of_sheets}
          onChange={handleChange}
        />
        <input
          type="number"
          name="wage"
          placeholder="Wage (₹)"
          value={formData.wage}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Work"}
        </button>
      </form>

      {message.text && (
        <p className={`message ${message.type}`}>{message.text}</p>
      )}

      <h3>📋 Today's Records</h3>
      {records.length === 0 ? (
        <p>No work entries yet for today.</p>
      ) : (
        <div className="work-list">
          {records.map((item) => (
            <div key={item._id} className="work-card">
              <p><strong>Labour:</strong> {item.labour_name}</p>
              <p><strong>Job:</strong> {item.job_name || "N/A"}</p>
              <p><strong>Work Type:</strong> {item.work_type || "N/A"}</p>
              <p><strong>Sheets:</strong> {item.no_of_sheets || 0}</p>
              <p><strong>Wage:</strong> ₹{item.wage || 0}</p>
              <p><em>Date: {new Date(item.date).toLocaleDateString()}</em></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkDone;
