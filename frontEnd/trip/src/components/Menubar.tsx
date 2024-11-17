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
    <div className="flex justify-center -mt-4"> {/* Adjusted margin to connect with title */}
      <div className="flex flex-wrap justify-between border p-4 shadow-lg rounded-full items-center w-11/12 max-w-5xl bg-white">
        <div className="flex flex-wrap items-center gap-4 flex-1"> {/* Increased gap */}
          {/* Location Input */}
          <div className="flex items-center min-w-[200px]"> {/* Added min-width */}
            <img src={lens} className="w-5 h-5" alt="Location Icon" />
            <input
              onChange={(e) => props.setLocation(e.target.value)}
              placeholder="Location"
              className="ml-2 w-full outline-none text-sm p-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-300"
            />
          </div>

          {/* Divider */}
          <div className="border-l h-8 hidden sm:block"></div>

          {/* Check-in Date */}
          <div className="flex items-center min-w-[160px]">
            <input
              type="date"
              onChange={(e) => props.setCheckIn(e.target.value)}
              className="w-full text-sm outline-none p-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-300"
            />
          </div>

          {/* Divider */}
          <div className="border-l h-8 hidden sm:block"></div>

          {/* Check-out Date */}
          <div className="flex items-center min-w-[160px]">
            <input
              type="date"
              onChange={(e) => props.setCheckOut(e.target.value)}
              className="w-full text-sm outline-none p-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-300"
            />
          </div>

          {/* Divider */}
          <div className="border-l h-8 hidden sm:block"></div>

          {/* Budget Section */}
          <div className="flex items-center min-w-[140px]">
            <span className="text-sm whitespace-nowrap">Budget:</span>
            <input
              type="number"
              onChange={(e) => props.setBudget(Number(e.target.value))}
              placeholder="Budget"
              className="ml-2 w-full outline-none text-sm p-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-300"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-center ml-4">
          <button
            onClick={props.onSearch}
            className="px-8 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition ease-in-out duration-300 shadow-md transform hover:scale-105"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menubar;