import React, { useState, useEffect } from "react"
import { MapPin } from "lucide-react" // Add this import

export function LocationSearch({ label, placeholder, className = "", indianCities = false, onSelect, style, inputWrapperStyle, iconStyle }) {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const cities = [
    { name: "Manali", description: "Himachal Pradesh" },
    { name: "Jaipur", description: "Rajasthan" },
    { name: "Goa", description: "Beaches & Nightlife" },
    { name: "Kerala", description: "God's Own Country" },
    { name: "Delhi", description: "Capital Territory" },
    { name: "Mumbai", description: "Maharashtra" },
    { name: "Kolkata", description: "West Bengal" },
    { name: "Chennai", description: "Tamil Nadu" },
    { name: "Agra", description: "Uttar Pradesh" },
    { name: "Udaipur", description: "Rajasthan" },
  ]

  const filteredCities = cities.filter((city) => city.name.toLowerCase().startsWith(query.toLowerCase()))

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!(event.target.closest(".location-search"))) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={`location-search ${className}`} style={style}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        width: '100%',
        gap: '8px'
      }}>
        <MapPin size={20} style={iconStyle || { color: "#1E3A8A", flexShrink: 0 }} />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          style={{
            width: '100%',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#1E3A8A',
            fontSize: '0.95rem',
            outline: 'none',
            padding: '0'
          }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setShowSuggestions(false)
              onSelect?.("")
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px',
              flexShrink: 0
            }}
          >
            &#x2715;
          </button>
        )}
      </div>

      {showSuggestions && query && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            marginTop: "8px",
            zIndex: 50
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setQuery(city.name)
                    setShowSuggestions(false)
                    onSelect?.(city.name)
                  }}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    borderBottom: index < filteredCities.length - 1 ? "1px solid #e2e8f0" : "none",
                    ':hover': {
                      backgroundColor: "#f8fafc"
                    }
                  }}
                >
                  <strong>{city.name}</strong>
                  <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{city.description}</div>
                </li>
              ))
            ) : (
              <li style={{ padding: "12px 16px", color: "#64748b" }}>No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default LocationSearch
