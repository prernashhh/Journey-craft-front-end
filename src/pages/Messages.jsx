import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Search, SendHorizontal, UserPlus, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import './Messages.css';
import PageTitle from '../components/PageTitle';

function Messages() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [followers, setFollowers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchConversations();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.user._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://journety-craft-backend.onrender.com/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://journety-craft-backend.onrender.com/api/messages/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
      setLoading(false);
      
      // Mark messages as read
      try {
        await axios.put(
          `https://journety-craft-backend.onrender.com/api/messages/${otherUserId}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Update unread count in conversations list
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.user._id === otherUserId ? { ...conv, unreadCount: 0 } : conv
          )
        );
      } catch (err) {
        console.error('Error marking messages as read:', err);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://journety-craft-backend.onrender.com/api/messages',
        {
          recipientId: selectedConversation.user._id,
          content: newMessage
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add the sent message to the messages list
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      
      // Update conversation list to show latest message
      const updatedConversations = conversations.map(conv => {
        if (conv.user._id === selectedConversation.user._id) {
          return {
            ...conv,
            lastMessage: newMessage,
            lastMessageTime: new Date().toISOString()
          };
        }
        return conv;
      });
      setConversations(updatedConversations);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const handleNewChat = async () => {
    try {
      setLoading(true);
      setError(null); // Reset any previous errors
      const token = localStorage.getItem('token');
      
      const response = await axios.get('https://journety-craft-backend.onrender.com/api/users/me/mutual-followers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Mutual followers response:', response.data);
      setFollowers(response.data || []);
      setShowNewChat(true);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching mutual followers:', err);
      setError('Failed to load people you can message. ' + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  const startConversation = async (followerId) => {
    // Find if there's an existing conversation
    const existingConversation = conversations.find(
      conv => conv.user._id === followerId
    );
    
    if (existingConversation) {
      setSelectedConversation(existingConversation);
    } else {
      // Find the follower data from followers list
      const followerData = followers.find(f => f._id === followerId);
      if (followerData) {
        // Create a new conversation object
        const newConversation = {
          id: Date.now().toString(), // Temporary id until first message is sent
          user: {
            _id: followerData._id,
            name: followerData.name,
            email: followerData.email,
            profilePicture: followerData.profilePicture
          },
          lastMessage: '',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0
        };
        
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
      }
    }
    
    setShowNewChat(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Today
    if (date.toDateString() === now.toDateString()) {
      return formatTime(dateString);
    }
    
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Within past week
    const sixDaysAgo = new Date(now);
    sixDaysAgo.setDate(now.getDate() - 6);
    if (date >= sixDaysAgo) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    
    // Older
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Filter conversations based on search term
  const filteredConversations = searchTerm 
    ? conversations.filter(conv => 
        conv.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : conversations;

  // Make sure this logic works correctly
  const filteredFollowers = searchTerm 
    ? followers.filter(follower => 
        follower.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : followers;

  const getUserInitials = (name) => {
    if (!name) return '';
    return name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2); // Limit to 2 chars
  };

  console.log('Component state:', {
    showNewChat,
    loading,
    filteredFollowers: filteredFollowers.length,
    followers: followers.length,
    selectedConversation: selectedConversation ? 'Selected' : 'None'
  });

  return (
    <div className="messages-page">
      <PageTitle title="Messages" />
      <Navbar />
      <div className="navbar-spacer"></div>
      
      <div className="messages-container">
        <div className={`sidebar ${selectedConversation && 'hidden-mobile'}`}>
          <div className="sidebar-header">
            <h1>Messages</h1>
            <button 
              className="new-chat-button" 
              onClick={handleNewChat}
              aria-label="Start new conversation"
            >
              <UserPlus size={20} />
            </button>
          </div>
          
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {loading && !showNewChat && conversations.length === 0 ? (
            <div className="loading-state">Loading conversations...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : filteredConversations.length === 0 ? (
            <div className="empty-state">
              <p>No conversations yet</p>
              <button 
                className="start-chat-button"
                onClick={handleNewChat}
              >
                Start a new chat
              </button>
            </div>
          ) : (
            <div className="conversations-list">
              {filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="conversation-avatar">
                    {getUserInitials(conversation.user.name)}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <h3 className="conversation-name">{conversation.user.name}</h3>
                      <span className="conversation-time">
                        {formatDate(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <p className="conversation-preview">{conversation.lastMessage || "Start a conversation"}</p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="unread-badge">{conversation.unreadCount}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={`main-content ${!selectedConversation && !showNewChat && 'hidden-mobile'}`}>
          {showNewChat ? (
            <div className="new-chat-container">
              <div className="new-chat-header">
                <button 
                  className="back-button"
                  onClick={() => setShowNewChat(false)}
                >
                  <ArrowLeft size={20} />
                </button>
                <h2>New Message</h2>
              </div>
              
              <div className="search-container">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search people..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {loading ? (
                <div className="loading-state">Loading contacts...</div>
              ) : error ? (
                <div className="error-state">{error}</div>
              ) : filteredFollowers.length === 0 ? (
                <div className="empty-state">
                  <p>No mutual followers found</p>
                  <p className="empty-state-subtext">
                    You can only message people who follow each other
                  </p>
                </div>
              ) : (
                <div className="followers-list">
                  {filteredFollowers.map(follower => (
                    <div
                      key={follower._id}
                      className="follower-item"
                      onClick={() => startConversation(follower._id)}
                    >
                      <div className="follower-avatar">
                        {getUserInitials(follower.name)}
                      </div>
                      <div className="follower-info">
                        <h3 className="follower-name">{follower.name}</h3>
                        <p className="follower-email">{follower.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : selectedConversation ? (
            <>
              <div className="chat-header">
                <button 
                  className="back-button mobile-only"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="chat-avatar">
                  {getUserInitials(selectedConversation.user.name)}
                </div>
                <div className="chat-user-info">
                  <h2>{selectedConversation.user.name}</h2>
                </div>
              </div>
              
              <div className="messages-list">
                {loading ? (
                  <div className="loading-state">Loading messages...</div>
                ) : error ? (
                  <div className="error-state">{error}</div>
                ) : messages.length === 0 ? (
                  <div className="empty-messages">
                    <p>No messages yet</p>
                    <p className="empty-messages-subtext">Send a message to start the conversation</p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isCurrentUser = message.senderId === user._id;
                    
                    return (
                      <div 
                        key={message._id} 
                        className={`message-item ${isCurrentUser ? 'sent' : 'received'}`}
                      >
                        <div className="message-bubble">
                          {message.content}
                          <span className="message-time">{formatTime(message.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <form className="message-input-container" onSubmit={sendMessage}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="message-input"
                />
                <button 
                  type="submit" 
                  className="send-button"
                  disabled={!newMessage.trim()}
                >
                  <SendHorizontal size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="no-conversation-content">
                <h2>Select a conversation</h2>
                <p>Choose a conversation or start a new one</p>
                <button 
                  className="start-chat-button"
                  onClick={handleNewChat}
                >
                  Start a new chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
