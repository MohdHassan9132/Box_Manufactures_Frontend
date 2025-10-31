import React, { useEffect, useState } from "react";
import "./job.css";

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    job_name: "",
    size: "",
    no_of_sheets: "",
    no_of_boxes: "",
    paper_cost: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch all jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/job", {
        method: "GET",
        credentials: "include", // send cookies
      });
      const data = await res.json();
      if (data.success) setJobs(data.data);
      else setMessage("❌ Failed to load jobs");
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setMessage("❌ Error loading jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
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
      const res = await fetch("http://localhost:5000/api/job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Job added successfully!");
        setFormData({
          job_name: "",
          size: "",
          no_of_sheets: "",
          no_of_boxes: "",
          paper_cost: "",
        });
        fetchJobs();
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error adding job");
    }
  };

  return (
    <div className="job-page">
      <h2>🧾 Job Management</h2>

      <form className="job-form" onSubmit={handleSubmit}>
        <label>Job Name</label>
        <input
          type="text"
          name="job_name"
          value={formData.job_name}
          onChange={handleChange}
          required
        />

        <label>Size</label>
        <input
          type="text"
          name="size"
          value={formData.size}
          onChange={handleChange}
        />

        <label>No. of Sheets</label>
        <input
          type="number"
          name="no_of_sheets"
          value={formData.no_of_sheets}
          onChange={handleChange}
        />

        <label>No. of Boxes</label>
        <input
          type="number"
          name="no_of_boxes"
          value={formData.no_of_boxes}
          onChange={handleChange}
        />

        <label>Paper Cost</label>
        <input
          type="number"
          name="paper_cost"
          value={formData.paper_cost}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Job"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      <h3>📋 Recent Jobs</h3>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <p><strong>Job:</strong> {job.job_name}</p>
              <p><strong>Size:</strong> {job.size || "N/A"}</p>
              <p><strong>Sheets:</strong> {job.no_of_sheets || 0}</p>
              <p><strong>Boxes:</strong> {job.no_of_boxes || 0}</p>
              <p><strong>Paper Cost:</strong> ₹{job.paper_cost || 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Job;
