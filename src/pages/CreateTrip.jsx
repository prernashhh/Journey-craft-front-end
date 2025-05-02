import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './CreateTrip.css';

function CreateTrip() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tripData, setTripData] = useState({
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
    days: 1,
    nights: 0,
    price: 0,
    rewardPoints: 100,
    status: 'Draft', // Capitalized to match the server model
    destinations: []
  });

  // Add a destination to the trip
  const addDestination = () => {
    // Only add if we have start and end dates
    if (!tripData.startDate || !tripData.endDate) {
      setError('Please set trip start and end dates first');
      return;
    }
    
    setTripData({
      ...tripData,
      destinations: [
        ...tripData.destinations,
        { 
          location: '', 
          arrivalDate: tripData.startDate, 
          departureDate: tripData.endDate,
          accommodation: '' 
        }
      ]
    });
    
    // Clear any previous errors
    setError(null);
  };

  // Update a destination field
  const updateDestination = (index, field, value) => {
    const updatedDestinations = [...tripData.destinations];
    updatedDestinations[index] = { 
      ...updatedDestinations[index], 
      [field]: value 
    };
    setTripData({ ...tripData, destinations: updatedDestinations });
  };

  // Remove a destination
  const removeDestination = (index) => {
    const updatedDestinations = [...tripData.destinations];
    updatedDestinations.splice(index, 1);
    setTripData({ ...tripData, destinations: updatedDestinations });
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData({ ...tripData, [name]: value });

    // Update days/nights based on date changes
    if (name === 'startDate' || name === 'endDate') {
      if (tripData.startDate && tripData.endDate) {
        const start = new Date(name === 'startDate' ? value : tripData.startDate);
        const end = new Date(name === 'endDate' ? value : tripData.endDate);
        
        if (end >= start) {
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setTripData(prev => ({
            ...prev,
            days: diffDays + 1,
            nights: diffDays
          }));
        }
      }
    }
  };

  // Submit form to create a new trip
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Ensure dates are formatted properly
      const formatDateString = (dateStr) => {
        if (!dateStr) return '';
        // Ensure it's in ISO format for MongoDB
        const date = new Date(dateStr);
        return date.toISOString();
      };

      // Prepare the data according to your backend's expectations
      const tripPayload = {
        title: tripData.title,
        description: tripData.description,
        destination: tripData.destination,
        startDate: formatDateString(tripData.startDate),
        endDate: formatDateString(tripData.endDate),
        days: Number(tripData.days),
        nights: Number(tripData.nights),
        price: Number(tripData.price),
        rewardPoints: Number(tripData.rewardPoints),
        status: 'Draft', // Capitalize to match enum in server model
        destinations: tripData.destinations.map(dest => ({
          location: dest.location,
          arrivalDate: formatDateString(dest.arrivalDate),
          departureDate: formatDateString(dest.departureDate),
          accommodation: dest.accommodation
        }))
      };
      
      // Add validation to ensure required fields have values
      if (!tripPayload.title || !tripPayload.destination || 
          !tripPayload.startDate || !tripPayload.endDate || 
          tripPayload.destinations.some(dest => !dest.location)) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      console.log('Sending payload:', tripPayload); // For debugging
      
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://journety-craft-backend.onrender.com/api/itineraries',
        tripPayload,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      navigate('/manager-dashboard');
    } catch (err) {
      console.error('Error creating trip:', err);
      // More specific error message based on the response
      if (err.response && err.response.data && err.response.data.error) {
        setError(`Failed to create trip: ${err.response.data.error}`);
      } else {
        setError('Failed to create trip. Please check your form data and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-trip-page">
      <Navbar />
      <div className="create-trip-container">
        <div className="page-header">
          <h1>Create New Trip</h1>
          <p>Design a new travel experience for your customers</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="trip-form">
          <div className="form-section">
            <h2>Trip Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Trip Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={tripData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="destination">Main Destination*</label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={tripData.destination}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Start Date*</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={tripData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date*</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={tripData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="days">Days</label>
                <input
                  type="number"
                  id="days"
                  name="days"
                  value={tripData.days}
                  onChange={handleChange}
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nights">Nights</label>
                <input
                  type="number"
                  id="nights"
                  name="nights"
                  value={tripData.nights}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (₹)*</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={tripData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="rewardPoints">Reward Points</label>
                <input
                  type="number"
                  id="rewardPoints"
                  name="rewardPoints"
                  value={tripData.rewardPoints}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description*</label>
                <textarea
                  id="description"
                  name="description"
                  value={tripData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h2>Destinations</h2>
              <button 
                type="button" 
                className="add-button"
                onClick={addDestination}
              >
                Add Destination
              </button>
            </div>

            {tripData.destinations.length === 0 ? (
              <div className="no-destinations">
                <p>No destinations added yet. Click "Add Destination" to get started.</p>
              </div>
            ) : (
              tripData.destinations.map((destination, index) => (
                <div key={index} className="destination-card">
                  <div className="destination-header">
                    <h3>Destination {index + 1}</h3>
                    <button 
                      type="button" 
                      className="remove-button"
                      onClick={() => removeDestination(index)}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor={`location-${index}`}>Location*</label>
                      <input
                        type="text"
                        id={`location-${index}`}
                        value={destination.location}
                        onChange={(e) => updateDestination(index, 'location', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`accommodation-${index}`}>Accommodation</label>
                      <input
                        type="text"
                        id={`accommodation-${index}`}
                        value={destination.accommodation}
                        onChange={(e) => updateDestination(index, 'accommodation', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`arrivalDate-${index}`}>Arrival Date*</label>
                      <input
                        type="date"
                        id={`arrivalDate-${index}`}
                        value={destination.arrivalDate}
                        onChange={(e) => updateDestination(index, 'arrivalDate', e.target.value)}
                        min={tripData.startDate}
                        max={tripData.endDate}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`departureDate-${index}`}>Departure Date*</label>
                      <input
                        type="date"
                        id={`departureDate-${index}`}
                        value={destination.departureDate}
                        onChange={(e) => updateDestination(index, 'departureDate', e.target.value)}
                        min={destination.arrivalDate || tripData.startDate}
                        max={tripData.endDate}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/manager-dashboard')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Creating Trip...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTrip;