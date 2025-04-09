import React, { useState, useEffect } from 'react';
import { Calendar, Star } from 'lucide-react';
import api from '../config/api'; // Import the API client
import Navbar from '../components/Navbar';
import PageTitle from '../components/PageTitle';
import './Rewards.css';

function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        
        try {
          const response = await api.get('/api/rewards');
          setRewards(response.data);
        } catch (err) {
          // If the API returns 404, it means the endpoint doesn't exist yet
          // We'll handle this gracefully by showing the "no rewards" message
          if (err.response && err.response.status === 404) {
            console.log('Rewards API not implemented yet - showing empty state');
            setRewards([]);
          } else {
            throw err; // Re-throw other errors to be caught by outer catch
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rewards:', err);
        setError('Failed to load rewards');
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  return (
    <div className="rewards-page">
      <PageTitle title="Rewards" />
      <Navbar />
      
      <div className="rewards-container">
        <div className="rewards-header">
          <h1>Your Rewards</h1>
          <p>Redeem your points for exclusive travel benefits</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading">Loading rewards...</div>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error">{error}</div>
          </div>
        ) : rewards.length === 0 ? (
          <div className="no-rewards-container">
            <div className="no-rewards">
              <Star size={64} className="no-rewards-icon" />
              <h2>No Rewards Available</h2>
              <p>You don't have any rewards yet. Complete trips and activities to earn reward points!</p>
              <button className="explore-button" onClick={() => window.location.href = '/trips'}>
                Explore Trips
              </button>
            </div>
          </div>
        ) : (
          <div className="rewards-grid">
            {rewards.map(reward => (
              <div key={reward._id} className="reward-card">
                <div className="reward-header">
                  <span className="points-required">
                    <Star size={16} /> {reward.pointsRequired} Points
                  </span>
                </div>
                <div className="reward-details">
                  <h3>{reward.title}</h3>
                  <p className="reward-description">{reward.description}</p>
                  <div className="reward-meta">
                    {reward.expiryDate && (
                      <span className="reward-expiry">
                        <Calendar size={14} /> 
                        Expires: {new Date(reward.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <button className="redeem-button">Redeem Reward</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Rewards;