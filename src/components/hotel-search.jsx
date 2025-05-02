import React, { useState } from "react";
import { MapPin, Calendar, Users } from "lucide-react";

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

export default function HotelSearch() {
  const [locationQuery, setLocationQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    rooms: '1',
    guests: '1'
  });

  const indianCities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Jaipur",
    "Ahmedabad",
    "Surat",
  ];

  const filteredSuggestions = indianCities.filter((city) =>
    city.toLowerCase().includes(locationQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Search Data:', { ...formData, location: locationQuery });
  };

  return (
    <div style={{ padding: "30px" }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          <div>
            <label style={commonStyles.label}>Location</label>
            <div style={commonStyles.inputContainer}>
              <MapPin size={20} color="#1E3A8A" />
              <input
                type="text"
                placeholder="Enter city or area"
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                style={commonStyles.input}
              />
              {showSuggestions && locationQuery && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  marginTop: "8px",
                  zIndex: 50
                }}>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {filteredSuggestions.map((city) => (
                      <li
                        key={city}
                        onClick={() => {
                          setLocationQuery(city);
                          setShowSuggestions(false);
                        }}
                        style={{
                          padding: "12px 16px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <MapPin size={16} color="#1E3A8A" />
                        {city}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <label style={commonStyles.label}>Rooms & Guests</label>
            <div style={commonStyles.inputContainer}>
              <Users size={20} color="#1E3A8A" />
              <select
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                style={commonStyles.select}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'room' : 'rooms'}
                  </option>
                ))}
              </select>
              <select
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                style={{ ...commonStyles.select, marginLeft: "12px" }}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          <div>
            <label style={commonStyles.label}>Check-in</label>
            <div style={commonStyles.inputContainer}>
              <Calendar size={20} color="#1E3A8A" />
              <input
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                style={commonStyles.input}
              />
            </div>
          </div>

          <div>
            <label style={commonStyles.label}>Check-out</label>
            <div style={commonStyles.inputContainer}>
              <Calendar size={20} color="#1E3A8A" />
              <input
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                style={commonStyles.input}
              />
            </div>
          </div>
        </div>

        <button type="submit" style={commonStyles.button}>
          Search Hotels
        </button>
      </form>
    </div>
  );
}