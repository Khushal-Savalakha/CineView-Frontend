import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

const Account = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      if (user && user.email) {
        setIsAuthenticated(true);
        setUserName(user.name || 'User');
      } else {
        setIsAuthenticated(false);
      }
    }
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center space-x-2 text-lg font-semibold hover:text-gray-200 transition duration-300 bg-transparent border-none focus:outline-none"
      >
        <User size={20} className="text-white" />
        <span className="hidden md:inline text-white">
          {'Account'}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-md shadow-lg z-10 transition-opacity duration-300 opacity-100 min-w-40">
          {isAuthenticated ? (
            // Show only logout when authenticated
            <Link
              to="/logout"
              onClick={closeDropdown}
              className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
            >
              Logout
            </Link>
          ) : (
            // Show signup and login when not authenticated
            <>
              <Link
                to="/signup"
                onClick={closeDropdown}
                className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
              >
                Signup
              </Link>
              <Link
                to="/login"
                onClick={closeDropdown}
                className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Account;