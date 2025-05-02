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
import TravelBooking from './pages/TravelBooking';
import ItineraryDetailView from './pages/ItineraryDetailView';
import Wishlist from './pages/Wishlist';
import './App.css';
import './styles/itinerary-components.css';

function App() {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading indicator while auth state is being determined
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

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

        <Route 
          path="/travel-booking" 
          element={<TravelBooking />} 
        />

        <Route 
          path="/itineraries/:id" 
          element={<ItineraryDetailView />} 
        />

        <Route 
          path="/wishlist" 
          element={<Wishlist />} 
        />
      </Routes>
      {isAuthenticated && <Footer />}
    </div>
  );
}

export default App;
