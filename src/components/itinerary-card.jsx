import React, { useState, useEffect } from "react";
import { Star, Calendar, Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function ItineraryCard({
  title,
  destination,
  duration,
  price,
  rating,
  image,
  highlights,
  included,
  itineraryId
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Check if itinerary is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !itineraryId) return;

        const response = await axios.get(
          `https://journety-craft-backend.onrender.com/api/wishlist/check/itinerary/${itineraryId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(response.data.inWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [itineraryId]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to add to favorites');
        return;
      }

      if (isFavorite) {
        await axios.delete(
          `https://journety-craft-backend.onrender.com/api/wishlist/itineraries/${itineraryId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'https://journety-craft-backend.onrender.com/api/wishlist/itineraries',
          { itineraryId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update favorites');
    }
  };

  const handleCardClick = () => {
    navigate(`/itineraries/${itineraryId}`);
  };

  return (
    <div
      className="itinerary-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="image-container">
        <img src={image} alt={title} />
        <div className="img-overlay"></div>
        <button 
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
        >
          <Heart fill={isFavorite ? "#fff" : "none"} stroke={isFavorite ? "none" : "#fff"} />
        </button>
        <div className="rating">
          <Star size={16} fill="#FFC857" stroke="none" />
          <span>{rating}</span>
        </div>
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3>{title}</h3>
          <p className="destination-text">
            <MapPin size={14} />
            {destination}
          </p>
        </div>

        <div className="duration-container">
          <Calendar size={16} className="icon" />
          <span>{duration}</span>
        </div>

        <div className="details-section">
          <div className="highlights">
            <h4>Destinations</h4>
            <div className="tags">
              {highlights.slice(0, 2).map((highlight, index) => (
                <span key={index} className="tag">{highlight}</span>
              ))}
              {highlights.length > 2 && (
                <span className="tag more">+{highlights.length - 2} more</span>
              )}
            </div>
          </div>

          {included && included.length > 0 && (
            <div className="included">
              <h4>Included</h4>
              <div className="tags">
                {included.slice(0, 2).map((item, index) => (
                  <span key={index} className="tag">{item}</span>
                ))}
                {included.length > 2 && (
                  <span className="tag more">+{included.length - 2} more</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="card-footer">
          <div className="price">
            ₹{price.toLocaleString()}
            <span className="price-subtitle">per person</span>
          </div>
          <button className="book-now-button">View Details</button>
        </div>
      </div>
    </div>
  );
}
