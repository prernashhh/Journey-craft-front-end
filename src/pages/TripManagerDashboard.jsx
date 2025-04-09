import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './TripManagerDashboard.css';

function TripManagerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if user is not authenticated or not a trip manager
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'trip_manager') {
      navigate('/dashboard');
      return;
    }

    // Fetch user's created itineraries
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:5000/api/itineraries/my-itineraries',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTrips(response.data);
      } catch (err) {
        setError('Failed to load trips. Please try again later.');
        console.error('Error fetching trips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [isAuthenticated, user, navigate]);

  const handleCreateTrip = () => {
    navigate('/create-trip');
  };

  return (
    <div className="trip-manager-dashboard">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Trip Manager Dashboard</h1>
          <button 
            className="create-trip-btn"
            onClick={handleCreateTrip}
          >
            Create New Trip
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading trips...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="trips-section">
            <h2>Your Created Trips</h2>
            {trips.length === 0 ? (
              <div className="no-trips">
                <p>You haven't created any trips yet.</p>
                <p>Click on "Create New Trip" to get started!</p>
              </div>
            ) : (
              <div className="trips-grid">
                {trips.map((trip) => (
                  <div key={trip._id} className="trip-card">
                    <div className="trip-image">
                      {trip.coverImage ? (
                        <img src={trip.coverImage} alt={trip.title} />
                      ) : (
                        <div className="placeholder-image">No Image</div>
                      )}
                    </div>
                    <div className="trip-details">
                      <h3>{trip.title}</h3>
                      <p className="trip-destination">{trip.destination}</p>
                      <div className="trip-duration">
                        <span>{new Date(trip.startDate).toLocaleDateString()}</span>
                        <span> - </span>
                        <span>{new Date(trip.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="trip-actions">
                        <button onClick={() => navigate(`/trips/${trip._id}`)}>View</button>
                        <button onClick={() => navigate(`/trips/${trip._id}/edit`)}>Edit</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TripManagerDashboard;