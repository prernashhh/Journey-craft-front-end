import React, { useState } from "react";
import { MapPin, CalendarRange, Clock, Car } from "lucide-react";

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

export default function CabSearch() {
  const [date, setDate] = useState("");
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    pickupTime: "",
    cabType: ""
  });

  const cabTypes = [
    { value: "hatchback", label: "Hatchback" },
    { value: "sedan", label: "Sedan" },
    { value: "suv", label: "SUV" },
    { value: "luxury", label: "Luxury" }
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
            <label style={commonStyles.label}>Pickup Location</label>
            <div style={commonStyles.inputContainer}>
              <MapPin size={20} color="#1E3A8A" />
              <input
                type="text"
                placeholder="Enter pickup location"
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                style={commonStyles.input}
              />
            </div>
          </div>

          <div>
            <label style={commonStyles.label}>Drop Location</label>
            <div style={commonStyles.inputContainer}>
              <MapPin size={20} color="#1E3A8A" />
              <input
                type="text"
                placeholder="Enter drop location"
                value={formData.dropLocation}
                onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
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
            <label style={commonStyles.label}>Time</label>
            <div style={commonStyles.inputContainer}>
              <Clock size={20} color="#1E3A8A" />
              <select
                value={formData.pickupTime}
                onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                style={commonStyles.select}
              >
                <option value="">Select time</option>
                {Array.from({ length: 24 }).map((_, i) => (
                  <option key={i} value={`${i}:00`}>
                    {i === 0 ? "12:00 AM" : i < 12 ? `${i}:00 AM` : i === 12 ? "12:00 PM" : `${i - 12}:00 PM`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={commonStyles.label}>Cab Type</label>
            <div style={commonStyles.inputContainer}>
              <Car size={20} color="#1E3A8A" />
              <select
                value={formData.cabType}
                onChange={(e) => setFormData({ ...formData, cabType: e.target.value })}
                style={commonStyles.select}
              >
                <option value="">Select type</option>
                {cabTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button type="submit" style={commonStyles.button}>
          Search Cabs
        </button>
      </form>
    </div>
  );
}