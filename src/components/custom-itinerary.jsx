import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Hotel, Plane, Train, Bus, Car, Mountain, Utensils, Umbrella, Check, ChevronRight, Clock, Globe } from "lucide-react";
import axios from "axios";
import "./custom-itinerary.css";

export function CustomItinerary() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    selectedPopularPlaces: [],
    dateRange: {
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() + 5)),
    },
    hotelRating: "4-star",
    travelMode: "flight",
    specialRequirements: [],
    selectedHotels: [],
    selectedTransport: [],
    selectedAttractions: [],
    additionalNotes: "",
  });

  // Hardcoded popular places for specific destinations
  const popularDestinations = {
    "Delhi": [
      { 
        id: "delhi1", 
        name: "Red Fort", 
        description: "Historic fort built in the 17th century",
        image: "https://images.unsplash.com/photo-1713729991304-d0b6c328560e?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      { 
        id: "delhi2", 
        name: "Qutub Minar", 
        description: "UNESCO World Heritage site with a 73-meter tall tower",
        image: "https://plus.unsplash.com/premium_photo-1697729438410-d53c666e3810?q=80&w=1974&auto=format&fit=crop"
      },
      { 
        id: "delhi3", 
        name: "India Gate", 
        description: "War memorial in the heart of Delhi",
        image: "https://images.unsplash.com/photo-1705077171489-b5dfcf144676?q=80&w=1935&auto=format&fit=crop"
      },
      { 
        id: "delhi4", 
        name: "Lotus Temple", 
        description: "Stunning Bahá'í House of Worship shaped like a lotus flower",
        image: "https://images.unsplash.com/photo-1669873939341-9d34c6434c56?q=80&w=1964&auto=format&fit=crop"
      },
      { 
        id: "delhi5", 
        name: "Humayun's Tomb", 
        description: "Magnificent tomb that inspired the Taj Mahal",
        image: "https://images.unsplash.com/photo-1705572243594-0f6b1e60915d?w=600&auto=format&fit=crop"
      }
    ],
    "Manali": [
      { 
        id: "manali1", 
        name: "Solang Valley", 
        description: "Adventure sports hub with skiing and paragliding",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1470&auto=format&fit=crop"
      },
      { 
        id: "manali2", 
        name: "Hadimba Temple", 
        description: "Ancient wooden temple dedicated to Goddess Hadimba",
        image: "https://images.unsplash.com/photo-1655470062196-c37e923fc4c1?q=80&w=2070&auto=format&fit=crop"
      },
      { 
        id: "manali3", 
        name: "Rohtang Pass", 
        description: "High mountain pass with breathtaking views",
        image: "https://images.unsplash.com/photo-1651955670895-9aa2e9243b66?q=80&w=1974&auto=format&fit=crop"
      },
      { 
        id: "manali4", 
        name: "Old Manali", 
        description: "Charming village with cafes and vibrant atmosphere",
        image: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=1470&auto=format&fit=crop"
      },
      { 
        id: "manali5", 
        name: "Jogini Waterfall", 
        description: "Beautiful waterfall surrounded by pine forests",
        image: "https://images.unsplash.com/photo-1629478286877-5d796000a5af?q=80&w=1974&auto=format&fit=crop"
      }
    ]
  };

  // Sample data
  const hotels = [
    {
      id: "hotel1",
      name: "Grand Plaza Hotel",
      rating: "5-star",
      price: 12000,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "hotel2",
      name: "Comfort Inn",
      rating: "4-star",
      price: 8000,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "hotel3",
      name: "Budget Stay",
      rating: "3-star",
      price: 5000,
      image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const transport = [
    { id: "transport1", type: "Flight", name: "IndiGo Airlines", time: "06:00 - 08:30", price: 5500 },
    { id: "transport2", type: "Train", name: "Rajdhani Express", time: "16:00 - 08:00", price: 2200 },
    { id: "transport3", type: "Bus", name: "Volvo A/C Sleeper", time: "20:00 - 08:00", price: 1800 },
  ];

  const attractions = [
    { 
      id: "attr1", 
      name: "Heritage Walking Tour", 
      type: "Cultural", 
      price: 1200, 
      duration: "3 hours",
      image: "https://images.unsplash.com/photo-1531816458010-fb7685eecbcb?q=80&w=1470&auto=format&fit=crop"
    },
    { 
      id: "attr2", 
      name: "Adventure Park", 
      type: "Adventure", 
      price: 2000, 
      duration: "Full day",
      image: "https://images.unsplash.com/photo-1499242611767-cf8b9be02854?q=80&w=1470&auto=format&fit=crop"
    },
    { 
      id: "attr3", 
      name: "Local Food Tour", 
      type: "Culinary", 
      price: 1500, 
      duration: "4 hours",
      image: "https://images.unsplash.com/photo-1530062845289-9109b2c9c868?q=80&w=1470&auto=format&fit=crop"
    },
  ];

  const events = [
    { 
      id: "event1", 
      name: "Local Music Festival", 
      date: "Next Saturday", 
      price: 1500, 
      type: "Entertainment",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1470&auto=format&fit=crop"
    },
    { 
      id: "event2", 
      name: "Cultural Exhibition", 
      date: "This Weekend", 
      price: 500, 
      type: "Cultural",
      image: "https://images.unsplash.com/photo-1560523159-4a9692d222f8?q=80&w=1470&auto=format&fit=crop"
    },
    { 
      id: "event3", 
      name: "Food & Wine Festival", 
      date: "Next Month", 
      price: 2000, 
      type: "Culinary",
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1470&auto=format&fit=crop"
    },
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const itineraryData = {
        ...formData,
        id: Date.now(), // Temporary unique ID
        status: "Pending Review",
        estimatedPrice: "₹25,000 - ₹35,000",
        createdAt: new Date().toISOString(),
        user: user
      };

      // Store in localStorage
      const existingItineraries = JSON.parse(localStorage.getItem('customItineraries')) || [];
      localStorage.setItem('customItineraries', JSON.stringify([...existingItineraries, itineraryData]));

      setShowConfirmation(true);
      setCurrentStep(1);
      // Reset form
      setFormData({
        destination: "",
        selectedPopularPlaces: [],
        dateRange: {
          from: new Date(),
          to: new Date(new Date().setDate(new Date().getDate() + 5)),
        },
        hotelRating: "4-star",
        travelMode: "flight",
        specialRequirements: [],
        selectedHotels: [],
        selectedTransport: [],
        selectedAttractions: [],
        additionalNotes: "",
      });
    } catch (error) {
      console.error('Error submitting itinerary:', error);
      alert('Failed to submit itinerary. Please try again.');
    }
  };

  const toggleSelection = (type, id) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].includes(id) 
        ? prev[type].filter(item => item !== id)
        : [...prev[type], id]
    }));
  };

  // Get popular places for the selected destination
  const getPopularPlaces = () => {
    const destination = formData.destination.trim();
    
    // Check if we have data for this destination
    // Using case-insensitive comparison to match user input with our data
    for (const [key, places] of Object.entries(popularDestinations)) {
      if (destination.toLowerCase() === key.toLowerCase()) {
        return places;
      }
    }
    
    // Return empty array if no match found
    return [];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        const popularPlaces = getPopularPlaces();
        return (
          <div className="step-content">
            <h2>Where would you like to go?</h2>
            <p className="step-description">Select your dream destination</p>
            <div className="input-group">
              <input
                type="text"
                placeholder="Search for a city or region (try 'Delhi' or 'Manali')"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="destination-input"
              />
            </div>
            {formData.destination && (
              <div className="selection-preview">
                <MapPin className="icon" />
                <span>{formData.destination}</span>
              </div>
            )}

            {/* Show popular places if we have data for this destination */}
            {popularPlaces.length > 0 && (
              <div className="popular-places-section">
                <h3><Globe size={20} /> Popular Places in {formData.destination}</h3>
                <p className="section-description">Select the places you'd like to visit</p>
                
                <div className="popular-places-grid">
                  {popularPlaces.map((place) => (
                    <div
                      key={place.id}
                      className={`popular-place-card ${formData.selectedPopularPlaces.includes(place.id) ? 'selected' : ''}`}
                      onClick={() => toggleSelection("selectedPopularPlaces", place.id)}
                    >
                      <div className="place-image-container">
                        <img src={place.image} alt={place.name} />
                        {formData.selectedPopularPlaces.includes(place.id) && (
                          <div className="selected-overlay">
                            <Check size={24} />
                          </div>
                        )}
                      </div>
                      <div className="place-details">
                        <h4>{place.name}</h4>
                        <p>{place.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2>When are you planning to travel?</h2>
            <p className="step-description">Select your travel dates</p>
            <div className="date-inputs">
              <div className="input-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.dateRange.from.toISOString().split('T')[0]}
                  onChange={(e) => setFormData({
                    ...formData,
                    dateRange: { ...formData.dateRange, from: new Date(e.target.value) }
                  })}
                />
              </div>
              <div className="input-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.dateRange.to.toISOString().split('T')[0]}
                  onChange={(e) => setFormData({
                    ...formData,
                    dateRange: { ...formData.dateRange, to: new Date(e.target.value) }
                  })}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2>What are your preferences?</h2>
            <p className="step-description">Customize your trip experience</p>
            
            <div className="preferences-section">
              <div className="preference-group">
                <h3>Hotel Rating</h3>
                <div className="radio-group">
                  {["3-star", "4-star", "5-star"].map((rating) => (
                    <label key={rating} className="radio-label">
                      <input
                        type="radio"
                        name="hotelRating"
                        value={rating}
                        checked={formData.hotelRating === rating}
                        onChange={(e) => setFormData({ ...formData, hotelRating: e.target.value })}
                      />
                      {rating}
                    </label>
                  ))}
                </div>
              </div>

              <div className="preference-group">
                <h3>Travel Mode</h3>
                <div className="radio-group">
                  {[
                    { value: "flight", icon: <Plane size={16} /> },
                    { value: "train", icon: <Train size={16} /> },
                    { value: "bus", icon: <Bus size={16} /> },
                    { value: "cab", icon: <Car size={16} /> },
                  ].map((mode) => (
                    <label key={mode.value} className="radio-label">
                      <input
                        type="radio"
                        name="travelMode"
                        value={mode.value}
                        checked={formData.travelMode === mode.value}
                        onChange={(e) => setFormData({ ...formData, travelMode: e.target.value })}
                      />
                      {mode.icon}
                      {mode.value}
                    </label>
                  ))}
                </div>
              </div>

              <div className="preference-group">
                <h3>Special Requirements</h3>
                <div className="checkbox-group">
                  {[
                    { value: "vegetarian", icon: <Utensils size={16} />, label: "Vegetarian Meals" },
                    { value: "adventure", icon: <Mountain size={16} />, label: "Adventure Activities" },
                    { value: "family", icon: <Umbrella size={16} />, label: "Family-Friendly" },
                  ].map((req) => (
                    <label key={req.value} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={req.value}
                        checked={formData.specialRequirements.includes(req.value)}
                        onChange={() => toggleSelection("specialRequirements", req.value)}
                      />
                      {req.icon}
                      {req.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h2>Add to your itinerary</h2>
            <p className="step-description">Select attractions and events you'd like to experience</p>

            <div className="selection-sections">
              {/* Attractions Section */}
              <div className="selection-section">
                <h3><Mountain size={20} /> Popular Attractions</h3>
                <div className="cards-grid">
                  {attractions.map((item) => (
                    <div
                      key={item.id}
                      className={`selection-card ${formData.selectedAttractions.includes(item.id) ? 'selected' : ''}`}
                      onClick={() => toggleSelection("selectedAttractions", item.id)}
                    >
                      <img src={item.image} alt={item.name} />
                      <div className="card-content">
                        <h4>{item.name}</h4>
                        <span className="badge">{item.type}</span>
                        {item.duration && <p className="duration">Duration: {item.duration}</p>}
                        <p className="price">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Events Section */}
              <div className="selection-section">
                <h3><Calendar size={20} /> Events & Festivals</h3>
                <div className="cards-grid">
                  {events.map((item) => (
                    <div
                      key={item.id}
                      className={`selection-card ${formData.selectedAttractions.includes(item.id) ? 'selected' : ''}`}
                      onClick={() => toggleSelection("selectedAttractions", item.id)}
                    >
                      <img src={item.image} alt={item.name} />
                      <div className="card-content">
                        <h4>{item.name}</h4>
                        <span className="badge">{item.type}</span>
                        <p className="event-date"><Clock size={14} /> {item.date}</p>
                        <p className="price">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="selection-section notes-section">
                <h3>Additional Notes</h3>
                <textarea
                  placeholder="Any specific requests or preferences for your activities?"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                  rows={4}
                  className="notes-input"
                ></textarea>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h2>Review Your Itinerary</h2>
            <p className="step-description">Check all details before submitting</p>

            <div className="review-section">
              <div className="review-item">
                <h3>Trip Details</h3>
                <p><strong>Destination:</strong> {formData.destination}</p>
                <p><strong>Dates:</strong> {formData.dateRange.from.toLocaleDateString()} - {formData.dateRange.to.toLocaleDateString()}</p>
                <p><strong>Duration:</strong> {Math.ceil((formData.dateRange.to - formData.dateRange.from) / (1000 * 60 * 60 * 24))} days</p>
              </div>

              <div className="review-item">
                <h3>Preferences</h3>
                <p><strong>Hotel Rating:</strong> {formData.hotelRating}</p>
                <p><strong>Travel Mode:</strong> {formData.travelMode}</p>
                {formData.specialRequirements.length > 0 && (
                  <div>
                    <strong>Special Requirements:</strong>
                    <ul>
                      {formData.specialRequirements.map(req => (
                        <li key={req}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Selected Activities Review */}
              {formData.selectedAttractions.length > 0 && (
                <div className="review-item">
                  <h3>Selected Activities & Events</h3>
                  <ul>
                    {formData.selectedAttractions.map(itemId => {
                      const item = [...attractions, ...events].find(a => a.id === itemId);
                      return item ? (
                        <li key={itemId}>{item.name} ({item.type})</li>
                      ) : null;
                    })}
                  </ul>
                </div>
              )}

              {formData.additionalNotes && (
                <div className="review-item">
                  <h3>Additional Notes</h3>
                  <p>{formData.additionalNotes}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="custom-itinerary-container">
      {/* Progress Steps */}
      <div className="progress-steps">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
            <div className="step-number">
              {currentStep > step ? <Check size={20} /> : step}
            </div>
            <span className="step-label">
              {step === 1 && "Destination"}
              {step === 2 && "Dates"}
              {step === 3 && "Preferences"}
              {step === 4 && "Activities"}
              {step === 5 && "Review"}
            </span>
          </div>
        ))}
      </div>

      <div className="form-content">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        {currentStep > 1 && (
          <button className="back-button" onClick={handleBack}>
            Back
          </button>
        )}
        
        {currentStep < 5 ? (
          <button 
            className="next-button"
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !formData.destination)
            }
          >
            Continue
            <ChevronRight size={20} />
          </button>
        ) : (
          <button className="submit-button" onClick={handleSubmit}>
            Submit Itinerary
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h2>Itinerary Submitted Successfully! 🎉</h2>
            <p>
              Our team will review your preferences and get back to you with the final price,
              detailed itinerary, and all booking arrangements.
            </p>
            <button onClick={() => setShowConfirmation(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
