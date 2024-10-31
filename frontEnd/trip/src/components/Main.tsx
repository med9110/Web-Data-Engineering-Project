import { useEffect, useState } from "react";
import Menubar from "./Menubar";
import Navbar from "./Navbar";
import Home from "./Home";

const Main = () => {
  const [trip, setTrip] = useState([]);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState(""); // Individual check-in state
  const [checkOut, setCheckOut] = useState(""); // Individual check-out state
  const [budget, setBudget] = useState(0); // Combined budget

  const handleSearch = async () => {
    console.log("Searching with the following parameters:");
    console.log(`Location: ${location}`);
    console.log(`Check-in: ${checkIn}`);
    console.log(`Check-out: ${checkOut}`);
    console.log(`Budget: ${budget}`);

    // Call your Spring backend API here
    const url = 'http://localhost:8080/api/trips'; // Update with your Spring API endpoint
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        location,
        checkIn,
        checkOut,
        budget
      })
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setTrip(result); // Adjust according to your API response structure
    } catch (error) {
      console.error(error);
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
        onSearch={handleSearch} // Pass the search handler
      />
      {/* <Home trip={trip} /> */}
    </div>
  );
};

export default Main;
