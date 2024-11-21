import React, { useEffect, useState } from "react";

const Discover = () => {
  const [bestHotel, setBestHotel] = useState(null);
  const [bestRestaurant, setBestRestaurant] = useState(null);
  const [bestActivity, setBestActivity] = useState(null);

  useEffect(() => {
    // Fetch the best rated hotel, restaurant, and activity from the backend
    const fetchBestRated = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/best-rated");
        const data = await response.json();
        setBestHotel(data.hotel);
        setBestRestaurant(data.restaurant);
        setBestActivity(data.activity);
      } catch (error) {
        console.error("Error fetching best rated data:", error);
      }
    };

    fetchBestRated();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Discover</h2>
      {bestHotel && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-xl font-semibold">Best Rated Hotel</h3>
          <p>{bestHotel.name} - Rating: {bestHotel.rating}</p>
        </div>
      )}
      {bestRestaurant && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-xl font-semibold">Best Rated Restaurant</h3>
          <p>{bestRestaurant.name} - Rating: {bestRestaurant.rating}</p>
        </div>
      )}
      {bestActivity && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-xl font-semibold">Best Rated Activity</h3>
          <p>{bestActivity.name} - Rating: {bestActivity.rating}</p>
        </div>
      )}
    </div>
  );
};

export default Discover;