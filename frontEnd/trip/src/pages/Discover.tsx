import React, { useEffect, useState } from "react";

const token = localStorage.getItem("authToken");

// Define the Listing interface
interface Listing {
  id: number;
  name: string;
  description: string | null;
  theme: string | null;
  owner: string | null;
  bookings: any[];
  ratings: any[];
  idRef: string;
  type: string;
  typeService: string;
  location: string;
  price: number;
}

const Discover = () => {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    // Fetch all listings from the backend
    const fetchListings = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/listings", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        const data: Listing[] = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">All Listings</h2>
      {listings.map((listing) => (
        <div key={listing.id} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-xl font-semibold">{listing.name}</h3>
          <p>ID Reference: {listing.idRef}</p>
          <p>Type: {listing.type}</p>
          <p>Service Type: {listing.typeService}</p>
          <p>Location: {listing.location}</p>
          <p>Price: ${listing.price.toFixed(2)}</p>
          {listing.description && <p>Description: {listing.description}</p>}
          {listing.theme && <p>Theme: {listing.theme}</p>}
          {listing.owner && <p>Owner: {listing.owner}</p>}
        </div>
      ))}
    </div>
  );
};

export default Discover;