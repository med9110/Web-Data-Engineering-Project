import React, { useState, useEffect } from "react";
import StarRating from "../components/StarRating";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const userId = 1; // Replace with actual user ID

  useEffect(() => {
    // Fetch past trips from the backend
    const fetchTrips = async () => {
      const response = await fetch("http://127.0.0.1:8000/past-trips");
      const data = await response.json();
      setTrips(data);
    };

    fetchTrips();
  }, []);

  const handleRatingSubmit = async (ratedItemId, rating) => {
    const response = await fetch("http://127.0.0.1:8000/submit-rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        rated_item_id: ratedItemId,
        rating: rating,
      }),
    });

    if (!response.ok) {
      console.error("Failed to submit rating");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Trips</h2>
      {trips.map((trip) => (
        <div key={trip.id} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{trip.hotel.name}</h3>
          <StarRating onRatingChange={(rating) => handleRatingSubmit(trip.hotel.id, rating)} />
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Restaurants</h4>
            {trip.restaurants.map((restaurant) => (
              <div key={restaurant.id} className="mb-2">
                <p>{restaurant.name}</p>
                <StarRating onRatingChange={(rating) => handleRatingSubmit(restaurant.id, rating)} />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Activities</h4>
            {trip.activities.map((activity) => (
              <div key={activity.id} className="mb-2">
                <p>{activity.name}</p>
                <StarRating onRatingChange={(rating) => handleRatingSubmit(activity.id, rating)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Trips;