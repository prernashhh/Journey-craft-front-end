import React, { useState } from "react";
import { AlertCircle, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { auth, googleProvider, signInWithPopup } from "../config/firebase"; // Make sure to import these
import "./LoginSignup.css";

function LoginSignup({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'traveller' // Default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Remove 'signup' and 'googleLogin' if they're not used

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const registerData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: formData.role || 'traveller'
      };

      if (isLogin) {
        const response = await axios.post('https://journety-craft-backend.onrender.com/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        const { token, user } = response.data;
        
        // Use the login function from context instead of just setting localStorage
        login(user, token);
        
        onClose();
        navigate('/dashboard');
      } else {
        const response = await axios.post('https://journety-craft-backend.onrender.com/api/auth/register', registerData);
        const { token, user } = response.data.data;
        
        // Use the login function from context
        login(user, token);
        
        onClose();
        // Only navigate to interests page if user is a traveller
        if (registerData.role === 'traveller') {
          navigate('/interests');
        } else {
          navigate('/manager-dashboard');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  async function handleGoogleSignIn() {
    try {
      setLoading(true);
      setError("");
      
      // Use the imported signInWithPopup function
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const response = await axios.post('https://journety-craft-backend.onrender.com/api/auth/google', {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
        role: formData.role || 'traveller'
      });
      
      // Use the login function from context
      login(response.data.user, response.data.token);
      
      onClose();
      
      if (response.data.user.role === 'trip_manager') {
        navigate('/manager-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Google auth error:', err);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-signup-container">
      <div className={`login-signup-card ${!isLogin ? 'signup-card' : ''}`}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <h2 className="form-title">
          {isLogin ? 
            <span>Welcome Back</span> : 
            <span>Create Account</span>
          }
        </h2>
        
        {error && (
          <div className="error-alert">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {isLogin ? (
            // Login form (vertical layout)
            <>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
            </>
          ) : (
            // Signup form (horizontal layout)
            <>
              <div className="form-row signup-form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    minLength={2}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row signup-form-row">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input 
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="role">Account Type</label>
                  <select 
                    id="role" 
                    name="role"
                    value={formData.role || 'traveller'} 
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="traveller">Traveller</option>
                    <option value="trip_manager">Trip Manager</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {isLogin && (
            <div className="forgot-password">
              <a href="#">Forgot password?</a>
            </div>
          )}
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Processing..." : (isLogin ? 
              <div className="google-button-container">
                <LogIn size={18} />
                <span>Login</span>
              </div> : 
              <div className="google-button-container">
                <UserPlus size={18} />
                <span>Sign Up</span>
              </div>
            )}
          </button>
        </form>
        
        <div className="divider">
          <span>OR</span>
        </div>
        
        <button 
          className="social-auth-button google-button"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <div className="google-button-container">
            <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" />
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 001.957 4.958L4.964 7.29C5.672 5.163 7.656 3.58 9 3.58z" />
            </svg>
            <span>{loading ? "Processing..." : "Continue with Google"}</span>
          </div>
        </button>
        
        <div className="toggle-form">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button"
              className="toggle-button" 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', password: '', role: 'traveller' });
              }}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;