import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png"; 
const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation

  const getQueryParams = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('token');
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    const token = getQueryParams();

    try {
      const response = await fetch('http://localhost:8080/user/passwordupdate?token=' + token, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }) // Sending the new password inside the body
      });

      if (response.ok) {
        setSuccessMessage('Your password has been updated successfully.');
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update password.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToHome = () => {
    // Navigate to the home page (no popup state)
    navigate('/');
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
                  <h1 className="font-extrabold ml-auto cursor-pointer">X</h1>
                </div>
                <h1 className="font-semibold text-3xl mt-5">Update Your Password</h1>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}

                {/* Password Update Form */}
                <div className="mt-3">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 rounded-full border mt-2"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 rounded-full border mt-2"
                  />
                  <button
                    onClick={handlePasswordReset}
                    disabled={isSubmitting}
                    className="w-full mt-4 bg-black text-white rounded-full py-3"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
                <div className="text-center mt-3">
                  <button
                    onClick={goToHome} // Trigger navigation to home directly
                    className="text-blue-500 hover:underline"
                  >
                    Back to Home
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

export default UpdatePassword;
