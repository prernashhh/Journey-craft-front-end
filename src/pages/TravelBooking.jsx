import React, { useState } from "react";
import {
  Compass,
  Building2,
  Plane,
  Train,
  Bus,
  Car,
} from "lucide-react";

import Navbar from "../components/Navbar";
import FlightSearch from "../components/flight-search";
import HotelSearch from "../components/hotel-search";
import TrainSearch from "../components/train-search";
import BusSearch from "../components/bus-search";
import CabSearch from "../components/cab-search";
import TripSearch from "../components/trip-search";

import "./TravelBooking.css";

function TravelBooking() {
  const [activeSection, setActiveSection] = useState("trips");

  const sections = [
    { id: "trips", icon: Compass, label: "Trips" },
    { id: "hotels", icon: Building2, label: "Hotels" },
    { id: "flights", icon: Plane, label: "Flights" },
    { id: "trains", icon: Train, label: "Trains" },
    { id: "buses", icon: Bus, label: "Buses" },
    { id: "cabs", icon: Car, label: "Cabs" },
  ];

  return (
    <div className="travel-page">
      <Navbar />
      
      <div className="travel-banner">
        <img 
          src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1470&q=80" 
          alt="Travel" 
          className="travel-banner-image" 
        />
        <div className="travel-overlay"></div>
        <div className="travel-banner-content">
          <h1>
            Craft Your Perfect <span>Journey</span>
          </h1>
          <p>Discover handcrafted experiences and create unforgettable memories</p>
        </div>
      </div>

      <div className="search-section">
        <div className="tabs">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`tab-button ${activeSection === section.id ? "active" : ""}`}
              onClick={() => setActiveSection(section.id)}
            >
              <div className="icon-wrapper">
                <section.icon size={20} color="#1E3A8A" />
              </div>
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        <div className="search-box">
          {activeSection === "trips" && <TripSearch />}
          {activeSection === "hotels" && <HotelSearch />}
          {activeSection === "flights" && <FlightSearch />}
          {activeSection === "trains" && <TrainSearch />}
          {activeSection === "buses" && <BusSearch />}
          {activeSection === "cabs" && <CabSearch />}
        </div>
      </div>
    </div>
  );
}

export default TravelBooking;
