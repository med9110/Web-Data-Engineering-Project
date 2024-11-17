import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Signin from "./Signin";
import Signup from "./Singup";
import defaultAvatar from "../assets/avatar.png";

const Navbar = ({ setIsAuthenticated, isAuthenticated }: { setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>, isAuthenticated: boolean }) => {
  const [signinPopup, setSigninPopup] = useState(false);
  const [signupPopup, setSignupPopup] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center px-6 py-4 bg-white text-black shadow-md">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <h1 className="font-bold text-2xl">TripRecommender</h1>
        </div>

        {/* Navigation Links - Centered and styled consistently */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-12">
          <Link 
            to="/discover" 
            className="font-semibold text-lg hover:text-gray-700 cursor-pointer transition duration-300 px-4 py-2 rounded-full hover:bg-gray-100"
          >
            Discover
          </Link>
          <Link 
            to="/trips" 
            className="font-semibold text-lg hover:text-gray-700 cursor-pointer transition duration-300 px-4 py-2 rounded-full hover:bg-gray-100"
          >
            Trips
          </Link>
        </div>

        {/* Auth Buttons or Profile Avatar */}
        <div className="flex space-x-4 items-center">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => setSigninPopup(true)}
                className="rounded-full bg-black p-3 text-white w-24 hover:bg-gray-800 transition duration-300"
              >
                Sign in
              </button>
              <button
                onClick={() => setSignupPopup(true)}
                className="rounded-full bg-green-500 p-3 text-white w-24 hover:bg-green-600 transition duration-300"
              >
                Sign up
              </button>
            </>
          ) : (
            <div className="relative">
              <img
                src={defaultAvatar}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition duration-300"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                  <Link 
                    to="/Acount-Info"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Account Info
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Popup Modals */}
      {signinPopup && <Signin setSigninPopup={setSigninPopup} setIsAuthenticated={setIsAuthenticated} />}
      {signupPopup && <Signup setSignupPopup={setSignupPopup} />}
    </div>
  );
};

export default Navbar;