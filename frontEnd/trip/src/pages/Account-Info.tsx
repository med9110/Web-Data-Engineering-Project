import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const AccountInfo = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/user/info", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/update-user-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(userInfo),
      });
      if (!response.ok) {
        throw new Error("Failed to update user info");
      }
      alert("User info updated successfully");
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("An error occurred while updating user info");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar setIsAuthenticated={() => {}} isAuthenticated={true} />

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Update Your Account Information</h1>
          <p className="text-lg text-gray-600">Keep your profile updated for better recommendations and experiences.</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-lg font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={userInfo.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full p-4 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-lg font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={userInfo.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full p-4 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="age" className="block text-lg font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={userInfo.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  className="w-full p-4 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-4 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-black text-white p-4 rounded-lg focus:outline-none hover:bg-gray-800 transition duration-300"
            >
              Update Info
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              By updating, you agree to our <a href="#" className="text-blue-500">Terms of Use</a> and <a href="#" className="text-blue-500">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;