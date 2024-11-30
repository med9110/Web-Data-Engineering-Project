import React from "react";
import lens from "../assets/lens.png";

type searchProp = {
  setLocation: (value: string) => void;
  setCheckIn: (value: string) => void;
  setCheckOut: (value: string) => void;
  setBudget: (value: number) => void;
  preferences: string[];
  setPreferences: (value: string[]) => void;
  onSearch: () => void;
};

const Menubar = (props: searchProp) => {
  const availablePreferences = ["Hébergement",
    "Restauration",
    "Activités",
    "Outdoor Adventures",
    "Cultural Experiences",
    "Workshops",
    "Luxury Stays",
    "Street Food",
    "Family Activities",
    "Solo Travel"];

  const handlePreferenceChange = (preference: string) => {
    if (props.preferences.includes(preference)) {
      props.setPreferences(props.preferences.filter((p) => p !== preference));
    } else if (props.preferences.length < 3) {
      props.setPreferences([...props.preferences, preference]);
    } else {
      alert("You can only select up to 3 preferences.");
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-4 w-full space-y-4">
      {/* Main Input and Search Section */}
      <div className="flex flex-col md:flex-row justify-between border p-5 shadow-md md:rounded-full rounded-lg items-center w-full max-w-7xl bg-white space-y-4 md:space-y-0">
        {/* Inputs Container */}
        <div className="flex flex-col md:flex-row items-center gap-6 w-full">
          {/* Location Input */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <img src={lens} className="w-5 h-5" alt="Location Icon" />
            <input
              onChange={(e) => props.setLocation(e.target.value)}
              placeholder="Enter a location"
              className="w-full md:w-60 outline-none text-sm p-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition"
            />
          </div>

          {/* Divider */}
          <div className="hidden md:block border-l border-gray-200 h-8"></div>

          {/* Check-in Date */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="date"
              onChange={(e) => props.setCheckIn(e.target.value)}
              className="w-full md:w-48 text-sm outline-none p-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition"
            />
          </div>

          {/* Divider */}
          <div className="hidden md:block border-l border-gray-200 h-8"></div>

          {/* Check-out Date */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="date"
              onChange={(e) => props.setCheckOut(e.target.value)}
              className="w-full md:w-48 text-sm outline-none p-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition"
            />
          </div>

          {/* Divider */}
          <div className="hidden md:block border-l border-gray-200 h-8"></div>

          {/* Budget Input */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm text-gray-600">Budget:</span>
            <input
              type="number"
              onChange={(e) => props.setBudget(Number(e.target.value))}
              placeholder="Enter budget"
              className="w-full md:w-32 outline-none text-sm p-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-end w-full md:w-auto">
          <button
            onClick={props.onSearch}
            className="w-full md:w-auto px-6 py-2 bg-green-500 text-white text-sm font-medium rounded-full hover:bg-green-600 focus:ring focus:ring-green-300 transition transform hover:scale-105"
          >
            Search
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-7xl">
        <label className="block text-gray-700 font-semibold mb-2 text-center w-full">
          Select up to 3 preferences:
        </label>
        <div className="flex flex-wrap gap-3">
          {availablePreferences.map((pref) => (
            <button
              key={pref}
              onClick={() => handlePreferenceChange(pref)}
              className={`px-4 py-2 text-sm rounded-full transition ${
                props.preferences.includes(pref)
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } hover:shadow-md`}
            >
              {pref}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menubar;
