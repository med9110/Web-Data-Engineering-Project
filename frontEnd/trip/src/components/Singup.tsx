import { useState } from "react";
import logo from "../assets/logo.png";
import { validateEmail } from "../utils/validators";

type signupProp = {
  setSignupPopup: any;
};

const SignUp = (props: signupProp) => {
  // State for form input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferenceInput, setPreferenceInput] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);

  // Handle adding a preference
  const handleAddPreference = () => {
    if (preferenceInput.trim() !== "") {
      setPreferences([...preferences, preferenceInput.trim()]);
      setPreferenceInput("");
    }
  };

  // Handle removing a preference
  const handleRemovePreference = (index: number) => {
    setPreferences(preferences.filter((_, i) => i !== index));
  };

  // Handle sign-up submission
  const handleSignup = async () => {
    // Example validation (you can enhance this later)
    if (!name || !email || !age || !password || !confirmPassword) {
      console.error("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    if (!validateEmail(email)) {
      console.error("Invalid email address");
      return;
    }

    // Prepare the data to be sent to the backend
    const userData = {
      name,
      email,
      age,
      password,
      preferences,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error response:", response.status, errorMessage);
        alert(`Error: ${response.status} - ${errorMessage}`);
        return;
      }

      const result = await response.json();
      console.log("User signed up successfully:", result);

      // Close the popup after successful sign-up
      props.setSignupPopup(false);
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred while signing up.");
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
                  <h1 onClick={() => props?.setSignupPopup(false)} className="font-extrabold ml-96 cursor-pointer">X</h1>
                </div>
                <h1 className="font-semibold text-3xl mt-5">Create your account to get started with TripRecommender.</h1>
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-full border mt-2"
                  />
                </div>
                <div className="mt-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-full border mt-2"
                  />
                </div>
                <div className="mt-3">
                  <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-3 rounded-full border mt-2"
                  />
                </div>
                <div className="mt-3">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-full border mt-2"
                  />
                </div>
                <div className="mt-3">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 rounded-full border mt-2"
                  />
                </div>
                <div className="mt-3 flex">
                  <input
                    type="text"
                    placeholder="Add Preference"
                    value={preferenceInput}
                    onChange={(e) => setPreferenceInput(e.target.value)}
                    className="flex-1 p-3 rounded-full border mt-2"
                  />
                  <button
                    type="button"
                    onClick={handleAddPreference}
                    className="ml-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition ease-in-out duration-300 mt-2"
                  >
                    Add Preference
                  </button>
                </div>
                <div className="mt-3">
                  {preferences.map((preference, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md mt-2">
                      <span>{preference}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePreference(index)}
                        className="text-red-500 hover:text-red-700 transition ease-in-out duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSignup}
                  className="w-full mt-4 bg-black text-white rounded-full py-3"
                >
                  Sign Up
                </button>
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

export default SignUp;