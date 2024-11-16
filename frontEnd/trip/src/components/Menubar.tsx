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
    <>
      <div className="flex justify-center mt-10">
        <div className="flex border p-4 shadow-lg rounded-full items-center w-11/12 max-w-5xl bg-white">
          {/* Location Input */}
          <div className="flex items-center mx-2">
            <img src={lens} className="w-5 h-5" alt="Location Icon" />
            <input
              onChange={(e) => props.setLocation(e.target.value)}
              placeholder="Location"
              className="ml-2 w-36 outline-none text-sm p-2 rounded-md border border-gray-300"
            />
          </div>

          {/* Divider */}
          <div className="border-l h-8 mx-2"></div>

          {/* Check-in Date */}
          <div className="flex items-center mx-2">
            <input
              type="date"
              onChange={(e) => props.setCheckIn(e.target.value)}
              className="text-sm outline-none w-36 p-2 rounded-md border border-gray-300"
            />
          </div>

          {/* Divider */}
          <div className="border-l h-8 mx-2"></div>

          {/* Check-out Date */}
          <div className="flex items-center mx-2">
            <input
              type="date"
              onChange={(e) => props.setCheckOut(e.target.value)}
              className="text-sm outline-none w-36 p-2 rounded-md border border-gray-300"
            />
          </div>

          {/* Divider */}
          <div className="border-l h-8 mx-2"></div>

          {/* Budget Section */}
          <div className="flex items-center mx-2">
            <span className="text-sm">Budget:</span>
            <input
              type="number"
              onChange={(e) => props.setBudget(Number(e.target.value))}
              placeholder="Budget"
              className="ml-2 w-24 outline-none text-sm p-2 rounded-md border border-gray-300"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={props.onSearch}
            className="ml-4 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition ease-in-out duration-300 shadow-md"
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
};

export default Menubar;
