import React, { useState } from "react";
import { MapPin, CalendarRange, Search } from "lucide-react";

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
    padding: "8px",
    backgroundColor: "transparent",
    border: "none",
    color: "#1E3A8A",
    fontSize: "0.95rem",
    outline: "none",
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
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "24px",
  }
};

export default function FlightSearch() {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    passengers: '1',
    class: 'economy'
  });
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

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
    "Surat"
  ];

  const classTypes = [
    { value: 'economy', label: 'Economy' },
    { value: 'premium', label: 'Premium Economy' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: 'First Class' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.from || !formData.to || !departureDate) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Search Data:', { ...formData, departureDate, returnDate });
  };

  return (
    <div style={{ padding: "30px" }}>
      <form onSubmit={handleSubmit}>
        <div style={commonStyles.formGrid}>
          <div>
            <label style={commonStyles.label}>From</label>
            <div style={commonStyles.inputContainer}>
              <MapPin size={20} color="#1E3A8A" />
              <input
                type="text"
                placeholder="Departure city"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                list="cities"
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
                placeholder="Arrival city"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                list="cities"
                style={commonStyles.input}
              />
            </div>
          </div>
        </div>

        <datalist id="cities">
          {indianCities.map(city => (
            <option key={city} value={city} />
          ))}
        </datalist>

        <div style={commonStyles.formGrid}>
          <div>
            <label style={commonStyles.label}>Departure</label>
            <div style={commonStyles.inputContainer}>
              <CalendarRange size={20} color="#1E3A8A" />
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                style={commonStyles.input}
              />
            </div>
          </div>

          <div>
            <label style={commonStyles.label}>Return</label>
            <div style={commonStyles.inputContainer}>
              <CalendarRange size={20} color="#1E3A8A" />
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                style={commonStyles.input}
              />
            </div>
          </div>

          <div>
            <label style={commonStyles.label}>Passengers</label>
            <div style={commonStyles.inputContainer}>
              <select
                value={formData.passengers}
                onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                style={commonStyles.select}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'passenger' : 'passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={commonStyles.label}>Class</label>
            <div style={commonStyles.inputContainer}>
              <select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                style={commonStyles.select}
              >
                {classTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button type="submit" style={commonStyles.button}>
          <Search size={20} />
          Search Flights
        </button>
      </form>
    </div>
  );
}