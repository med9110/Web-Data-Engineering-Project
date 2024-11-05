import { useEffect, useState } from "react";
import Menubar from "./Menubar";
import Navbar from "./Navbar";
import Home from "./Home";

const Main = () => {
  const [trip, setTrip] = useState({
    hotel: null as { name: string; total_cost: number } | null,
    hotel_total_cost: null as number | null,
    restaurants: [] as { name: string; price: number }[],
    activities: [] as { name: string; price: number }[]
  });
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [budget, setBudget] = useState(0);
  const [age, setAge] = useState(0);
  const [preference, setPreference] = useState("");

  const handleSearch = async () => {
    console.log("Searching with the following parameters:");
    console.log(`Location: ${location}`);
    console.log(`Check-in: ${checkIn}`);
    console.log(`Check-out: ${checkOut}`);
    console.log(`Budget: ${budget}`);
    console.log(`Age: ${age}`);
    console.log(`Preference: ${preference}`);

    const url = "http://127.0.0.1:8000/recommendations/"; // Update with your FastAPI endpoint
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        age,
        preference,
        city: location,
        check_in_date: checkIn,
        check_out_date: checkOut,
        budget
      })
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error response:", response.status, errorMessage);
        alert(`Error: ${response.status} - ${errorMessage}`);
        return;
      }
      const result = await response.json();
      setTrip(result);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("An error occurred while fetching recommendations.");
    }
  };

  return (
    <div>
      <Navbar />
      <Menubar
        setLocation={setLocation}
        setCheckIn={setCheckIn}
        setCheckOut={setCheckOut}
        setBudget={setBudget}
        onSearch={handleSearch}
        setAge={setAge}
        setPreference={setPreference}
      />
      <Home trip={trip} />
    </div>
  );
};

export default Main;
