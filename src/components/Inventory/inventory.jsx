import React, { useEffect, useState } from "react";
import "./inventory.css";

const Inventory = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    lamination_films: [{ type: "", size: "", quantity: "" }],
    empty_fevicol_containers: "",
    die: [{ size: "", job_name: "" }],
    corugation_rolls: { count: "" },
    pin_rolls: { count: "" },
  });
  const [savedInventory, setSavedInventory] = useState(null); // ✅ For display
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Load today's inventory if exists
  const loadTodayInventory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/inventory", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const today = new Date().toISOString().split("T")[0];
        const todayInv = data.data.find(
          (inv) => new Date(inv.date).toISOString().split("T")[0] === today
        );
        if (todayInv) setFormData(todayInv);
      }
    } catch (err) {
      console.error("Error loading inventory:", err);
    }
  };

  useEffect(() => {
    loadTodayInventory();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Inventory saved successfully!");
        setSavedInventory(data.data); // ✅ Show saved result below
        // ✅ Reset form
        setFormData({
          date: new Date().toISOString().split("T")[0],
          lamination_films: [{ type: "", size: "", quantity: "" }],
          empty_fevicol_containers: "",
          die: [{ size: "", job_name: "" }],
          corugation_rolls: { count: "" },
          pin_rolls: { count: "" },
        });
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      setMessage("❌ Error saving inventory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-page">
      <h2>📦 Inventory Management</h2>

      <form className="inventory-form" onSubmit={handleSubmit}>
        <label>Date</label>
        <input type="date" name="date" value={formData.date} readOnly />

        <label>Empty Fevicol Containers</label>
        <input
          type="number"
          name="empty_fevicol_containers"
          value={formData.empty_fevicol_containers || ""}
          onChange={handleChange}
        />

        <label>Corrugation Rolls (Count)</label>
        <input
          type="number"
          value={formData.corugation_rolls?.count || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              corugation_rolls: { count: e.target.value },
            }))
          }
        />

        <label>Pin Rolls (Count)</label>
        <input
          type="number"
          value={formData.pin_rolls?.count || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              pin_rolls: { count: e.target.value },
            }))
          }
        />

        {/* 🔹 Lamination Films */}
        <h4>Lamination Films</h4>
        {formData.lamination_films.map((film, index) => (
          <div key={index} className="lamination-group">
            <input
              type="text"
              placeholder="Type"
              value={film.type}
              onChange={(e) => {
                const updated = [...formData.lamination_films];
                updated[index].type = e.target.value;
                setFormData((prev) => ({ ...prev, lamination_films: updated }));
              }}
            />
            <input
              type="text"
              placeholder="Size"
              value={film.size}
              onChange={(e) => {
                const updated = [...formData.lamination_films];
                updated[index].size = e.target.value;
                setFormData((prev) => ({ ...prev, lamination_films: updated }));
              }}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={film.quantity}
              onChange={(e) => {
                const updated = [...formData.lamination_films];
                updated[index].quantity = e.target.value;
                setFormData((prev) => ({ ...prev, lamination_films: updated }));
              }}
            />
            <button
              type="button"
              onClick={() => {
                const updated = formData.lamination_films.filter(
                  (_, i) => i !== index
                );
                setFormData((prev) => ({ ...prev, lamination_films: updated }));
              }}
            >
              ❌
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              lamination_films: [
                ...prev.lamination_films,
                { type: "", size: "", quantity: "" },
              ],
            }))
          }
        >
          ➕ Add Lamination Film
        </button>

        {/* 🔹 Die Section */}
        <h4>Die Details</h4>
        {formData.die.map((dieItem, index) => (
          <div key={index} className="die-group">
            <input
              type="text"
              placeholder="Die Size"
              value={dieItem.size}
              onChange={(e) => {
                const updated = [...formData.die];
                updated[index].size = e.target.value;
                setFormData((prev) => ({ ...prev, die: updated }));
              }}
            />
            <input
              type="text"
              placeholder="Job Name"
              value={dieItem.job_name}
              onChange={(e) => {
                const updated = [...formData.die];
                updated[index].job_name = e.target.value;
                setFormData((prev) => ({ ...prev, die: updated }));
              }}
            />
            <button
              type="button"
              onClick={() => {
                const updated = formData.die.filter((_, i) => i !== index);
                setFormData((prev) => ({ ...prev, die: updated }));
              }}
            >
              ❌
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              die: [...prev.die, { size: "", job_name: "" }],
            }))
          }
        >
          ➕ Add Another Die
        </button>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Inventory"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      {/* ✅ Show Saved Inventory Summary */}
      {savedInventory && (
        <div className="inventory-summary">
          <h3>📋 Today’s Inventory</h3>
          <p>
            <b>Date:</b>{" "}
            {new Date(savedInventory.date).toLocaleDateString()}
          </p>
          <p>Fevicol Containers: {savedInventory.empty_fevicol_containers}</p>
          <p>Corrugation Rolls: {savedInventory.corugation_rolls?.count}</p>
          <p>Pin Rolls: {savedInventory.pin_rolls?.count}</p>

          <h4>Dies:</h4>
          {savedInventory.die?.map((d, i) => (
            <p key={i}>
              {d.size} – {d.job_name}
            </p>
          ))}

          <h4>Lamination Films:</h4>
          {savedInventory.lamination_films?.map((f, i) => (
            <p key={i}>
              {f.type} – {f.size} ({f.quantity})
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;
