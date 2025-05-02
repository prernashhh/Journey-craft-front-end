import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Search, MessageSquare, User, Mail, Calendar, MapPin, Clock } from "lucide-react";
import axios from "axios"; // Make sure axios is imported
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
        setLoading(true);
        
        // Fetch events directly from the backend
        console.log('Fetching events from API...');
        const response = await axios.get('https://journety-craft-backend.onrender.com/api/events');
        console.log('Events API response:', response.data);
        
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else if (response.data && Array.isArray(response.data.events)) {
          setEvents(response.data.events);
        } else if (response.data && typeof response.data === 'object') {
          console.warn('Converting response object to array');
          const eventsArray = Object.values(response.data);
          setEvents(Array.isArray(eventsArray) ? eventsArray : []);
        } else {
          console.error('Invalid API response format:', response.data);
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
        setEvents([]);
      } finally {
        setLoading(false);
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
                <Calendar size={16} />
                {new Date(event.date).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <p className="event-venue">
                <MapPin size={16} />
                {event.location?.city && event.location?.country 
                  ? `${event.location.city}, ${event.location.country}`
                  : event.location || 'Location not specified'}
              </p>
              <p className="event-price">
                ₹{event.price?.amount 
                  ? `${event.price.amount}` 
                  : (typeof event.price === 'number' ? `${event.price}` : 'Price not available')}
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
  );
}

export default Dashboard;