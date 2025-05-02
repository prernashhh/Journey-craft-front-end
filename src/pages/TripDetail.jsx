import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './TripDetail.css';

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://journety-craft-backend.onrender.com/api/itineraries/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrip(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trip details:', err);
        setError('Failed to load trip details. Please try again later.');
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  if (loading) return (
    <div>
      <Navbar />
      <div className="navbar-spacer"></div>
      <div className="trip-detail-container">
        <div className="loading">Loading trip details...</div>
      </div>
    </div>
  );

  if (error) return (
    <div>
      <Navbar />
      <div className="navbar-spacer"></div>
      <div className="trip-detail-container">
        <div className="error-message">{error}</div>
        <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );

  if (!trip) return (
    <div>
      <Navbar />
      <div className="navbar-spacer"></div>
      <div className="trip-detail-container">
        <div className="error-message">Trip not found</div>
        <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="navbar-spacer"></div>
      <div className="trip-detail-container">
        <div className="trip-detail-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1>{trip.title}</h1>
          <div className="trip-meta">
            <span className="destination">{trip.destination}</span>
            <span className="price">₹{trip.price}</span>
            <span className={`status ${trip.status.toLowerCase()}`}>{trip.status}</span>
          </div>
        </div>

        <div className="trip-section">
          <h2>Trip Details</h2>
          <div className="trip-info">
            <div className="info-item">
              <strong>Duration:</strong> {trip.days} Days, {trip.nights} Nights
            </div>
            <div className="info-item">
              <strong>Dates:</strong> {new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()}
            </div>
            <div className="info-item">
              <strong>Reward Points:</strong> {trip.rewardPoints}
            </div>
            <div className="description">
              <h3>Description</h3>
              <p>{trip.description}</p>
            </div>
          </div>
        </div>

        {trip.destinations && trip.destinations.length > 0 && (
          <div className="trip-section">
            <h2>Destinations</h2>
            <div className="destinations-list">
              {trip.destinations.map((dest, index) => (
                <div key={index} className="destination-card">
                  <h3>{dest.location}</h3>
                  <div className="destination-details">
                    <div className="detail-item">
                      <strong>Arrival:</strong> {new Date(dest.arrivalDate).toLocaleDateString()}
                    </div>
                    <div className="detail-item">
                      <strong>Departure:</strong> {new Date(dest.departureDate).toLocaleDateString()}
                    </div>
                    {dest.accommodation && (
                      <div className="detail-item">
                        <strong>Accommodation:</strong> {dest.accommodation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {trip.events && trip.events.length > 0 && (
          <div className="trip-section">
            <h2>Events</h2>
            <div className="events-list">
              {trip.events.map((event, index) => (
                <div key={index} className="event-card">
                  <h3>{event.name}</h3>
                  <div className="event-details">
                    <div className="detail-item">
                      <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="detail-item">
                      <strong>Location:</strong> {event.location}
                    </div>
                    {event.description && (
                      <div className="detail-item">
                        <strong>Description:</strong> {event.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="trip-actions">
          <button 
            className="edit-button"
            onClick={() => navigate(`/trips/${trip._id}/edit`)}
          >
            Edit Trip
          </button>
        </div>
      </div>
    </div>
  );
}

export default TripDetail;