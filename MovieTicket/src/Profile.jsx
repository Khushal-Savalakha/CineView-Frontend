import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import SEO from './components/SEO';

const Profile = () => {
  const location = useLocation();
  const { name, email } = location.state || {};

  const userBio = "Passionate traveler and foodie. Love to explore new places and try new cuisines.";
  const userAddress = "1234 Elm Street, Springfield, IL, 62704";
  const userPhone = "+1 (555) 123-4567";
  const userHobbies = ["Traveling", "Cooking", "Reading", "Photography"];
  const userFavoriteMovies = ["Inception", "The Dark Knight", "Interstellar", "The Matrix"];

  return (
    <>
      <SEO 
        title="My Profile"
        description="Manage your CineView profile, view booking history and preferences"
        keywords="profile, account, movie preferences, booking history"
      />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="w-full max-w-2xl p-8 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-white">Profile</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <img 
                src="" 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-gray-600 shadow-md"
              />
            </div>

            <div className="text-center mt-4">
              <h3 className="text-2xl font-semibold">{name || "Your Name"}</h3>
              <p className="text-gray-400">{email || "your.email@example.com"}</p>
            </div>

            <div className="mt-6">
              <h4 className="text-xl font-semibold">Bio</h4>
              <p className="text-gray-300">{userBio}</p>
            </div>

            <div className="mt-6">
              <h4 className="text-xl font-semibold">Contact Information</h4>
              <p className="text-gray-300"><strong>Address:</strong> {userAddress}</p>
              <p className="text-gray-300"><strong>Phone:</strong> {userPhone}</p>
            </div>

            <div className="mt-6">
              <h4 className="text-xl font-semibold">Hobbies</h4>
              <ul className="text-gray-300 list-disc list-inside">
                {userHobbies.map((hobby, index) => (
                  <li key={index}>{hobby}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="text-xl font-semibold">Favorite Movies</h4>
              <ul className="text-gray-300 list-disc list-inside">
                {userFavoriteMovies.map((movie, index) => (
                  <li key={index}>{movie}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-indigo-500 hover:text-indigo-400 font-semibold"
              >
                &larr; Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
