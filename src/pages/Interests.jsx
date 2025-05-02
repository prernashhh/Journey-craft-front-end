import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Interests.css'; // Import the CSS file for styling

const interestsList = [
    "Adventure & Outdoor",
    "Beaches & Islands",
    "Cultural & Heritage",
    "Food & Culinary Experiences",
    "Luxury & Resorts",
    "Nature & Wildlife",
    "Nightlife & Entertainment",
    "Pilgrimage & Spiritual Journeys",
    "Road Trips & Scenic Drives",
    "Shopping & Fashion",
    "Solo & Backpacking Travel",
    "Sports & Recreational Activities",
    "Sustainable & Eco-Tourism",
    "Urban Exploration & City Tours",
    "Wellness & Retreats"
];

const Interests = () => {
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleInterestToggle = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else if (selectedInterests.length < 3) {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleSubmit = async () => {
        if (selectedInterests.length !== 3) {
            setError('Please select exactly three interests.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');

            if (!token) {
                setError('You must be logged in to update interests');
                navigate('/login');
                return;
            }

            await axios.put(
                'https://journety-craft-backend.onrender.com/api/users/me/interests', 
                { interests: selectedInterests },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // After successful update
            const user = JSON.parse(localStorage.getItem('user'));
            user.interests = selectedInterests;
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to update interests';
            setError(errorMsg);
            console.error('Error updating interests:', err);
            
            // If unauthorized, redirect to login
            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="interests-container">
            <h2>Select Your Interests</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="interests-list">
                {interestsList.map(interest => (
                    <div key={interest} className="interest-item">
                        <input
                            type="checkbox"
                            id={interest}
                            checked={selectedInterests.includes(interest)}
                            onChange={() => handleInterestToggle(interest)}
                            disabled={loading || 
                                (!selectedInterests.includes(interest) && 
                                selectedInterests.length >= 3)}
                        />
                        <label htmlFor={interest}>{interest}</label>
                    </div>
                ))}
            </div>
            <button 
                className="submit-button" 
                onClick={handleSubmit}
                disabled={loading || selectedInterests.length !== 3}
            >
                {loading ? 'Updating...' : 'Submit'}
            </button>
        </div>
    );
};

export default Interests;