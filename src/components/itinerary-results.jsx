import React, { useState, useEffect } from "react";
import { ItineraryCard } from "./itinerary-card";
import axios from "axios";
import './itinerary-results.css';
import { Loader } from "lucide-react";

export function ItineraryResults({ city }) {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Use query parameter to filter by destination
        const response = await axios.get(`https://journety-craft-backend.onrender.com/api/itineraries`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { destination: city }
        });

        // Fixed filter to safely handle undefined values
        const filteredItineraries = response.data.filter(itinerary => {
          // Ensure itinerary status and destination exist before calling toLowerCase()
          const hasPublishedStatus = itinerary.status === 'Published';
          
          // Check if destination exists and includes the city
          const mainDestinationMatch = itinerary.destination && 
            itinerary.destination.toLowerCase().includes(city.toLowerCase());
          
          // Check if any destination location includes the city
          const destinationsMatch = itinerary.destinations && 
            Array.isArray(itinerary.destinations) &&
            itinerary.destinations.some(dest => 
              dest && dest.location && dest.location.toLowerCase().includes(city.toLowerCase())
            );
          
          return hasPublishedStatus && (mainDestinationMatch || destinationsMatch);
        });

        setItineraries(filteredItineraries);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching itineraries:", err);
        setError("Failed to load itineraries");
        setLoading(false);
      }
    };

    if (city) {
      fetchItineraries();
    }
  }, [city]);

  // Show loading state
  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="animate-spin" size={32} />
        <p>Finding the best trips for you...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Show empty state
  if (itineraries.length === 0) {
    return (
      <div className="no-results">
        <p>No itineraries found for {city}. Try another destination or check back later.</p>
      </div>
    );
  }

  // Show results
  return (
    <div className="itinerary-results-grid">
      {itineraries.map((itinerary) => (
        <ItineraryCard 
          key={itinerary._id}
          title={itinerary.title}
          destination={itinerary.destination}
          duration={`${itinerary.days} Days / ${itinerary.nights} Nights`}
          price={itinerary.price}
          rating={4.5} // You may want to add a rating field to your schema
          image={itinerary.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1470&auto=format&fit=crop"}
          highlights={itinerary.destinations.map(dest => dest.location)}
          included={["Hotels", "Sightseeing", "Some meals"]} // You may want to add this to your schema
          itineraryId={itinerary._id}
        />
      ))}
    </div>
  );
}
