import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Heart, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./event-card.css";

export function EventCard({
  id,
  name,
  description,
  date,
  location,
  duration,
  price,
  image
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Check if event is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !id) return;

        const response = await axios.get(
          `https://journety-craft-backend.onrender.com/api/wishlist/check/event/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(response.data.inWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [id]);

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
          `https://journety-craft-backend.onrender.com/api/wishlist/events/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'https://journety-craft-backend.onrender.com/api/wishlist/events',
          { eventId: id },
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
    navigate(`/events/${id}`);
  };

  return (
    <div
      className="event-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="image-container">
        <img src={image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop"} alt={name} />
        <div className="img-overlay"></div>
        <button 
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
        >
          <Heart fill={isFavorite ? "#fff" : "none"} stroke={isFavorite ? "none" : "#fff"} />
        </button>
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3>{name}</h3>
          <p className="location-text">
            <MapPin size={14} />
            {location}
          </p>
        </div>

        <div className="event-details">
          <div className="detail-item">
            <Calendar size={16} className="icon" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
          
          {duration && (
            <div className="detail-item">
              <Clock size={16} className="icon" />
              <span>{duration}</span>
            </div>
          )}
        </div>

        <div className="description-container">
          <p className="event-description">{description ? description.substring(0, 100) + (description.length > 100 ? '...' : '') : ''}</p>
        </div>

        <div className="card-footer">
          <div className="price">
            ₹{price?.amount?.toLocaleString() || price?.toLocaleString() || 0}
            <span className="price-subtitle">per person</span>
          </div>
          <button className="view-details-button">View Details</button>
        </div>
      </div>
    </div>
  );
}