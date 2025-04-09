import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, Users, Tag, Heart, Share2, ArrowRight } from 'lucide-react';
import api from '../config/api.js'; // Import the API client
import './EventDetailsModal.css';
import PaymentModal from './PaymentModal';

function EventDetailsModal({ event, onClose }) {
  const [showPayment, setShowPayment] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        if (!event?._id) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await api.get(`/api/wishlist/check/event/${event._id}`);
        setIsInWishlist(response.data.inWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [event._id]);

  const handleBooking = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    alert('Booking successful!');
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
        await api.delete(`/api/wishlist/events/${event._id}`);
      } else {
        await api.post('/api/wishlist/events', { eventId: event._id });
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  return (
    <>
      <div className="event-modal-overlay" onClick={onClose}>
        <div className="event-modal-content" onClick={e => e.stopPropagation()}>
          <button className="modal-close-button" onClick={onClose}>
            <X size={24} />
          </button>

          {/* Image display temporarily removed
          {event.images?.[0] && (
            <div className="modal-image-container">
              <img 
                src={event.images[0].url} 
                alt={event.title} 
                className="modal-image"
              />
            </div>
          )}
          */}

          <div className="modal-details">
            <h2 className="modal-title">{event.title}</h2>
            
            <div className="modal-info-grid">
              <div className="info-item">
                <Calendar size={20} />
                <span>{new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>

              <div className="info-item">
                <MapPin size={20} />
                <span>{event.location.city}, {event.location.country}</span>
              </div>

              <div className="info-item">
                <Clock size={20} />
                <span>{event.duration.hours}h {event.duration.minutes}m</span>
              </div>

              <div className="info-item">
                <Users size={20} />
                <span>{event.capacity} spots available</span>
              </div>
            </div>

            <div className="modal-description">
              <h3>About this event</h3>
              <p>{event.description}</p>
            </div>

            {event.tags && event.tags.length > 0 && (
              <div className="modal-tags">
                {event.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    <Tag size={14} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="modal-price-section">
              <div className="price-details">
                <span className="price-amount">₹{event.price.amount}</span>
                <span className="price-currency">{event.price.currency}</span>
              </div>
              <div className="modal-actions">
                <button 
                  className={`wishlist-button ${isInWishlist ? 'in-wishlist' : ''}`} 
                  onClick={toggleWishlist}
                  disabled={loading}
                >
                  <Heart size={20} fill={isInWishlist ? "#ef4444" : "none"} />
                  {isInWishlist ? 'Saved' : 'Save'}
                </button>
                <button className="book-button" onClick={handleBooking}>Book Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal 
          event={event}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}

export default EventDetailsModal;