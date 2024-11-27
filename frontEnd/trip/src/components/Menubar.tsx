import React from "react";
import lens from "../assets/lens.png";

type searchProp = { 
  setLocation: (value: string) => void; 
  setCheckIn: (value: string) => void; 
  setCheckOut: (value: string) => void; 
  setBudget: (value: number) => void; 
  onSearch: () => void; 
};

const Menubar = (props: searchProp) => {
  return (
    <div className="flex justify-center px-4 py-4 w-full">
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
    </div>
  );
};

export default Menubar;
