import React, { useState } from "react";
import { MapPin, CalendarRange, Train } from "lucide-react";

const commonStyles = {
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    minHeight: "48px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#1E3A8A",
  },
  input: {
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
    color: "#1E3A8A",
    fontSize: "0.95rem",
    outline: "none",
  },
  select: {
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
    color: "#1E3A8A",
    fontSize: "0.95rem",
    outline: "none",
    cursor: "pointer",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#1E3A8A",
    color: "white",
    border: "none",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s",
  }
};

export default function TrainSearch() {
  const [date, setDate] = useState("");
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    travelClass: "",
    quota: ""
  });

  const travelClasses = [
    { value: "1A", label: "AC First Class (1A)" },
    { value: "2A", label: "AC 2 Tier (2A)" },
    { value: "3A", label: "AC 3 Tier (3A)" },
    { value: "SL", label: "Sleeper (SL)" },
    { value: "2S", label: "Second Sitting (2S)" }
  ];

  const quotas = [
    { value: "GENERAL", label: "General" },
    { value: "TATKAL", label: "Tatkal" },
    { value: "LADIES", label: "Ladies" },
    { value: "SR_CITIZEN", label: "Senior Citizen" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search Data:", { ...formData, date });
  };

  return (
    <div style={{ padding: "30px" }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          <div>
            <label style={commonStyles.label}>From</label>
            <div style={commonStyles.inputContainer}>
              <MapPin size={20} color="#1E3A8A" />
              <input
                type="text"
                placeholder="Enter departure station"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                style={commonStyles.input}
              />
            </div>
          </div>

          <div>
            <label style={commonStyles.label}>To</label>
            <div style={commonStyles.inputContainer}>
              <MapPin size={20} color="#1E3A8A" />
              <input
                type="text"
                placeholder="Enter arrival station"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                style={commonStyles.input}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          <div>
            <label style={commonStyles.label}>Date</label>
            <div style={commonStyles.inputContainer}>
              <CalendarRange size={20} color="#1E3A8A" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={commonStyles.input}
              />
            </div>
          </div>

          <div>
            <label style={commonStyles.label}>Class</label>
            <div style={commonStyles.inputContainer}>
              <Train size={20} color="#1E3A8A" />
              <select
                value={formData.travelClass}
                onChange={(e) => setFormData({ ...formData, travelClass: e.target.value })}
                style={commonStyles.select}
              >
                <option value="">Select class</option>
                {travelClasses.map((cls) => (
                  <option key={cls.value} value={cls.value}>
                    {cls.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={commonStyles.label}>Quota</label>
            <div style={commonStyles.inputContainer}>
              <select
                value={formData.quota}
                onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                style={commonStyles.select}
              >
                <option value="">Select quota</option>
                {quotas.map((q) => (
                  <option key={q.value} value={q.value}>
                    {q.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button type="submit" style={commonStyles.button}>
          Search Trains
        </button>
      </form>
    </div>
  );
}