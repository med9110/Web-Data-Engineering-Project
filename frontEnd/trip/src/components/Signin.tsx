import { useState } from "react";
import logo from "../assets/logo.png";

type signinProp = {
  setSigninPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>; 
};

const Signin = (props: signinProp) => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const handleSignin = async () => {
    if (!emailInput || !passwordInput) {
      console.error("Email and password are required");
      return;
    }

    const url = "http://127.0.0.1:8000/login/"; // Your backend login endpoint
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput,
      }),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error response:", response.status, errorMessage);
        alert("Failed to log in. Please check your credentials.");
        return;
      }

      const result = await response.json();
      if (result.success) {
        props.setIsAuthenticated(true); // Set user as authenticated
        localStorage.setItem("authToken", result.token); // Store JWT token for future requests
        props.setSigninPopup(false); // Close the sign-in popup
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred while logging in.");
    }
  };

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:items-start p-4">
                <div className="flex">
                  <img src={logo} className="w-10 h-10 bg-green-400 rounded-full" />
                  <h1
                    onClick={() => props?.setSigninPopup(false)}
                    className="font-extrabold ml-96 cursor-pointer"
                  >
                    X
                  </h1>
                </div>
                <h1 className="font-semibold text-3xl mt-5">Sign in to unlock the<br /> best of TripRecommender.</h1>

                <div className="mt-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full p-3 rounded-full border mt-2"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full p-3 rounded-full border mt-2"
                  />
                  <button
                    onClick={handleSignin}
                    className="w-full mt-4 bg-black text-white rounded-full py-3"
                  >
                    Sign In
                  </button>
                </div>

                <h1 className="text-center mt-36">
                  By proceeding, you agree to our Terms of Use and confirm you have read our Privacy and Cookie Statement.
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
