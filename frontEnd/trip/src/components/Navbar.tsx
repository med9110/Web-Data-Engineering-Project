import { useState } from "react";
import logo from "../assets/logo.png";
import Signin from "./Signin";
import Signup from "./Singup"; // Make sure to create the Signup component

const Navbar = ({ setIsAuthenticated }: { setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [signinPopup, setSigninPopup] = useState(false);
  const [signupPopup, setSignupPopup] = useState(false); // State for Sign Up popup

  return (
    <>
      <div className="flex justify-between items-center px-6 py-4 bg-white text-black">
        {/* Logo and Title */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <h1 className="ml-2 font-bold text-2xl">TripRecommender</h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden sm:flex space-x-8">
          <h1 className="font-semibold hover:text-gray-700 cursor-pointer">Discover</h1>
          <h1 className="font-semibold hover:text-gray-700 cursor-pointer">Trips</h1>
        </div>

        {/* Auth Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => setSigninPopup(true)}
            className="rounded-full bg-black p-3 text-white w-24"
          >
            Sign in
          </button>
          <button
            onClick={() => setSignupPopup(true)}
            className="rounded-full bg-green-500 p-3 text-white w-24"
          >
            Sign up
          </button>
        </div>
      </div>

      {/* Main Title */}
      <h1 className="font-extrabold text-center text-5xl mt-10">Where to?</h1>

      {/* Popup Modals */}
      {signinPopup && <Signin setSigninPopup={setSigninPopup} setIsAuthenticated={setIsAuthenticated} />}
      {signupPopup && <Signup setSignupPopup={setSignupPopup} />}
    </>
  );
};

export default Navbar;
