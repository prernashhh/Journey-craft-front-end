import React, { useState } from "react";
import { MapPin, CalendarRange } from "lucide-react";

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

export default function BusSearch() {
  const [date, setDate] = useState(null);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    busType: ''
  });

  const indianCities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Jaipur",
    "Ahmedabad",
    "Surat",
  ];

  const busTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'ac', label: 'AC' },
    { value: 'nonac', label: 'Non-AC' },
    { value: 'sleeper', label: 'Sleeper' },
    { value: 'seater', label: 'Seater' },
    { value: 'luxury', label: 'Luxury' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Search Data:', { ...formData, date });
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
                placeholder="Departure city"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                list="departureCities"
                style={commonStyles.input}
              />
              <datalist id="departureCities">
                {indianCities.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label style={commonStyles.label}>To</label>
            <div style={commonStyles.inputContainer}>
              <MapPin size={20} color="#1E3A8A" />
              <input
                type="text"
                placeholder="Arrival city"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                list="arrivalCities"
                style={commonStyles.input}
              />
              <datalist id="arrivalCities">
                {indianCities.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          <div>
            <label style={commonStyles.label}>Travel Date</label>
            <div style={commonStyles.inputContainer}>
              <CalendarRange size={20} color="#1E3A8A" />
              <input
                type="date"
                value={date || ''}
                onChange={(e) => setDate(e.target.value)}
                style={commonStyles.input}
              />
            </div>
          </div>

          <div>
            <label style={commonStyles.label}>Bus Type</label>
            <div style={commonStyles.inputContainer}>
              <select
                value={formData.busType}
                onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
                style={commonStyles.select}
              >
                <option value="">Select bus type</option>
                {busTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button type="submit" style={commonStyles.button}>
          Search Buses
        </button>
      </form>
    </div>
  );
}