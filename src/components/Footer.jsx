import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h2 className="footer-logo-text">Journey Craft</h2>
        </div>
        
        <div className="footer-links">
          <div className="footer-links-column">
            <h3>Company</h3>
            <a href="#about">About Us</a>
            <a href="#careers">Careers</a>
            <a href="#press">Press</a>
          </div>
          
          <div className="footer-links-column">
            <h3>Support</h3>
            <a href="#help">Help Center</a>
            <a href="#safety">Safety Information</a>
            <a href="#cancel">Cancellation Options</a>
          </div>
          
          <div className="footer-links-column">
            <h3>Legal</h3>
            <a href="#terms">Terms of Service</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="copyright">
          <p>© {currentYear} Journey Craft, Inc. All rights reserved</p>
        </div>
        
        <div className="social-links">
          <a href="#facebook" className="social-link">
            <span className="social-icon facebook-icon"></span>
          </a>
          <a href="#twitter" className="social-link">
            <span className="social-icon twitter-icon"></span>
          </a>
          <a href="#instagram" className="social-link">
            <span className="social-icon instagram-icon"></span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;