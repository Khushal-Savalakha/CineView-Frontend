import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Clock, Home, User } from 'lucide-react';
// import Account from '../Account'; // Import the Account component

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/searched?query=${searchTerm}`);
      setIsSearchOpen(false);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const closeProfileDropdown = () => {
    setIsProfileOpen(false);
  };

  // User Profile Dropdown Component
  const UserProfileDropdown = () => (
    <div className="relative">
      <button
        onClick={toggleProfileDropdown}
        className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-700 border border-gray-600 hover:bg-gray-600 transition-colors duration-300"
        aria-label="Profile"
      >
        <User size={16} className="text-gray-300" />
      </button>
      
      {isProfileOpen && (
        <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-md shadow-lg z-10 transition-opacity duration-300 opacity-100 min-w-40">
          {isAuthenticated ? (
            <>
              <div className="block px-4 py-2 border-b border-gray-200 font-medium">
                {userName}
              </div>
              <Link
                to="/logout"
                onClick={closeProfileDropdown}
                className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                onClick={closeProfileDropdown}
                className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
              >
                Signup
              </Link>
              <Link
                to="/login"
                onClick={closeProfileDropdown}
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

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/images/logo_2.png"
            alt="CineViews"
            className="h-10 w-auto rounded-lg"
          />
          <span className="text-xl font-bold text-white hidden md:block">CineViews</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-1 text-white hover:text-red-400 transition-colors duration-300">
            <Home size={18} />
            <span>Home</span>
          </Link>
          {/* <Account /> Use the Account component here */}
          <Link to="/bookingHistory" className="flex items-center space-x-1 text-white hover:text-red-400 transition-colors duration-300">
            <Clock size={18} />
            <span>Bookings</span>
          </Link>
        </div>

        {/* Search Bar and User Profile */}
        <div className="flex items-center">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Search movies..."
                className="px-4 py-2 rounded-l-lg border-0 focus:ring-2 focus:ring-red-500 text-gray-900 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-r-lg transition duration-300"
              >
                <Search size={20} />
              </button>
            </form>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-red-400 transition-colors duration-300 p-2"
                aria-label="Open search"
              >
                <Search size={24} />
              </button>
              
              {/* User Profile with Dropdown - Only shown on desktop */}
              <div className="hidden md:block">
                <UserProfileDropdown />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-4">
          <Link to="/" className="text-white p-2" aria-label="Home">
            <Home size={24} />
          </Link>
          {/* <Account /> Use the Account component here too */}
          <Link to="/bookingHistory" className="text-white p-2" aria-label="Bookings">
            <Clock size={24} />
          </Link>
          
          {/* User Profile for Mobile - Only shown on mobile */}
          <UserProfileDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;