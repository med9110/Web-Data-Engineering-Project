import React, { useState, useEffect } from "react";
import lens from "../assets/morocco.jpg";
import { useNavigate } from "react-router-dom";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: string;
};
interface DatabaseBooking {
  booking_date: string;
  listing_id: number;
  user_id?: number;
}
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

type Booking = {
  id: number;
  userId?: number;
  property: string;
  checkIn: string;
  checkOut: string;
  totalCost: number;
  status?: string;
};

type HomeProps = {
  trip: Trip;
  isAuthenticated: boolean;
  userRole: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  age?: number;
  onBooking?: (bookings: DatabaseBooking[]) => void;
  checkIn?: string;
  checkOut?: string;
};

const Home: React.FC<HomeProps> = ({
  trip,
  isAuthenticated,
  userRole,
  firstName,
  lastName,
  email,
  age,
  onBooking,
  checkIn,
  checkOut
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && userRole === "OWNER") {
      const fetchBookings = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8080/bookings");
          if (!response.ok) {
            throw new Error("Failed to fetch bookings");
          }
          const data = await response.json();
          setBookings(data);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      };
      fetchBookings();
    }
  }, [isAuthenticated, userRole]);

  const handleDeleteBooking = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/bookings/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleBookTrip = () => {
    if (!onBooking || !trip.hotel) return;
  
    const bookings: DatabaseBooking[] = [];
    const currentDate = new Date().toISOString();
  
    // Add hotel booking
    if (trip.hotel) {
      bookings.push({
        booking_date: currentDate,
        listing_id: parseInt(trip.hotel.name), // Assuming name contains listing ID
        user_id: undefined // Will be set by backend
      });
    }
  
    // Add restaurant bookings
    trip.restaurants.forEach(restaurant => {
      bookings.push({
        booking_date: currentDate,
        listing_id: parseInt(restaurant.name), // Assuming name contains listing ID
        user_id: undefined
      });
    });
  
    // Add activity bookings
    trip.activities.forEach(activity => {
      bookings.push({
        booking_date: currentDate,
        listing_id: parseInt(activity.name), // Assuming name contains listing ID
        user_id: undefined
      });
    });
  
    onBooking(bookings);
  };

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

  if (userRole === "OWNER") {
    return (
      <div className="max-w-3xl mx-auto p-5">
        <h2 className="text-2xl font-bold mb-4">Welcome, {firstName} {lastName}</h2>
        <p className="text-gray-600 mb-6">Manage your properties and bookings efficiently.</p>

        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Your Bookings</h2>
          <div className="space-y-6 mt-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white p-6 rounded-md shadow-md">
                <h3 className="text-xl font-semibold mb-2">Booking at {booking.property}</h3>
                <p className="text-gray-600">Check-in: {booking.checkIn}</p>
                <p className="text-gray-600">Check-out: {booking.checkOut}</p>
                <p className="text-gray-600">Total Cost: ${booking.totalCost}</p>
                <div className="flex space-x-4 mt-4">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                    onClick={() => navigate(`/edit-booking/${booking.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                    onClick={() => handleDeleteBooking(booking.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="max-w-3xl mx-auto p-5">
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Trip Details, {firstName}</h2>
        <p className="text-gray-600">Plan your dream trip effortlessly.</p>
        
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

        {trip.hotel && (
          <button
            onClick={handleBookTrip}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Book This Trip
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;