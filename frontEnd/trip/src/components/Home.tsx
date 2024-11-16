import React from "react";
import lens from "../assets/morocco.jpg"; // Import the image

type Restaurant = {
  name: string;
  price: number;
};

type Activity = {
  name: string;
  price: number;
};

type Hotel = {
  name: string;
  total_cost: number;
};

type Trip = {
  hotel: Hotel | null;
  hotel_total_cost: number | null;
  restaurants: Restaurant[];
  activities: Activity[];
};

type HomeProps = {
  trip: Trip;
  isAuthenticated: boolean; // Add authentication prop
};

const Home: React.FC<HomeProps> = ({ trip, isAuthenticated }) => {
  // If the user is not authenticated, show the image
  if (!isAuthenticated) {
    return (
      <div className="text-center mt-10">
        <img src={lens} alt="Morocco" className="mx-auto" /> {/* Show image when not signed in */}
        <div>Please sign in to view your trip details.</div>
      </div>
    );
  }

  // If trip or hotel data is not available
  if (!trip || trip.hotel === null) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // If the user is authenticated, show the trip details
  return (
    <div className="max-w-3xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Your Trip Details</h2>
      
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-xl font-semibold">Hotel</h3>
        <p>
          <span className="font-medium">{trip.hotel.name}</span> - Total Cost: 
          <span className="font-bold"> {trip.hotel.total_cost} DH</span>
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-xl font-semibold">Restaurants</h3>
        {trip.restaurants.length > 0 ? (
          <ul className="list-disc pl-5">
            {trip.restaurants.map((restaurant: Restaurant, index: number) => (
              <li key={index}>
                <span className="font-medium">{restaurant.name}</span> - 
                <span className="font-bold"> {restaurant.price} DH</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-xl font-semibold">Activities</h3>
        {trip.activities.length > 0 ? (
          <ul className="list-disc pl-5">
            {trip.activities.map((activity: Activity, index: number) => (
              <li key={index}>
                <span className="font-medium">{activity.name}</span> - 
                <span className="font-bold"> {activity.price} DH</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No activities found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
