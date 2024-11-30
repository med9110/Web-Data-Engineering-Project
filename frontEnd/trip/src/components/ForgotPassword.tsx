import React, { useState } from "react";

type ForgotPasswordProps = {
  setIsForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

const ForgotPassword = ({ setIsForgotPassword }: ForgotPasswordProps) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMessage("Email is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8080/user/resetpassword?email=" + email, {
        method: "POST",
      });

      if (response.ok) {
        alert("Password reset link has been sent to your email.");
        setIsForgotPassword(false);
      } else {
        setErrorMessage("Failed to send reset link. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3">
      <h2 className="text-center text-xl">Reset Your Password</h2>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 rounded-full border mt-2"
      />
      <button
        onClick={handleResetPassword}
        disabled={isSubmitting}
        className="w-full mt-4 bg-black text-white rounded-full py-3"
      >
        {isSubmitting ? "Sending..." : "Send Reset Link"}
      </button>
      <div className="mt-3 text-center">
        <button
          onClick={() => setIsForgotPassword(false)}
          className="text-blue-500 hover:underline"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
