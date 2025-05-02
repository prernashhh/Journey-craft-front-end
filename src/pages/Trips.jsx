import React, { useState, useEffect } from 'react';
import { Search } from "lucide-react";
import axios from 'axios';
import './Trips.css';
import ItineraryDetailsModal from '../components/ItineraryDetailsModal';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { ItineraryCard } from "../components/itinerary-card";

function Trips() {
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useState({
    title: '',
    destination: '',
    priceMin: '',
    priceMax: '',
    status: '',
    dateStart: '',
    dateEnd: '',
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://journety-craft-backend.onrender.com/api/itineraries', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItineraries(response.data);
        setFilteredItineraries(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching itineraries:', err);
        setError('Failed to load itineraries');
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  const handleSimpleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterItineraries(query, searchParams);
  };

  const handleAdvancedSearchChange = (e) => {
    const { name, value } = e.target;
    const updatedParams = { ...searchParams, [name]: value };
    setSearchParams(updatedParams);
    filterItineraries(searchQuery, updatedParams);
  };

  const formatDateForComparison = (dateString) => {
    if (!dateString) return null;
    
    // Create a date at the start of the day in local timezone
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const filterItineraries = (query, params) => {
    let filtered = [...itineraries];

    // Simple search by query
    if (query) {
      filtered = filtered.filter(itinerary => {
        const titleMatch = itinerary.title.toLowerCase().includes(query);
        const descriptionMatch = itinerary.description?.toLowerCase().includes(query);
        const destinationMatch = itinerary.destinations.some(dest => 
          dest.location.toLowerCase().includes(query)
        );
        return titleMatch || descriptionMatch || destinationMatch;
      });
    }

    // Advanced filters
    if (params.title) {
      filtered = filtered.filter(itinerary => 
        itinerary.title.toLowerCase().includes(params.title.toLowerCase())
      );
    }

    if (params.destination) {
      filtered = filtered.filter(itinerary => 
        itinerary.destinations.some(dest => 
          dest.location.toLowerCase().includes(params.destination.toLowerCase())
        )
      );
    }

    if (params.priceMin) {
      filtered = filtered.filter(itinerary => 
        itinerary.price >= parseFloat(params.priceMin)
      );
    }

    if (params.priceMax) {
      filtered = filtered.filter(itinerary => 
        itinerary.price <= parseFloat(params.priceMax)
      );
    }

    if (params.status) {
      filtered = filtered.filter(itinerary => 
        itinerary.status.toLowerCase() === params.status.toLowerCase()
      );
    }

    // Fixed date filtering
    if (params.dateStart) {
      const startFilterDate = formatDateForComparison(params.dateStart);
      if (startFilterDate) {
        filtered = filtered.filter(itinerary => {
          const itineraryStartDate = formatDateForComparison(itinerary.startDate);
          return itineraryStartDate && itineraryStartDate >= startFilterDate;
        });
      }
    }

    if (params.dateEnd) {
      const endFilterDate = formatDateForComparison(params.dateEnd);
      if (endFilterDate) {
        filtered = filtered.filter(itinerary => {
          const itineraryEndDate = formatDateForComparison(itinerary.endDate);
          return itineraryEndDate && itineraryEndDate <= endFilterDate;
        });
      }
    }

    setFilteredItineraries(filtered);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSearchParams({
      title: '',
      destination: '',
      priceMin: '',
      priceMax: '',
      status: '',
      dateStart: '',
      dateEnd: ''
    });
    setFilteredItineraries(itineraries);
  };

  const handleCreateTrip = () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser?.role === 'trip_manager') {
      navigate('/create-trip');
    } else {
      navigate('/travel-booking');
    }
  };

  if (loading) return <div className="loading">Loading itineraries...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <Navbar />
      
      <div className="trips-page">
        <div className="trips-header">
          <h1>Explore Trips</h1>
          <div className="search-create-container">
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search trips by name, description, or destination..."
                value={searchQuery}
                onChange={handleSimpleSearch}
                className="search-input"
              />
              <button 
                className="advanced-search-toggle"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              >
                {showAdvancedSearch ? 'Hide filters' : 'Show filters'}
              </button>
            </div>
            <button 
              className="create-trip-btn"
              onClick={handleCreateTrip}
            >
              + Create Trip
            </button>
          </div>
          
          {showAdvancedSearch && (
            <div className="advanced-search-panel">
              <div className="advanced-search-grid">
                <div className="search-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={searchParams.title}
                    onChange={handleAdvancedSearchChange}
                    placeholder="Trip title..."
                  />
                </div>
                
                <div className="search-group">
                  <label htmlFor="destination">Destination</label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={searchParams.destination}
                    onChange={handleAdvancedSearchChange}
                    placeholder="Trip destination..."
                  />
                </div>
                
                <div className="search-group">
                  <label htmlFor="priceMin">Min Price (₹)</label>
                  <input
                    type="number"
                    id="priceMin"
                    name="priceMin"
                    value={searchParams.priceMin}
                    onChange={handleAdvancedSearchChange}
                    placeholder="Min price..."
                  />
                </div>
                
                <div className="search-group">
                  <label htmlFor="priceMax">Max Price (₹)</label>
                  <input
                    type="number"
                    id="priceMax"
                    name="priceMax"
                    value={searchParams.priceMax}
                    onChange={handleAdvancedSearchChange}
                    placeholder="Max price..."
                  />
                </div>
                
                <div className="search-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={searchParams.status}
                    onChange={handleAdvancedSearchChange}
                  >
                    <option value="">All statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div className="search-group">
                  <label htmlFor="dateStart">Start Date</label>
                  <input
                    type="date"
                    id="dateStart"
                    name="dateStart"
                    value={searchParams.dateStart}
                    onChange={handleAdvancedSearchChange}
                  />
                </div>
                
                <div className="search-group">
                  <label htmlFor="dateEnd">End Date</label>
                  <input
                    type="date"
                    id="dateEnd"
                    name="dateEnd"
                    value={searchParams.dateEnd}
                    onChange={handleAdvancedSearchChange}
                  />
                </div>
              </div>
              
              <div className="advanced-search-actions">
                <button 
                  className="reset-button"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="itineraries-grid">
          {filteredItineraries.length === 0 ? (
            <div className="no-results">No trips match your search criteria</div>
          ) : (
            filteredItineraries.map(itinerary => (
              <ItineraryCard 
                key={itinerary._id}
                title={itinerary.title}
                destination={itinerary.destination}
                duration={`${itinerary.days} Days / ${itinerary.nights} Nights`}
                price={itinerary.price}
                rating={4.5}
                image={itinerary.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1470&auto=format&fit=crop"}
                highlights={itinerary.destinations.map(dest => dest.location)}
                included={["Hotels", "Sightseeing", "Some meals"]}
                itineraryId={itinerary._id}
              />
            ))
          )}
        </div>
      </div>
      
      {selectedItinerary && (
        <ItineraryDetailsModal
          itinerary={selectedItinerary}
          onClose={() => setSelectedItinerary(null)}
        />
      )}
    </div>
  );
}

export default Trips;