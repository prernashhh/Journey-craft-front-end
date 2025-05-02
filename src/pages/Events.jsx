import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Clock, Tag } from "lucide-react";
import axios from 'axios';  // Import axios directly
import './Events.css';
import EventDetailsModal from '../components/EventDetailsModal';
import Navbar from '../components/Navbar';

function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Check if we're in development mode and use mock data if API is not ready
        const isDev = import.meta.env.MODE === 'development';
        
        if (isDev) {
          // Use mock data for development
          console.log('Using mock events data in development mode');
          const mockEvents = [
            {
              _id: '1',
              title: 'Summer Music Festival',
              date: new Date('2025-07-15').toISOString(),
              description: 'A vibrant celebration of music from around the world',
              location: { city: 'Mumbai', country: 'India' },
              price: { amount: 1500 },
              category: 'Music'
            },
            {
              _id: '2',
              title: 'Tech Conference 2025',
              date: new Date('2025-08-20').toISOString(),
              description: 'The biggest tech gathering in South Asia',
              location: { city: 'Bangalore', country: 'India' },
              price: { amount: 2000 },
              category: 'Technology'
            },
            {
              _id: '3',
              title: 'Food & Wine Expo',
              date: new Date('2025-06-10').toISOString(),
              description: 'Taste the finest cuisines and wines',
              location: { city: 'Delhi', country: 'India' },
              price: { amount: 1000 },
              category: 'Food'
            }
          ];
          setEvents(mockEvents);
          setFilteredEvents(mockEvents);
          setLoading(false);
          return;
        }
        
        // For production, try to fetch from the API
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/events`);
        
        // Process the API response
        if (response.data && !response.data.includes('<!DOCTYPE html>')) {
          const eventsData = Array.isArray(response.data) 
            ? response.data 
            : (response.data.events || []);
            
          setEvents(eventsData);
          setFilteredEvents(eventsData);
        } else {
          console.error('Received HTML instead of JSON from API');
          setEvents([]);
          setFilteredEvents([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredEvents(events);
      return;
    }
    
    const filtered = events.filter(event => 
      (event.title || event.name || '').toLowerCase().includes(query) ||
      (event.description || '').toLowerCase().includes(query) ||
      (event.location?.city || '').toLowerCase().includes(query) ||
      (event.location?.country || '').toLowerCase().includes(query) ||
      (event.category || '').toLowerCase().includes(query)
    );
    
    setFilteredEvents(filtered);
  };

  const viewEventDetails = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="events-page">
      <Navbar />
      
      <div className="events-container">
        <div className="events-header">
          <h1>Discover Events</h1>
          <div className="search-bar">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="loading-state">Loading events...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : filteredEvents.length === 0 ? (
          <div className="no-results">
            <p>No events found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <div 
                key={event._id} 
                className="event-card"
                onClick={() => viewEventDetails(event)}
              >
                <div className="event-image">
                  <img src={event.images?.[0]?.url || "https://via.placeholder.com/400x200"} alt={event.title} />
                  <div className="event-price">₹{event.price?.amount || 'Free'}</div>
                </div>
                <div className="event-details">
                  <h3 className="event-title">{event.title || event.name}</h3>
                  <div className="event-meta">
                    <div className="event-date">
                      <Calendar size={16} />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="event-location">
                      <MapPin size={16} />
                      {event.location?.city}, {event.location?.country}
                    </div>
                    {event.duration && (
                      <div className="event-duration">
                        <Clock size={16} />
                        {event.duration}
                      </div>
                    )}
                    {event.category && (
                      <div className="event-category">
                        <Tag size={16} />
                        {event.category}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedEvent && (
        <EventDetailsModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}

export default Events;