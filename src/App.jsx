import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import Profile from './pages/Profile';
import Events from './pages/Events';
import Footer from './components/Footer';
import TripManagerDashboard from './pages/TripManagerDashboard';
import CreateTrip from './pages/CreateTrip';
import LoginSignup from './pages/LoginSignup';
import TripDetail from './pages/TripDetail';
import EditTrip from './pages/EditTrip';
import Rewards from './pages/Rewards';
import Messages from './pages/Messages';
import Interests from './pages/Interests';
import './App.css';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={
          isAuthenticated ? 
            (user?.role === 'trip_manager' ? <Navigate to="/manager-dashboard" /> : <Navigate to="/dashboard" />) 
            : <Home />
        } />

        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
        />
        
        {/* Trip Manager Routes */}
        <Route 
          path="/manager-dashboard" 
          element={
            isAuthenticated && user?.role === 'trip_manager' ? 
            <TripManagerDashboard /> : 
            <Navigate to="/" />
          } 
        />
        
        <Route 
          path="/create-trip" 
          element={
            isAuthenticated && user?.role === 'trip_manager' ? 
            <CreateTrip /> : 
            <Navigate to="/" />
          } 
        />
        
        {/* Trip Detail and Edit Routes */}
        <Route 
          path="/trips/:id" 
          element={isAuthenticated ? <TripDetail /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/trips/:id/edit" 
          element={
            isAuthenticated && user?.role === 'trip_manager' ? 
            <EditTrip /> : 
            <Navigate to="/" />
          } 
        />
        
        {/* General Routes */}
        <Route 
          path="/trips" 
          element={isAuthenticated ? <Trips /> : <Navigate to="/" />} 
        />

        <Route 
          path="/events" 
          element={isAuthenticated ? <Events /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile /> : <Navigate to="/" />} 
        />
        
        {/* Add Login route - will show landing page with login/signup modal */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />} 
        />

        <Route 
          path="/rewards" 
          element={<Rewards />} 
        />

        <Route 
          path="/messages" 
          element={isAuthenticated ? <Messages /> : <Navigate to="/" />} 
        />

        <Route 
          path="/login-signup" 
          element={<LoginSignup />} 
        />

        <Route 
          path="/interests" 
          element={<Interests />} 
        />
      </Routes>
      {isAuthenticated && <Footer />}
    </div>
  );
}

export default App;
