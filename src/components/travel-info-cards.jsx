import React from 'react';
import { Shield, Clock, CreditCard, Map } from 'lucide-react';

export default function TravelInfoCards() {
  const infoCards = [
    {
      icon: Shield,
      title: "Safe Travel",
      description: "We prioritize your safety with verified services and 24/7 support"
    },
    {
      icon: Clock,
      title: "Time Saving",
      description: "Quick bookings and instant confirmations save your precious time"
    },
    {
      icon: CreditCard,
      title: "Best Prices",
      description: "Get competitive rates and exclusive deals on all bookings"
    },
    {
      icon: Map,
      title: "Expert Planning",
      description: "Professional trip planning assistance for the perfect journey"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-12">
          Why Choose JourneyCraft?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {infoCards.map((card, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#FFC857]/20 p-4 rounded-full mb-4">
                  <card.icon className="h-8 w-8 text-[#1E3A8A]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}