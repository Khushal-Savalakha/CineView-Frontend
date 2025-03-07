import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Clock, Home } from 'lucide-react';
import Account from '../Account'; // Import the Account component

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/searched?query=${searchTerm}`);
      setIsSearchOpen(false);
    }
  };

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
          <Account /> {/* Use the Account component here */}
          <Link to="/bookingHistory" className="flex items-center space-x-1 text-white hover:text-red-400 transition-colors duration-300">
            <Clock size={18} />
            <span>Bookings</span>
          </Link>
        </div>

        {/* Search Bar */}
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
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-red-400 transition-colors duration-300 p-2"
              aria-label="Open search"
            >
              <Search size={24} />
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <Link to="/" className="text-white p-2" aria-label="Home">
            <Home size={24} />
          </Link>
          <Account /> {/* Use the Account component here too */}
          <Link to="/bookingHistory" className="text-white p-2" aria-label="Bookings">
            <Clock size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;