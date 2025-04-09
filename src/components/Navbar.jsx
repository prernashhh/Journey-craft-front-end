import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Menu, X, User } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import logo from '../assets/logo.png'; // Ensure this path is correct

function Navbar({ isHomePage, onLoginClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getUserInitials = () => {
    if (!user?.name) return '';
    return user.name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavClick = (e) => {
    if (isHomePage) {
      // Check if the click is on the logo or logo text
      const isLogo = e.target.classList.contains('logo') || 
                    e.target.classList.contains('logo-text') ||
                    e.target.closest('.logo-container');
      
      if (!isLogo && onLoginClick) {
        e.preventDefault();
        onLoginClick();
      }
    }
  };

  // Home page version (no authentication required)
  if (isHomePage) {
    return (
      <nav className="navbar" onClick={handleNavClick}>
        <div className="logo-container">
          <img src={logo} alt="Journey Craft Logo" className="logo" />
          <h1 className="logo-text">Journey Craft</h1>
        </div>

        <div className="nav-links">
          <a href="#" className="nav-link">Trips</a>
          <a href="#" className="nav-link">Events</a>
          <a href="#" className="nav-link">Rewards</a>
        </div>

        <div className="nav-actions flex items-center gap-6">
          <Search 
            size={24} 
            className="nav-icon" 
            onClick={onLoginClick}
          />
          <MessageSquare 
            size={24} 
            className="nav-icon" 
            onClick={onLoginClick}
          />
          <User 
            size={24} 
            className="nav-icon" 
            onClick={onLoginClick}
          />
        </div>
      </nav>
    );
  }

  // Authenticated version (for logged-in users)
  return (
    <nav className="navbar">
      <div className="logo-container" onClick={() => navigate('/dashboard')}>
        <img src={logo} alt="Journey Craft Logo" className="logo" />
        <h1 className="logo-text">Journey Craft</h1>
      </div>

      {/* Desktop Navigation */}
      <div className="nav-links desktop-nav">
        {user?.role === 'trip_manager' && (
          <Link to="/create-trip" className="nav-link">Create Trip</Link>
        )}
        <Link to="/trips" className="nav-link" onClick={closeMobileMenu}>
          Trips
        </Link>
        <Link to="/events" className="nav-link" onClick={closeMobileMenu}>
          Events
        </Link>
        <Link to="/rewards" className="nav-link" onClick={closeMobileMenu}>
          Rewards
        </Link>
      </div>

      <div className="nav-actions desktop-actions">
        <Search size={24} className="nav-icon" />
        <Link to="/messages" className="nav-icon-link">
          <MessageSquare size={24} className="nav-icon" />
        </Link>
        <div 
          className="user-initial-circle" 
          onClick={() => navigate('/profile')}
          title="View Profile"
        >
          {getUserInitials()}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="mobile-menu-button">
        {mobileMenuOpen ? (
          <X size={24} onClick={toggleMobileMenu} />
        ) : (
          <Menu size={24} onClick={toggleMobileMenu} />
        )}
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
          {user?.role === 'trip_manager' ? (
            <>
              <Link to="/manager-dashboard" className="mobile-nav-link" onClick={closeMobileMenu}>
                Dashboard
              </Link>
              <Link to="/create-trip" className="mobile-nav-link" onClick={closeMobileMenu}>
                Create Trip
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}>
              Dashboard
            </Link>
          )}
          <Link to="/trips" className="mobile-nav-link" onClick={closeMobileMenu}>
            Trips
          </Link>
          <Link to="/events" className="mobile-nav-link" onClick={closeMobileMenu}>
            Events
          </Link>
          <Link to="/rewards" className="mobile-nav-link" onClick={closeMobileMenu}>
            Rewards
          </Link>
          <Link to="/profile" className="mobile-nav-link" onClick={closeMobileMenu}>
            Profile
          </Link>
          <Link to="/messages" className="mobile-nav-link" onClick={closeMobileMenu}>
            Messages
          </Link>
          <button className="mobile-logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
