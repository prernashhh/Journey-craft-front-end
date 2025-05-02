import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Search, MessageSquare, User, Mail } from "lucide-react";
import axios from "axios";
import LoginSignup from "./LoginSignup";
import Navbar from "../components/Navbar";
import "./Home.css";

function Dashboard() {
  const [showLoginSignup, setShowLoginSignup] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              location: { city: 'Mumbai', country: 'India' },
              price: { amount: 1500 }
            },
            {
              _id: '2',
              title: 'Tech Conference 2025',
              date: new Date('2025-08-20').toISOString(),
              location: { city: 'Bangalore', country: 'India' },
              price: { amount: 2000 }
            },
            {
              _id: '3',
              title: 'Food & Wine Expo',
              date: new Date('2025-06-10').toISOString(),
              location: { city: 'Delhi', country: 'India' },
              price: { amount: 1000 }
            }
          ];
          setEvents(mockEvents);
          setLoading(false);
          return;
        }
        
        // For production, try to fetch from the API
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/events`);
        
        // Verify we got a valid response
        if (response.data && !response.data.includes('<!DOCTYPE html>')) {
          // Check if response.data is an array
          if (Array.isArray(response.data)) {
            setEvents(response.data);
          } else if (response.data && Array.isArray(response.data.events)) {
            // If response.data is an object with events property that's an array
            setEvents(response.data.events);
          } else if (response.data && typeof response.data === 'object') {
            // If response.data is a non-array object, convert to array if possible
            console.warn('API returned an object instead of an array. Attempting to convert.');
            const eventsArray = Object.values(response.data);
            setEvents(Array.isArray(eventsArray) ? eventsArray : []);
          } else {
            // Fallback to empty array
            console.error('API response format is not as expected:', response.data);
            setEvents([]);
          }
        } else {
          // Got HTML or invalid response
          console.error('Received HTML instead of JSON from API');
          setEvents([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
        setLoading(false);
        // Ensure events is an empty array in case of error
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  const closeLoginSignup = () => {
    setShowLoginSignup(false);
  };

  const renderEvents = () => {
    if (loading) return <div className="loading">Loading events...</div>;
    if (error) return <div className="error">{error}</div>;
    
    // Add safety check before mapping
    if (!events || !Array.isArray(events) || events.length === 0) {
      return <div>No upcoming events</div>;
    }

    return (
      <div className="events-grid">
        {events.map((event, index) => (
          <div key={event._id || event.id || index} className="event-card">
            <div className="event-details">
              <h3 className="event-title">{event.title || event.name}</h3>
              <p className="event-date">
                {new Date(event.date).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <p className="event-venue">
                {event.location?.city && event.location?.country 
                  ? `${event.location.city}, ${event.location.country}`
                  : event.location || 'Location not specified'}
              </p>
              <p className="event-price">
                {event.price?.amount 
                  ? `₹${event.price.amount}` 
                  : (typeof event.price === 'number' ? `₹${event.price}` : 'Price not available')}
              </p>
              <button 
                className="secondary-button" 
                onClick={() => setShowLoginSignup(true)}
              >
                Add to Itinerary
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="app">
      <Navbar isHomePage={true} onLoginClick={() => setShowLoginSignup(true)} />
      
      {/* Login/Signup Modal */}
      {showLoginSignup && <LoginSignup onClose={closeLoginSignup} />}

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-hero-title">Welcome to Journey Craft</h1>
          <button className="primary-button" onClick={() => setShowLoginSignup(true)}>Get started</button>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="events-section">
        <h2 className="section-title">Upcoming Events</h2>
        {renderEvents()}
      </section>

      {/* Adventure Banner */}
      <section className="adventure-banner">
        <h2 className="banner-title">Let The Adventure Begin</h2>
      </section>

      {/* Wonders Section */}
      <section className="wonders-section">
        <div className="wonders-container">
          <h2 className="section-title">Unlock Lesser-Known Wonders of India</h2>

          <div className="wonders-grid">
            <div className="wonder-card">
              <div className="wonder-overlay">
                <h3 className="wonder-title">Shimla, Himachal</h3>
              </div>
            </div>

            <div className="wonder-card">
              <div className="wonder-overlay">
                <h3 className="wonder-title">Manali, Himachal</h3>
              </div>
            </div>

            <div className="wonder-card">
              <div className="wonder-overlay">
                <h3 className="wonder-title">Goa</h3>
              </div>
            </div>

            <div className="wonder-card">
              <div className="wonder-overlay">
                <h3 className="wonder-title">Pondicherry</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <h2 className="newsletter-title">Subscribe to our newsletter</h2>
          <div className="newsletter-form">
            <div className="input-container">
              <Mail size={16} className="mail-icon" />
              <input type="email" placeholder="Input your email" className="email-input" />
            </div>
            <button className="subscribe-button" onClick={() => setShowLoginSignup(true)}>Subscribe</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2 className="footer-logo-text">Journey Craft</h2>
          </div>

          <div className="footer-links">
            <a href="#" className="footer-link" onClick={(e) => {
              e.preventDefault();
              setShowLoginSignup(true);
            }}>
              Pricing
            </a>
            <a href="#" className="footer-link" onClick={(e) => {
              e.preventDefault();
              setShowLoginSignup(true);
            }}>
              About us
            </a>
            <a href="#" className="footer-link" onClick={(e) => {
              e.preventDefault();
              setShowLoginSignup(true);
            }}>
              Features
            </a>
            <a href="#" className="footer-link" onClick={(e) => {
              e.preventDefault();
              setShowLoginSignup(true);
            }}>
              Help Center
            </a>
            <a href="#" className="footer-link" onClick={(e) => {
              e.preventDefault();
              setShowLoginSignup(true);
            }}>
              Contact
            </a>
            <a href="#" className="footer-link" onClick={(e) => {
              e.preventDefault();
              setShowLoginSignup(true);
            }}>
              FAQs
            </a>
          </div>

          <div className="footer-bottom">
            <div className="language-selector">
              <select className="language-select">
                <option value="en">English</option>
              </select>
            </div>

            <div className="copyright">
              <p>© 2024 Brand, Inc • Privacy • Terms • Sitemap</p>
            </div>

            <div className="social-links">
              <a href="#" className="social-link" onClick={(e) => {
                e.preventDefault();
                setShowLoginSignup(true);
              }}>
                <div className="facebook-icon"></div>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard;