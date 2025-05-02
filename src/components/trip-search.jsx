import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { CalendarRange, Search } from "lucide-react";
import { LocationSearch } from "./location-search";
import { ItineraryResults } from "./itinerary-results";
import { CustomItinerary } from "./custom-itinerary";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

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

function TripSearch() {
  const [activeTab, setActiveTab] = useState("select");
  const [date, setDate] = useState({
    from: new Date(),
    to: new Date(),
  });

  const [selectedCity, setSelectedCity] = useState("");
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showResults]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  const handleSearch = () => {
    if (selectedCity) {
      setShowResults(true);
      setActiveTab("select");
    }
  };

  const handleDateSelect = (range) => {
    setDate(range);
    if (range.from && range.to) {
      setIsCalendarOpen(false);
    }
  };

  const buttonStyle = (isActive) => ({
    ...commonStyles.button,
    backgroundColor: isActive ? "#1E3A8A" : "#f1f5f9",
    color: isActive ? "#fff" : "#475569",
  });

  const containerStyle = {
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={containerStyle}>
      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => setActiveTab("select")}
          style={buttonStyle(activeTab === "select")}
        >
          Select Itinerary
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          style={buttonStyle(activeTab === "custom")}
        >
          Custom Itinerary
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "select" && (
          <>
            <div style={commonStyles.formGrid}>
              <div style={{ position: "relative" }}>
                <label style={commonStyles.label}>
                  Destination
                </label>
                <div style={commonStyles.inputContainer}>
                  <LocationSearch
                    label=""
                    placeholder="Where do you want to go?"
                    indianCities={true}
                    onSelect={(city) => {
                      setSelectedCity(city);
                      setShowResults(false);
                    }}
                    style={commonStyles.input}
                    inputWrapperStyle={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                    iconStyle={{
                      color: "#1E3A8A",
                      marginRight: "10px",
                    }}
                  />
                </div>
              </div>

              <div style={{ position: "relative" }}>
                <label style={commonStyles.label}>
                  Date Range
                </label>
                <div
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  style={{
                    ...commonStyles.inputContainer,
                    cursor: "pointer",
                  }}
                >
                  <CalendarRange size={20} color="#1E3A8A" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span style={{ color: "#64748b" }}>Pick a date range</span>
                  )}
                </div>

                {isCalendarOpen && (
                  <div
                    ref={calendarRef}
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      zIndex: 50,
                      backgroundColor: "white",
                      padding: "16px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      marginTop: "8px",
                    }}
                  >
                    <DayPicker
                      mode="range"
                      selected={date}
                      onSelect={handleDateSelect}
                      numberOfMonths={2}
                      defaultMonth={date.from}
                      styles={{
                        caption: { color: "#1E3A8A" },
                        day_selected: { backgroundColor: "#1E3A8A" },
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSearch}
              style={commonStyles.button}
            >
              <Search size={20} />
              Search Itineraries
            </button>

            {showResults && (
              <div
                ref={resultsRef}
                style={{
                  marginTop: "30px",
                  paddingTop: "20px",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                <ItineraryResults city={selectedCity} />
              </div>
            )}
          </>
        )}

        {activeTab === "custom" && <CustomItinerary />}
      </div>
    </div>
  );
}

export default TripSearch;
