import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Heart,
  Menu, 
  X, 
  MessageSquare,
  User,
  LogOut
} from "lucide-react";
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import './Navbar.css';

function Navbar({ isHomePage, onLoginClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdown(!profileDropdown);
  };

  const handleLogout = () => {
    logout();
    setProfileDropdown(false);
  };

  // Home page version (landing page)
  if (isHomePage) {
    return (
      <>
        <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
          <div className="container">
            <Link to="/" className="logo-container">
              <img src={logo} alt="Journey Craft" className="logo" />
              <span className="logo-text">Journey Craft</span>
            </Link>

            <div className="nav-links">
              <Link to="#" className="nav-link" onClick={onLoginClick}>Trips</Link>
              <Link to="#" className="nav-link" onClick={onLoginClick}>Events</Link>
            </div>

            <div className="nav-actions">
              <button className="icon-btn" onClick={onLoginClick} aria-label="Search">
                <Search size={20} />
              </button>
              <Link to="/wishlist" className="icon-btn" aria-label="Favorites">
                <Heart size={20} />
              </Link>
              <button className="signin-btn" onClick={onLoginClick}>
                Sign In
              </button>
              <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Menu">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <Link to="#" className="mobile-nav-link" onClick={onLoginClick}>Trips</Link>
            <Link to="#" className="mobile-nav-link" onClick={onLoginClick}>Events</Link>
            <button className="mobile-signin-btn" onClick={onLoginClick}>
              Sign In
            </button>
          </div>
        </header>
        <div className="navbar-spacer"></div>
      </>
    );
  }

  // Authenticated version (dashboard)
  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <Link to="/dashboard" className="logo-container">
            <img src={logo} alt="Journey Craft" className="logo" />
            <span className="logo-text">Journey Craft</span>
          </Link>

          <div className="nav-links">
            <Link to="/trips" className={`nav-link ${location.pathname === '/trips' ? 'active' : ''}`}>
              Trips
            </Link>
            <Link to="/events" className={`nav-link ${location.pathname === '/events' ? 'active' : ''}`}>
              Events
            </Link>
            {user?.role === 'trip_manager' && (
              <Link to="/create-trip" className={`nav-link ${location.pathname === '/create-trip' ? 'active' : ''}`}>
                Create Trip
              </Link>
            )}
          </div>

          <div className="nav-actions">
            <div className="icon-group">
              <button className="icon-btn" aria-label="Search">
                <Search size={20} />
              </button>
              <Link to="/wishlist" className="icon-btn" aria-label="Favorites">
                <Heart size={20} />
              </Link>
              <Link to="/messages" className="icon-btn" aria-label="Messages">
                <MessageSquare size={20} />
              </Link>
            </div>

            <div className="profile-dropdown-container">
              <button 
                className="user-avatar"
                onClick={toggleProfileDropdown}
                aria-label="User profile"
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </button>
              
              {profileDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-user-info">
                    <span className="dropdown-name">{user?.name}</span>
                    <span className="dropdown-email">{user?.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setProfileDropdown(false)}>
                    <User size={16} />
                    <span>My Profile</span>
                  </Link>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>

            <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/trips" className="mobile-nav-link" onClick={closeMobileMenu}>Trips</Link>
          <Link to="/events" className="mobile-nav-link" onClick={closeMobileMenu}>Events</Link>
          {user?.role === 'trip_manager' && (
            <Link to="/create-trip" className="mobile-nav-link" onClick={closeMobileMenu}>Create Trip</Link>
          )}
          <Link to="/profile" className="mobile-nav-link" onClick={closeMobileMenu}>Profile</Link>
          <Link to="/messages" className="mobile-nav-link" onClick={closeMobileMenu}>Messages</Link>
          <button className="mobile-signout-btn" onClick={() => { logout(); closeMobileMenu(); }}>
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      </header>
      <div className="navbar-spacer"></div>
    </>
  );
}

export default Navbar;
