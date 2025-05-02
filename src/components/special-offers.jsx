import React from 'react';
import { Tag, Clock } from 'lucide-react';

const offers = [
  {
    id: 1,
    title: 'Early Bird Summer Special',
    description: 'Book your summer vacation early and save up to 30%',
    discount: '30% OFF',
    validity: 'Valid until May 31, 2025',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
  },
  {
    id: 2,
    title: 'Weekend Getaway Deal',
    description: 'Special rates for weekend stays at premium hotels',
    discount: '25% OFF',
    validity: 'Valid for weekend bookings',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'
  },
  {
    id: 3,
    title: 'Group Travel Discount',
    description: 'Special group rates for parties of 4 or more',
    discount: '20% OFF',
    validity: 'Valid for groups of 4+',
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3'
  }
];

export default function SpecialOffers() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-12">
          Special Offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div 
              key={offer.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-[#FFC857] text-[#1E3A8A] px-3 py-1 rounded-full font-semibold">
                  {offer.discount}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {offer.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {offer.description}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {offer.validity}
                </div>
                <button className="mt-4 w-full bg-[#1E3A8A] text-white py-2 rounded-lg hover:bg-[#1E3A8A]/90 transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}