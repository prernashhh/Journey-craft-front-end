import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  User,
  Star,
  CheckCircle,
  ChevronLeft,
  Share2,
  Hotel,
  CircleDot,
  Palmtree,
  Info
} from "lucide-react";
import "./ItineraryDetailView.css";

function ItineraryDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch itinerary data
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://journety-craft-backend.onrender.com/api/itineraries/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setItinerary(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching itinerary details:", err);
        setError("Failed to load itinerary details.");
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  // Check wishlist status
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !id) return;

        const response = await axios.get(
          `https://journety-craft-backend.onrender.com/api/wishlist/check/itinerary/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInWishlist(response.data.inWishlist);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [id]);

  const toggleWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add to wishlist");
        return;
      }

      if (isInWishlist) {
        await axios.delete(
          `https://journety-craft-backend.onrender.com/api/wishlist/itineraries/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "https://journety-craft-backend.onrender.com/api/wishlist/itineraries",
          { itineraryId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("Failed to update wishlist");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="itinerary-detail-container">
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading itinerary details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div>
        <Navbar />
        <div className="itinerary-detail-container">
          <div className="error-container">
            <h2>Oops! Something went wrong</h2>
            <p>{error || "The itinerary could not be found."}</p>
            <button 
              className="back-button"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={18} /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="itinerary-detail-container">
        <button 
          className="back-button" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} /> Back to Search Results
        </button>
        
        <div className="itinerary-layout">
          {/* Main content area */}
          <div className="itinerary-main-content">
            <div className="itinerary-card detail-card">
              <div className="card-header-image">
                <img 
                  src={itinerary.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1470&auto=format&fit=crop"} 
                  alt={itinerary.title} 
                />
                <div className="image-overlay"></div>
                <div className="header-content">
                  <h1>{itinerary.title}</h1>
                  <div className="location-badge">
                    <MapPin size={16} /> {itinerary.destination}
                  </div>
                </div>
              </div>
              
              <div className="card-body">
                <div className="tab-navigation">
                  <button 
                    className={activeTab === "overview" ? "active" : ""}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                  <button 
                    className={activeTab === "itinerary" ? "active" : ""}
                    onClick={() => setActiveTab("itinerary")}
                  >
                    Itinerary
                  </button>
                  <button 
                    className={activeTab === "events" ? "active" : ""}
                    onClick={() => setActiveTab("events")}
                  >
                    Events
                  </button>
                </div>
                
                <div className="tab-content">
                  {activeTab === "overview" && (
                    <div className="overview-tab">
                      <div className="description-section">
                        <h3>About This Trip</h3>
                        <p>{itinerary.description}</p>
                      </div>
                      
                      <div className="highlights-section">
                        <h3>Trip Highlights</h3>
                        <ul className="highlights-list">
                          {itinerary.destinations.map((destination, index) => (
                            <li key={index}>
                              <CheckCircle size={18} className="highlight-icon" />
                              <span>Visit {destination.location}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="inclusions-section">
                        <h3>What's Included</h3>
                        <ul className="inclusion-list">
                          <li>
                            <CheckCircle size={18} className="inclusion-icon" />
                            <span>Hotel Accommodation</span>
                          </li>
                          <li>
                            <CheckCircle size={18} className="inclusion-icon" />
                            <span>Sightseeing as per itinerary</span>
                          </li>
                          <li>
                            <CheckCircle size={18} className="inclusion-icon" />
                            <span>Daily Breakfast</span>
                          </li>
                          <li>
                            <CheckCircle size={18} className="inclusion-icon" />
                            <span>All transfers and transportation</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "itinerary" && (
                    <div className="itinerary-tab">
                      <div className="timeline">
                        {itinerary.destinations.map((destination, index) => (
                          <div key={index} className="timeline-item">
                            <div className="timeline-marker">
                              <CircleDot size={20} />
                            </div>
                            <div className="timeline-content">
                              <div className="destination-card">
                                <h3>{destination.location}</h3>
                                <div className="date-range">
                                  <Calendar size={16} />
                                  <span>
                                    {new Date(destination.arrivalDate).toLocaleDateString()} - 
                                    {new Date(destination.departureDate).toLocaleDateString()}
                                  </span>
                                </div>
                                {destination.accommodation && (
                                  <div className="accommodation">
                                    <Hotel size={16} />
                                    <span>{destination.accommodation}</span>
                                  </div>
                                )}
                                <div className="destination-activities">
                                  <h4>Activities:</h4>
                                  <div className="activity">
                                    <Palmtree size={16} />
                                    <span>Local sightseeing</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "events" && (
                    <div className="events-tab">
                      {itinerary.events && itinerary.events.length > 0 ? (
                        <div className="events-grid">
                          {itinerary.events.map((event, index) => (
                            <div key={index} className="event-card">
                              <h3>{event.name}</h3>
                              <p className="event-description">{event.description}</p>
                              <div className="event-details">
                                <div className="event-detail">
                                  <Calendar size={16} />
                                  <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="event-detail">
                                  <MapPin size={16} />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-events">
                          <Info size={24} />
                          <p>No special events have been planned for this itinerary.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="itinerary-sidebar">
            <div className="booking-card">
              <div className="booking-card-header">
                <h3>Trip Summary</h3>
              </div>
              
              <div className="booking-card-body">
                <div className="trip-info">
                  <div className="info-row">
                    <span className="info-label">Duration</span>
                    <span className="info-value">{itinerary.days} Days / {itinerary.nights} Nights</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Start Date</span>
                    <span className="info-value">{new Date(itinerary.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">End Date</span>
                    <span className="info-value">{new Date(itinerary.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Reward Points</span>
                    <span className="info-value">{itinerary.rewardPoints} Points</span>
                  </div>
                </div>
                
                <div className="price-container">
                  <div className="price-label">Price Per Person</div>
                  <div className="price-amount">₹{itinerary.price.toLocaleString()}</div>
                </div>
                
                <div className="booking-actions">
                  <button className="book-now-btn">Book Now</button>
                  <button 
                    className={`wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}`}
                    onClick={toggleWishlist}
                  >
                    <Heart fill={isInWishlist ? "#ef4444" : "none"} />
                    {isInWishlist ? 'Saved' : 'Save to Wishlist'}
                  </button>
                  <button className="share-btn">
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
            
            {itinerary.user && (
              <div className="organizer-card">
                <div className="organizer-header">
                  <h3>Trip Organizer</h3>
                </div>
                <div className="organizer-body">
                  <div className="organizer-avatar">
                    <User size={24} />
                  </div>
                  <div className="organizer-details">
                    <div className="organizer-name">{itinerary.user.name}</div>
                    <div className="organizer-role">
                      {itinerary.user.role === "trip_manager" ? "Trip Manager" : "Traveler"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItineraryDetailView;