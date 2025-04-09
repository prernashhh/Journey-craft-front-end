import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Clock, Tag } from "lucide-react";
import axios from 'axios';
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
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(response.data);
        setFilteredEvents(response.data);
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
    
    const filtered = events.filter(event => {
      const titleMatch = event.title.toLowerCase().includes(query);
      const locationMatch = `${event.location.city}, ${event.location.country}`.toLowerCase().includes(query);
      const tagsMatch = event.tags?.some(tag => tag.toLowerCase().includes(query));
      
      return titleMatch || locationMatch || tagsMatch;
    });
    
    setFilteredEvents(filtered);
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <Navbar />
      
      <div className="events-page">
        <div className="events-header">
          <h1>Upcoming Events</h1>
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search events by title, location, or tags..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        <div className="events-grid">
          {filteredEvents.map(event => (
            <div 
              key={event._id}
              className="event-card"
              onClick={() => setSelectedEvent(event)}
            >
              {/* Image display temporarily removed 
              {event.images?.[0] && (
                <img 
                  src={event.images[0].url} 
                  alt={event.title} 
                  className="event-image"
                />
              )}
              */}
              
              <div className="event-details">
                <h2 className="event-title">{event.title}</h2>
                
                <div className="event-meta">
                  <span>
                    <Calendar size={16} />
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                  <span>
                    <MapPin size={16} />
                    {event.location.city}, {event.location.country}
                  </span>
                  <span>
                    <Clock size={16} />
                    {event.duration.hours}h {event.duration.minutes}m
                  </span>
                </div>

                {event.tags && (
                  <div className="event-tags">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        <Tag size={14} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="event-description">
                  {event.description}
                </p>

                <div className="event-footer">
                  <span className="price">₹{event.price.amount}</span>
                  <span className="capacity">
                    {event.capacity} spots left
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
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