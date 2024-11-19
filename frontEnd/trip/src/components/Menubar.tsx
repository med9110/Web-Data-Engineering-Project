import React from 'react';
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
    <div className="flex justify-center px-4 py-2 w-full">
      <div className="flex flex-col md:flex-row justify-between border p-4 shadow-lg md:rounded-full rounded-lg items-center w-full max-w-6xl bg-white space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          {/* Location Input */}
          <div className="flex items-center w-full md:w-auto md:min-w-[200px]">
            <img src={lens} className="w-5 h-5" alt="Location Icon" />
            <input 
              onChange={(e) => props.setLocation(e.target.value)} 
              placeholder="Location" 
              className="ml-2 w-full outline-none text-sm p-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-300" 
            />
          </div>

          {/* Divider - Only visible on medium screens and larger */}
          <div className="hidden md:block border-l h-8"></div>

          {/* Check-in Date */}
          <div className="flex items-center w-full md:w-auto md:min-w-[160px]">
            <input 
              type="date" 
              onChange={(e) => props.setCheckIn(e.target.value)} 
              className="w-full text-sm outline-none p-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-300" 
            />
          </div>

          {/* Divider - Only visible on medium screens and larger */}
          <div className="hidden md:block border-l h-8"></div>

          {/* Check-out Date */}
          <div className="flex items-center w-full md:w-auto md:min-w-[160px]">
            <input 
              type="date" 
              onChange={(e) => props.setCheckOut(e.target.value)} 
              className="w-full text-sm outline-none p-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-300" 
            />
          </div>

          {/* Divider - Only visible on medium screens and larger */}
          <div className="hidden md:block border-l h-8"></div>

          {/* Budget Section */}
          <div className="flex items-center w-full md:w-auto md:min-w-[140px]">
            <span className="text-sm whitespace-nowrap mr-2">Budget:</span>
            <input 
              type="number" 
              onChange={(e) => props.setBudget(Number(e.target.value))} 
              placeholder="Budget" 
              className="w-full outline-none text-sm p-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-300" 
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-center w-full md:w-auto mt-4 md:mt-0 md:ml-4">
          <button 
            onClick={props.onSearch} 
            className="w-full md:w-auto px-8 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition ease-in-out duration-300 shadow-md transform hover:scale-105"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menubar;