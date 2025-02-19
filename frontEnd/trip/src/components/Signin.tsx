import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import ForgotPassword from "./ForgotPassword";

type signinProp = {
  setSigninPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const Signin = (props: signinProp) => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate(); // useNavigate hook for redirection

  type DecodedToken = {
    claims: {
      id: string;
    };
  };

  const handleSignin = async () => {
    if (!emailInput || !passwordInput) {
      setErrorMessage("Email and password are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8080/auth/login/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: emailInput,
          password: passwordInput,
        }),
      });

      if (!response.ok) {
        setErrorMessage("Invalid email or password. Please try again.");
        return;
      }

      const data = await response.json();
      const token = data["access token"];
      if (token) {
        localStorage.setItem("authToken", token);

        const decoded: DecodedToken = jwtDecode(token);
        console.log("Decoded Token:", decoded);

        props.setIsAuthenticated(true);
        const tokenInfo = localStorage.getItem("jwtToken");
        setLoading(true);
        const fetchUserInfo = async () => {
          try {
            const response = await fetch("http://127.0.0.1:8080/user/info", {
              headers: {
                Authorization: `Bearer ${tokenInfo}`,
              },
            });
            if (!response.ok) {
              throw new Error("Failed to fetch user information");
            }
            const data = await response.json();
            setUserRole(data.role);
          } catch (error) {
            console.error("Error fetching user information:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchUserInfo();
        props.setSigninPopup(false);

        // Redirect based on role
        if (userRole === "OWNER") {
          navigate("/reservations");
        }
      } else {
        setErrorMessage("Token not found in response.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
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
                  <img src={logo} className="w-10 h-10 bg-green-400 rounded-full" alt="Logo" />
                  <h1
                    onClick={() => props?.setSigninPopup(false)}
                    className="font-extrabold ml-auto cursor-pointer"
                  >
                    X
                  </h1>
                </div>
                <h1 className="font-semibold text-3xl mt-5">
                  Sign in to unlock the
                  <br /> best of TripRecommender.
                </h1>
                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

                {!isForgotPassword ? (
                  <>
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
                        disabled={isSubmitting}
                        className="w-full mt-4 bg-black text-white rounded-full py-3"
                      >
                        {isSubmitting ? "Signing In..." : "Sign In"}
                      </button>
                    </div>

                    <div className="text-center mt-3">
                      <button
                        onClick={() => setIsForgotPassword(true)}
                        className="text-blue-500 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </>
                ) : (
                  <ForgotPassword setIsForgotPassword={setIsForgotPassword} />
                )}

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
