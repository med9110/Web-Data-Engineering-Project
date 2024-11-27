import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Menubar from "./Menubar";
import Home from "./Home";

interface Trip {
  hotel: { name: string; total_cost: number } | null;
  hotel_total_cost: number | null;
  restaurants: Array<{ name: string; price: number }>;
  activities: Array<{ name: string; price: number }>;
}

const Main = () => {
  const [trip, setTrip] = useState<Trip>({
    hotel: null,
    hotel_total_cost: null,
    restaurants: [],
    activities: [],
  });
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [budget, setBudget] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole, setUserRole] = useState("Owner");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      // try {
      //   // Attempt to decode the JWT token
      //   const base64Url = token.split('.')[1];
      //   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      //   const payload = JSON.parse(window.atob(base64));
      //   setUserRole(payload.role || "User"); // Default to "User" if role is not present
      // } catch (error) {
      //   console.error("Error decoding token:", error);
      //   // If token is invalid, reset authentication
      //   setIsAuthenticated(false);
      //   setUserRole("");
      //   localStorage.removeItem("authToken");
      // }
    }
  }, []);

  const handleSearch = async () => {
    if (!location || !checkIn || !checkOut || !budget) {
      alert("Please fill in all search parameters");
      return;
    }

    const url = "http://127.0.0.1:8000/recommendations/";
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          city: location,
          check_in_date: checkIn,
          check_out_date: checkOut,
          budget,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`${response.status}: ${errorMessage}`);
      }

      const result = await response.json();
      setTrip(result);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert(error instanceof Error ? error.message : "An error occurred while fetching recommendations.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        setIsAuthenticated={setIsAuthenticated}
        isAuthenticated={isAuthenticated}
        userRole={userRole}
      />
      
      <main className="container mx-auto px-4 py-8">
        {isAuthenticated ? (
          <div className="space-y-8">
            {/* Show Menubar only for regular users */}
            {userRole !== "Owner" && (
              <Menubar
                setLocation={setLocation}
                setCheckIn={setCheckIn}
                setCheckOut={setCheckOut}
                setBudget={setBudget}
                onSearch={handleSearch}
              />
            )}
            <Home 
              trip={trip} 
              isAuthenticated={isAuthenticated} 
              userRole={userRole}
            />
          </div>
        ) : (
          <Home 
            trip={trip} 
            isAuthenticated={isAuthenticated} 
            userRole={userRole}
          />
        )}
      </main>
    </div>
  );
};

export default Main;