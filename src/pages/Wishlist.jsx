import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Eye, Trash2, Clock, Map, Heart } from "react-feather";
import "./Wishlist.css";

function Wishlist() {
  const [wishlistData, setWishlistData] = useState({ events: [], itineraries: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("https://journety-craft-backend.onrender.com/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistData(response.data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (type, id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://journety-craft-backend.onrender.com/api/wishlist/${type}s/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWishlist();
    } catch (err) {
      console.error(`Error removing ${type} from wishlist:`, err);
    }
  };

  const filteredItems = () => {
    if (activeTab === "all") {
      return {
        events: wishlistData.events,
        itineraries: wishlistData.itineraries,
      };
    } else if (activeTab === "events") {
      return {
        events: wishlistData.events,
        itineraries: [],
      };
    } else {
      return {
        events: [],
        itineraries: wishlistData.itineraries,
      };
    }
  };

  const totalItems = wishlistData.events.length + wishlistData.itineraries.length;

  return (
    <div className="wishlist-page">
      <div className="wishlist-banner">
        <div className="wishlist-banner-content">
          <h1>
            My <span>Wishlist</span>
          </h1>
          <p>Your saved destinations and experiences</p>
        </div>
      </div>

      <div className="wishlist-container">
        <div className="wishlist-header">
          <div className="wishlist-tabs">
            <button
              className={`wishlist-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Items <span className="count">{totalItems}</span>
            </button>
            <button
              className={`wishlist-tab ${activeTab === "events" ? "active" : ""}`}
              onClick={() => setActiveTab("events")}
            >
              Events <span className="count">{wishlistData.events.length}</span>
            </button>
            <button
              className={`wishlist-tab ${activeTab === "itineraries" ? "active" : ""}`}
              onClick={() => setActiveTab("itineraries")}
            >
              Itineraries <span className="count">{wishlistData.itineraries.length}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="wishlist-loading">
            <div className="spinner"></div>
            <p>Loading your wishlist...</p>
          </div>
        ) : totalItems === 0 ? (
          <div className="empty-wishlist">
            <Heart size={60} color="#cbd5e1" />
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite destinations and experiences by clicking the heart icon.</p>
            <Link to="/explore" className="explore-button">
              Explore Now
            </Link>
          </div>
        ) : (
          <div className="wishlist-content">
            {filteredItems().events.length > 0 && (
              <div className="wishlist-section">
                <h2>Events</h2>
                <div className="wishlist-grid">
                  {filteredItems().events.map((event) => (
                    <div key={event._id} className="wishlist-card">
                      <div className="wishlist-card-header">
                        {event.images && event.images[0] && (
                          <img
                            src={event.images[0].url}
                            alt={event.title}
                            className="wishlist-image"
                          />
                        )}
                      </div>
                      <div className="wishlist-card-body">
                        <h3 className="wishlist-item-title">{event.title}</h3>
                        <p className="wishlist-item-location">
                          <MapPin size={14} />
                          {event.location.city}, {event.location.country}
                        </p>
                        <p className="wishlist-item-date">
                          <Calendar size={14} />
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                        <div className="wishlist-price">₹{event.price.amount}</div>
                      </div>
                      <div className="wishlist-card-actions">
                        <Link 
                          to={`/events/${event._id}`}
                          className="wishlist-view-button"
                        >
                          <Eye size={18} />
                          Details
                        </Link>
                        <button
                          className="wishlist-remove-button"
                          onClick={() => removeFromWishlist("event", event._id)}
                        >
                          <Trash2 size={18} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredItems().itineraries.length > 0 && (
              <div className="wishlist-section">
                <h2>Itineraries</h2>
                <div className="wishlist-grid">
                  {filteredItems().itineraries.map((itinerary) => (
                    <div key={itinerary._id} className="wishlist-card">
                      <div className="wishlist-card-header">
                        {itinerary.coverImage && (
                          <img
                            src={itinerary.coverImage}
                            alt={itinerary.title}
                            className="wishlist-image"
                          />
                        )}
                      </div>
                      <div className="wishlist-card-body">
                        <h3 className="wishlist-item-title">{itinerary.title}</h3>
                        <div className="wishlist-item-details">
                          <div className="wishlist-item-duration">
                            <Clock size={14} />
                            {itinerary.duration} days
                          </div>
                          <div className="wishlist-item-destinations">
                            <span className="wishlist-destination">
                              <Map size={12} />
                              {itinerary.destination}
                            </span>
                          </div>
                        </div>
                        <div className="wishlist-price">From ₹{itinerary.price}</div>
                      </div>
                      <div className="wishlist-card-actions">
                        <Link 
                          to={`/itineraries/${itinerary._id}`}
                          className="wishlist-view-button"
                        >
                          <Eye size={18} />
                          Details
                        </Link>
                        <button
                          className="wishlist-remove-button"
                          onClick={() => removeFromWishlist("itinerary", itinerary._id)}
                        >
                          <Trash2 size={18} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;