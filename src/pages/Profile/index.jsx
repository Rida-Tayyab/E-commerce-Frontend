import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import accountIcon from "../../assets/account.svg"; // Ensure you have an account icon

export default function Profile() {
  const [user, setUser] = useState({
    name: "Laiba Durrani", // Example user info
    email: "laiba@example.com",
    phone: "+92 300 1234567",
    image: "https://via.placeholder.com/150", // Placeholder image URL
  });

  const [error, setError] = useState(null);

  // Initialize useNavigate hook
  const navigate = useNavigate();

  // Function to handle back button click
  const handleBackClick = () => {
    navigate("/dashboard"); // Navigate to the dashboard page
  };

  // Fetch user profile data from backend (use hardcoded fallback for now)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Uncomment the below line and add the actual API endpoint when available
        // const response = await axios.get("https://api.example.com/user/profile");
        // setUser(response.data);

        // Simulated delay for testing purposes
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        console.error(err);
        setError("Failed to load profile details. Using default data.");
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="profile-container p-6 bg-gradient-to-b from-[#77B0AA] via-[#135D66] to-[#174146] text-white">
      {/* Profile Header Section */}
      <section className="profile-header flex items-center justify-between mb-6">
        <button
          className="back-button text-white text-lg font-bold flex items-center space-x-2"
          onClick={handleBackClick} // Call handleBackClick on click
        >
          <span className="text-2xl">←</span> <span>Back</span>
        </button>
        <div className="profile-icon">
          <img src={accountIcon} alt="Account" className="h-10 w-10" />
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}

      {/* Personal Information and Profile Image Section */}
      <section className="personal-info-and-image bg-white p-6 rounded-lg shadow-xl mb-6 flex items-center space-x-6">
        {/* Profile Image */}
        <div className="profile-image">
          <img
            src={user.image}
            alt="Profile"
            className="rounded-full h-32 w-32 object-cover shadow-md"
          />
        </div>

        {/* Personal Information */}
        <div className="profile-details">
          <h2 className="text-2xl font-bold text-[#003C43] mb-2">{user.name}</h2>
          <p className="text-sm text-gray-600 mb-1">{user.email}</p>
          <p className="text-sm text-gray-600">{user.phone}</p>
        </div>
      </section>

      {/* Account Settings Section */}
      <section className="account-settings bg-white p-6 rounded-lg shadow-xl mb-6">
        <h2 className="section-title text-xl font-bold text-[#003C43] mb-4">
          Account Settings
        </h2>
        {/* Placeholder for account settings (e.g., change password, notifications, etc.) */}
        <button className="text-sm text-[#135D66] hover:text-[#003C43] transition-all duration-300">
          Change Password
        </button>
      </section>
    </div>
  );
}
