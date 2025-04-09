import React, { useState, useEffect } from "react";
import { X, MapPin, Calendar, Clock, Star, Heart, User, UserPlus, UserCheck } from "lucide-react";
import api from "../config/api"; // Import the API client
import "./ItineraryDetailsModal.css";

function ItineraryDetailsModal({ itinerary, onClose }) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        if (!itinerary?._id) return;
        
        const response = await api.get(`/api/wishlist/check/itinerary/${itinerary._id}`);
        setIsInWishlist(response.data.inWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    const checkFollowStatus = async () => {
      try {
        const userId = itinerary.user?._id;
        if (!userId) return;
        
        const response = await api.get(`/api/users/follow-status/${userId}`);
        setIsFollowing(response.data.following);
      } catch (err) {
        console.error('Error checking follow status:', err);
        setIsFollowing(false);
      }
    };

    const fetchData = async () => {
      await checkWishlistStatus();
      
      // Only check follow status if we have a valid user ID
      if (itinerary.user?._id) {
        await checkFollowStatus();
      }
    };
    
    fetchData();
  }, [itinerary._id, itinerary.user]);

  const toggleWishlist = async () => {
    try {
      setLoading(true);
      
      if (isInWishlist) {
        await api.delete(`/api/wishlist/itineraries/${itinerary._id}`);
      } else {
        await api.post('/api/wishlist/itineraries', { itineraryId: itinerary._id });
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async () => {
    try {
      setFollowLoading(true);
      const userId = itinerary.user?._id;
      
      if (!userId) {
        console.error('No user ID to follow');
        return;
      }
      
      if (!isFollowing) {
        const response = await api.post(`/api/users/follow/${userId}`);
        setIsFollowing(true);
      } else {
        const response = await api.delete(`/api/users/unfollow/${userId}`);
        setIsFollowing(false);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Access error message correctly
        const errorMessage = err.response.data.error || err.response.data.message;
        
        if (errorMessage === 'Already following this user') {
          // If already following, just update the UI state
          setIsFollowing(true);
          console.warn('Already following this user');
        } else if (errorMessage === 'Cannot follow yourself') {
          alert("You cannot follow yourself");
        } else {
          // Some other 400 error
          console.error('Error following user:', errorMessage);
          alert(errorMessage || 'Unable to follow this user');
        }
      } else {
        console.error('Error toggling follow status:', err);
        alert('Failed to update follow status');
      }
    } finally {
      setFollowLoading(false);
    }
  };

  if (!itinerary) return null;

  return (
    <div className="itinerary-modal-overlay" onClick={onClose}>
      <div className="itinerary-modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-details">
          <h2 className="modal-title">{itinerary.title}</h2>
          
          {/* Organizer Information */}
          {itinerary.user && (
            <div className="organizer-section">
              <div className="organizer-info">
                <User size={20} />
                <span className="organizer-name">
                  Organized by: <strong>{itinerary.user.name}</strong>
                  <span className="organizer-role">({itinerary.user.role === 'trip_manager' ? 'Trip Manager' : 'Traveler'})</span>
                </span>
              </div>
              <button 
                className={`follow-button ${isFollowing ? 'following' : ''}`}
                onClick={toggleFollow}
                disabled={followLoading}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={18} />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Follow
                  </>
                )}
              </button>
            </div>
          )}
          
          <div className="modal-info-grid">
            <div className="info-item">
              <Calendar size={20} />
              <span>{itinerary.days} Days, {itinerary.nights} Nights</span>
            </div>

            <div className="info-item">
              <Star size={20} />
              <span>{itinerary.rewardPoints} Reward Points</span>
            </div>
          </div>

          <div className="modal-description">
            <h3>About this Trip</h3>
            <p>{itinerary.description}</p>
          </div>

          <div className="destinations-section">
            <h3>Destinations</h3>
            <div className="destinations-timeline">
              {itinerary.destinations.map((dest, index) => (
                <div key={index} className="destination-item">
                  <div className="destination-marker"></div>
                  <div className="destination-details">
                    <h4>
                      <MapPin size={16} />
                      {dest.location}
                    </h4>
                    <div className="destination-dates">
                      <p>
                        <Clock size={14} />
                        Arrival: {new Date(dest.arrivalDate).toLocaleDateString()}
                      </p>
                      <p>
                        <Clock size={14} />
                        Departure: {new Date(dest.departureDate).toLocaleDateString()}
                      </p>
                    </div>
                    {dest.accommodation && (
                      <p className="accommodation">
                        Stay: {dest.accommodation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {itinerary.events && itinerary.events.length > 0 && (
            <div className="events-section">
              <h3>Planned Events</h3>
              <div className="events-list">
                {itinerary.events.map((event, index) => (
                  <div key={index} className="planned-event">
                    <h4>{event.name}</h4>
                    <p>{event.description}</p>
                    <div className="event-meta">
                      <span>
                        <Calendar size={14} />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span>
                        <MapPin size={14} />
                        {event.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-price-section">
            <div className="price-details">
              <span className="price-amount">₹{itinerary.price}</span>
            </div>
            <div className="action-buttons">
              <button 
                className={`wishlist-button ${isInWishlist ? 'in-wishlist' : ''}`} 
                onClick={toggleWishlist}
                disabled={loading}
              >
                <Heart size={20} fill={isInWishlist ? "#ef4444" : "none"} />
                {isInWishlist ? 'Saved' : 'Save'}
              </button>
              <button className="book-button">Book Now</button>
              <div className="status-badge" data-status={itinerary.status.toLowerCase()}>
                {itinerary.status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItineraryDetailsModal;