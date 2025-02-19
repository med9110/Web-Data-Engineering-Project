import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Menubar from "./Menubar";
import Home from "./Home";

interface Trip {
  hotel: { name: string; total_cost: number } | null;
  hotel_total_cost: number | null;
  restaurants: Array<{ name: string; price: number }>;
  activities: Array<{ name: string; price: number }>;
}
// In both Main.tsx and Home.tsx
interface DatabaseBooking {
  booking_date: string;
  listing_id: number;
  user_id?: number;
}
interface Booking {
  id: number;
  userId?: number;
  property: string;
  checkIn: string;
  checkOut: string;
  totalCost: number;
  status?: string;
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
  const [preferences, setPreferences] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const tokenInfo = localStorage.getItem("jwtToken");
    if (token) {
      setIsAuthenticated(true);
      setLoading(true);
      const fetchUserInfo = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8080/user/info", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch user information");
          }
          const data = await response.json();
          setUserRole(data.role);
          setFirstName(data.firstname);
          setLastName(data.lastname);
          setEmail(data.email);
          setAge(Number(data.age));
        } catch (error) {
          console.error("Error fetching user information:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserInfo();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && userRole === "OWNER") {
      navigate("/reservations");
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleSearch = async () => {
    if (!location || !checkIn || !checkOut || !budget) {
      alert("Please fill in all search parameters");
      return;
    }

    const url = "http://127.0.0.1:8000/recommendations/";
    const token = localStorage.getItem("authToken");
    setLoading(true);

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
          preferences,
          age: age,
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
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (bookings: DatabaseBooking[]) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please login to book a trip");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8080/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookings),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create bookings");
      }
  
      alert("Trip booked successfully!");
      navigate("/reservations");
    } catch (error) {
      console.error("Error creating bookings:", error);
      alert("Failed to book trip");
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
        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : isAuthenticated ? (
          <div className="space-y-8">
            {userRole !== "OWNER" && (
              <Menubar
                setLocation={setLocation}
                setCheckIn={setCheckIn}
                setCheckOut={setCheckOut}
                setBudget={setBudget}
                onSearch={handleSearch}
                preferences={preferences}
                setPreferences={setPreferences}
              />
            )}
            <Home
              trip={trip}
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              firstName={firstName}
              lastName={lastName}
              email={email}
              age={age}
              onBooking={handleBooking}
              checkIn={checkIn}
              checkOut={checkOut}
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