import React, { useState } from "react";
import lens from "../assets/morocco.jpg";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow duration-300">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

type Trip = {
  hotel: { name: string; total_cost: number } | null;
  restaurants: { name: string; price: number }[];
  activities: { name: string; price: number }[];
};

type Property = {
  name: string;
  description: string;
};

type HomeProps = {
  trip: Trip;
  isAuthenticated: boolean;
  userRole: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  age?: string;
};

const Home: React.FC<HomeProps> = ({ trip, isAuthenticated, userRole, firstName, lastName, email, age }) => {
  const mockProperties: Property[] = [
    {
      name: "Luxury Beach Villa",
      description: "A beautiful villa by the beach, perfect for vacations.",
    },
    {
      name: "Mountain Lodge",
      description: "A cozy lodge in the mountains with scenic views.",
    },
    {
      name: "City Center Apartment",
      description: "A modern apartment in the heart of the city.",
    },
  ];

  const [properties, setProperties] = useState<Property[]>(mockProperties);

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
        <img
          src={lens}
          alt="Morocco"
          className="absolute inset-0 object-cover w-full h-full"
        />
      </div>
    );
  }

  // Show Owner Dashboard
  if (userRole === "OWNER") {
    return (
      <div className="max-w-3xl mx-auto p-5">
        <h2 className="text-2xl font-bold mb-4">Welcome, {firstName} {lastName}</h2>
        <p className="text-gray-600 mb-6">Manage your properties and bookings efficiently.</p>

        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Your Properties</h2>
          <p className="text-gray-600 mb-6">
            Add new properties, edit existing ones, manage bookings, and view analytics.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
            Add New Property
          </button>

          {/* List of properties */}
          <div className="space-y-6 mt-6">
            {properties.map((property, index) => (
              <div key={index} className="bg-white p-6 rounded-md shadow-md">
                <h3 className="text-xl font-semibold mb-2">{property.name}</h3>
                <p className="text-gray-600">{property.description}</p>
                <div className="flex space-x-4 mt-4">
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
                    Delete
                  </button>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
                    View Bookings
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Analytics and Bookings */}
          <div className="bg-gray-100 p-6 rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">Bookings Overview</h3>
            <p className="text-gray-600 mb-2">You have 5 new bookings this week.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
              View All Bookings
            </button>
          </div>

          <div className="bg-gray-100 p-6 rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">Property Analytics</h3>
            <p className="text-gray-600 mb-2">
              Your properties had a 90% occupancy rate last month.
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show Traveler View
  // If no trip is selected, show the feature cards
  if (!trip.hotel && trip.restaurants.length === 0 && trip.activities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-4">
            <h1 className="font-extrabold text-6xl text-gray-800 tracking-tight">
              Where to go, {firstName}?
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enter your travel details and let us plan your perfect trip.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto mt-16">
            <FeatureCard
              title="Personalized Planning"
              description="Get customized recommendations based on your preferences and budget."
              icon="🎯"
            />
            <FeatureCard
              title="Local Experiences"
              description="Discover authentic local activities and hidden gems."
              icon="🌟"
            />
            <FeatureCard
              title="Smart Budgeting"
              description="Optimize your spending with our budget-friendly suggestions."
              icon="💰"
            />
          </div>
        </div>
      </div>
    );
  }

  // Show trip details for travelers
  return (
    <div className="max-w-3xl mx-auto p-5">
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Trip Details, {firstName}</h2>
        <p className="text-gray-600">Plan your dream trip effortlessly.</p>
        {/* Render trip details */}
        {trip.hotel && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Hotel</h3>
            <p>{trip.hotel.name} - ${trip.hotel.total_cost}</p>
          </div>
        )}
        {trip.restaurants.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Restaurants</h3>
            <ul>
              {trip.restaurants.map((restaurant, index) => (
                <li key={index}>
                  {restaurant.name} - ${restaurant.price}
                </li>
              ))}
            </ul>
          </div>
        )}
        {trip.activities.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Activities</h3>
            <ul>
              {trip.activities.map((activity, index) => (
                <li key={index}>
                  {activity.name} - ${activity.price}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
