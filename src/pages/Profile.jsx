import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Calendar, Heart, Trash2, Eye, UserCheck, UserPlus, Users, Clock } from "lucide-react";
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Profile.css';
import EventDetailsModal from '../components/EventDetailsModal';
import ItineraryDetailsModal from '../components/ItineraryDetailsModal';

function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: '',
    joinDate: user?.createdAt || new Date().toISOString()
  });
  const [wishlistData, setWishlistData] = useState({
    events: [],
    itineraries: []
  });
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [followLoading, setFollowLoading] = useState(false);
  const [customItineraries, setCustomItineraries] = useState([]);
  const [currentUser, setCurrentUser] = useState(user);

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'followers', label: 'Followers' },
    { id: 'following', label: 'Following' },
    ...(currentUser?.id === user?.id ? [{ id: 'custom-itineraries', label: 'My Itineraries' }] : [])
  ];

  useEffect(() => {
    if (activeTab === 'wishlist') {
      fetchWishlist();
    } else if (activeTab === 'following' || activeTab === 'followers') {
      fetchFollowData();
    } else if (activeTab === 'custom-itineraries') {
      const stored = JSON.parse(localStorage.getItem('customItineraries')) || [];
      setCustomItineraries(stored);
    }
  }, [activeTab]);

  const fetchFollowData = async () => {
    try {
      setFollowLoading(true);
      const token = localStorage.getItem('token');
      
      const followingResponse = await axios.get('https://journety-craft-backend.onrender.com/api/users/me/following', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const followersResponse = await axios.get('https://journety-craft-backend.onrender.com/api/users/me/followers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFollowingList(followingResponse.data);
      setFollowersList(followersResponse.data);
    } catch (err) {
      console.error('Error fetching follow data:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      setWishlistLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      
      const response = await axios.get('https://journety-craft-backend.onrender.com/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlistData(response.data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      alert('Could not load your wishlist. Please try again later.');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      await axios.put(
        'https://journety-craft-backend.onrender.com/api/auth/profile',
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const removeFromWishlist = async (type, id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://journety-craft-backend.onrender.com/api/wishlist/${type}s/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWishlist();
    } catch (err) {
      console.error(`Error removing ${type} from wishlist:`, err);
    }
  };

  const viewItemDetails = (type, item) => {
    if (type === 'event') {
      setSelectedEvent(item);
    } else {
      setSelectedItinerary(item);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://journety-craft-backend.onrender.com/api/users/follow/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFollowData();
    } catch (err) {
      console.error('Error following user:', err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      }
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://journety-craft-backend.onrender.com/api/users/follow/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFollowData();
    } catch (err) {
      console.error('Error unfollowing user:', err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      }
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="profile-title">
            <h1>My Profile</h1>
            <p>
              Manage your personal information, account settings, and connections
            </p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{followersList.length}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-value">{followingList.length}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        {activeTab === 'profile' && (
          <div className="profile-content">
            <div className="profile-section">
              <h2>Personal Information</h2>
              <div className="profile-fields">
                <div className="field-group">
                  <label>
                    <User size={16} />
                    Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{profileData.name}</p>
                  )}
                </div>

                <div className="field-group">
                  <label>
                    <Mail size={16} />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{profileData.email}</p>
                  )}
                </div>

                <div className="field-group">
                  <label>
                    <Calendar size={16} />
                    Member Since
                  </label>
                  <p>{new Date(profileData.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button 
                    className="save-button" 
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    className="cancel-button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button className="edit-button" onClick={handleEdit}>
                  Edit Profile
                </button>
              )}
              <button className="logout-button" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="wishlist-content">
            {wishlistLoading ? (
              <div className="wishlist-loading">Loading wishlist...</div>
            ) : (
              <>
                <div className="wishlist-section">
                  <h2>Saved Events</h2>
                  {wishlistData.events.length === 0 ? (
                    <p className="no-items-message">No events in your wishlist</p>
                  ) : (
                    <div className="wishlist-grid">
                      {wishlistData.events.map(event => (
                        <div key={event._id} className="wishlist-card">
                          <div className="wishlist-card-header">
                            {event.images && event.images[0] && (
                              <img 
                                src={event.images[0].url} 
                                alt={event.title} 
                                className="wishlist-image"
                              />
                            )}
                          </div>
                          <div className="wishlist-card-body">
                            <h3 className="wishlist-item-title">{event.title}</h3>
                            <p className="wishlist-item-location">
                              <MapPin size={14} />
                              {event.location.city}, {event.location.country}
                            </p>
                            <p className="wishlist-item-date">
                              <Calendar size={14} />
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                            <div className="wishlist-price">₹{event.price.amount}</div>
                          </div>
                          <div className="wishlist-card-actions">
                            <button 
                              className="wishlist-view-button"
                              onClick={() => viewItemDetails('event', event)}
                            >
                              <Eye size={18} />
                              Details
                            </button>
                            <button 
                              className="wishlist-remove-button"
                              onClick={() => removeFromWishlist('event', event._id)}
                            >
                              <Trash2 size={18} />
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="wishlist-section">
                  <h2>Saved Itineraries</h2>
                  {wishlistData.itineraries.length === 0 ? (
                    <p className="no-items-message">No itineraries in your wishlist</p>
                  ) : (
                    <div className="wishlist-grid">
                      {wishlistData.itineraries.map(itinerary => (
                        <div key={itinerary._id} className="wishlist-card">
                          <div className="wishlist-card-body">
                            <h3 className="wishlist-item-title">{itinerary.title}</h3>
                            <div className="wishlist-item-details">
                              <span className="wishlist-item-duration">
                                {itinerary.days} Days, {itinerary.nights} Nights
                              </span>
                              {itinerary.destinations && itinerary.destinations.length > 0 && (
                                <div className="wishlist-item-destinations">
                                  {itinerary.destinations.slice(0, 2).map((dest, i) => (
                                    <span key={i} className="wishlist-destination">
                                      <MapPin size={14} />
                                      {dest.location}
                                    </span>
                                  ))}
                                  {itinerary.destinations.length > 2 && (
                                    <span className="wishlist-more">
                                      +{itinerary.destinations.length - 2} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="wishlist-price">₹{itinerary.price}</div>
                            {itinerary.organizer && (
                              <div className="wishlist-organizer">
                                <User size={14} /> By {itinerary.organizer.name}
                              </div>
                            )}
                          </div>
                          <div className="wishlist-card-actions">
                            <button 
                              className="wishlist-view-button"
                              onClick={() => viewItemDetails('itinerary', itinerary)}
                            >
                              <Eye size={18} />
                              Details
                            </button>
                            <button 
                              className="wishlist-remove-button"
                              onClick={() => removeFromWishlist('itinerary', itinerary._id)}
                            >
                              <Trash2 size={18} />
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'following' && (
          <div className="connections-content">
            <div className="connections-section">
              <h2>People You Follow</h2>
              {followLoading ? (
                <div className="loading">Loading...</div>
              ) : followingList.length === 0 ? (
                <p className="no-items-message">You are not following anyone yet</p>
              ) : (
                <div className="connections-grid">
                  {followingList.map(followedUser => (
                    <div key={followedUser._id} className="connection-card">
                      <div className="connection-avatar">
                        {followedUser.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="connection-details">
                        <h3 className="connection-name">{followedUser.name}</h3>
                        <p className="connection-role">
                          {followedUser.role === 'trip_manager' ? 'Trip Manager' : 'Traveller'}
                        </p>
                        <p className="connection-email">{followedUser.email}</p>
                      </div>
                      <button 
                        className="unfollow-button"
                        onClick={() => handleUnfollow(followedUser._id)}
                      >
                        <UserCheck size={18} /> Unfollow
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'followers' && (
          <div className="connections-content">
            <div className="connections-section">
              <h2>People Following You</h2>
              {followLoading ? (
                <div className="loading">Loading...</div>
              ) : followersList.length === 0 ? (
                <p className="no-items-message">You don't have any followers yet</p>
              ) : (
                <div className="connections-grid">
                  {followersList.map(follower => (
                    <div key={follower._id} className="connection-card">
                      <div className="connection-avatar">
                        {follower.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="connection-details">
                        <h3 className="connection-name">{follower.name}</h3>
                        <p className="connection-role">
                          {follower.role === 'trip_manager' ? 'Trip Manager' : 'Traveller'}
                        </p>
                        <p className="connection-email">{follower.email}</p>
                      </div>
                      <button 
                        className="follow-button"
                        onClick={() => handleFollow(follower._id)}
                      >
                        <UserPlus size={18} /> Follow Back
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'custom-itineraries' && currentUser?.id === user?.id && (
          <div className="custom-itineraries-section">
            <h2>My Custom Itineraries</h2>
            {customItineraries.length === 0 ? (
              <p className="no-items-message">No custom itineraries created yet</p>
            ) : (
              <div className="itineraries-grid">
                {customItineraries
                  .filter(itinerary => itinerary.user?.id === currentUser?.id)
                  .map(itinerary => (
                    <div key={itinerary.id} className="itinerary-card">
                      <div className="itinerary-card-body">
                        <h3 className="itinerary-title">{itinerary.destination}</h3>
                        <div className="itinerary-details">
                          <p className="date-range">
                            <Calendar size={14} />
                            {new Date(itinerary.dateRange.from).toLocaleDateString()} - 
                            {new Date(itinerary.dateRange.to).toLocaleDateString()}
                          </p>
                          <p className="duration">
                            <Clock size={14} />
                            {Math.ceil((new Date(itinerary.dateRange.to) - new Date(itinerary.dateRange.from)) / (1000 * 60 * 60 * 24))} days
                          </p>
                          <div className="preferences">
                            <p><strong>Hotel:</strong> {itinerary.hotelRating}</p>
                            <p><strong>Travel:</strong> {itinerary.travelMode}</p>
                          </div>
                          {itinerary.selectedAttractions.length > 0 && (
                            <div className="attractions">
                              <strong>Selected Activities:</strong>
                              <ul>
                                {itinerary.selectedAttractions.map(id => (
                                  <li key={id}>{id}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <p className="status">Status: {itinerary.status}</p>
                          <p className="estimated-price">Estimated Price: {itinerary.estimatedPrice}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedEvent && (
        <EventDetailsModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}

      {selectedItinerary && (
        <ItineraryDetailsModal 
          itinerary={selectedItinerary} 
          onClose={() => setSelectedItinerary(null)} 
        />
      )}
    </div>
  );
}

export default Profile;
