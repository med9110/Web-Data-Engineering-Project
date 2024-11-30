import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Signin from "./Signin";
import Signup from "./Singup";
import defaultAvatar from "../assets/avatar.png";

type NavbarProps = {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  userRole: string; // Make userRole required
};

const Navbar: React.FC<NavbarProps> = ({ setIsAuthenticated, isAuthenticated, userRole }) => {
  const [signinPopup, setSigninPopup] = useState(false);
  const [signupPopup, setSignupPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("jwtToken");

    navigate("/");
  };

  // Define navigation links based on user role
  const navigationLinks = userRole === "OWNER" 
    ? [
        { to: "/reservations", text: "Reservations" },
        { to: "/properties", text: "Properties" },
      ]
    : [
        { to: "/discover", text: "Discover" },
        // { to: "/trips", text: "Trips" },
      ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo with link to Home */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <h1 className="font-bold text-xl md:text-2xl text-gray-800">TripRecommender</h1>
          </Link>
        </div>

        {/* Navigation Links (Centered and Aligned with Components) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-12">
          {navigationLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-lg font-medium text-gray-700 hover:text-gray-900 transition duration-300"
            >
              {link.text}
            </Link>
          ))}
        </div>

        {/* Hamburger Menu (Mobile View) */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} 
            />
          </svg>
        </button>

        {/* Auth or Profile Section */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <div className={`flex space-x-4 ${menuOpen ? "block" : "hidden"} md:flex`}>
              <button
                onClick={() => setSigninPopup(true)}
                className="rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800 transition duration-300"
              >
                Sign in
              </button>
              <button
                onClick={() => setSignupPopup(true)}
                className="rounded-full bg-green-500 text-white px-4 py-2 hover:bg-green-600 transition duration-300"
              >
                Sign up
              </button>
            </div>
          ) : (
            <div className="relative">
              <img
                src={defaultAvatar}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition duration-300"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <Link
                    to="/account-info"
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

      {/* Mobile Navigation Links */}
      {menuOpen && (
        <div className="block md:hidden mt-4 space-y-2 pb-4">
          {navigationLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-4 text-lg font-medium text-gray-700 hover:text-gray-900 transition duration-300"
            >
              {link.text}
            </Link>
          ))}
        </div>
      )}

      {/* Popup Modals */}
      {signinPopup && <Signin setSigninPopup={setSigninPopup} setIsAuthenticated={setIsAuthenticated} />}
      {signupPopup && <Signup setSignupPopup={setSignupPopup} />}
    </nav>
  );
};

export default Navbar;
