import React, { useState, useEffect } from "react";
import { X, MapPin, Calendar, Clock, Star, Heart, User, UserPlus, UserCheck } from "lucide-react";
import axios from "axios";
import "./ItineraryDetailsModal.css";

function ItineraryDetailsModal({ itinerary, onClose }) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(
          `https://journety-craft-backend.onrender.com/api/wishlist/check/itinerary/${itinerary._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInWishlist(response.data.inWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
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
  }, [itinerary._id]);

  // Update checkFollowStatus function
  const checkFollowStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const userId = itinerary.user?._id;
      if (!userId) return;
      
      // Fix the API endpoint path
      const response = await axios.get(`https://journety-craft-backend.onrender.com/api/users/follow-status/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFollowing(response.data.following);
    } catch (err) {
      console.error('Error checking follow status:', err);
      setIsFollowing(false);
    }
  };

  const toggleWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to add to wishlist');
        return;
      }

      if (isInWishlist) {
        await axios.delete(
          `https://journety-craft-backend.onrender.com/api/wishlist/itineraries/${itinerary._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'https://journety-craft-backend.onrender.com/api/wishlist/itineraries',
          { itineraryId: itinerary._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  // Also update handleFollowToggle function where needed
  const handleFollowToggle = async () => {
    try {
      setFollowLoading(true);
      const token = localStorage.getItem('token');
      
      const userId = itinerary.user?._id;
      if (!userId) {
        console.error('No valid user ID found');
        return;
      }
      
      // Check if the user is trying to follow themselves
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser && currentUser._id === userId) {
        alert("You cannot follow yourself");
        setFollowLoading(false);
        return;
      }
      
      if (isFollowing) {
        // Unfollow endpoint stays the same
        await axios.delete(`https://journety-craft-backend.onrender.com/api/users/follow/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(false);
      } else {
        try {
          // Follow endpoint stays the same
          const response = await axios.post(`https://journety-craft-backend.onrender.com/api/users/follow/${userId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsFollowing(true);
        } catch (err) {
          if (err.response && err.response.status === 400) {
            // The key fix - access error message correctly
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
            throw err; // Re-throw other errors
          }
        }
      }
    } catch (err) {
      console.error('Error updating follow status:', err);
      alert('Failed to update follow status. Please try again later.');
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
                onClick={handleFollowToggle}
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