import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Film } from 'lucide-react';
import list from './movielist.json';
import Card from './Card';

const MoviesCard = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300); // Slight delay for better animation effect

    return () => clearTimeout(timeout);
  }, []);

  const handleMovieClick = (movie, booking = false) => {
    navigate('/movie-detail', { state: { movie, booking } });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Limit the number of movies displayed to 6
  const nowShowingMovies = list.slice(0, 3);
  const upcomingMovies = list.slice(3, 6);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Now Showing Section */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Film size={24} className="text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900">Now Showing</h2>
          </div>
          <button className="flex items-center text-red-600 hover:text-red-700 transition-colors duration-300">
            <span className="mr-1">View All</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {isVisible && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {nowShowingMovies.map((movie, index) => (
              <motion.div
                key={movie.name}
                variants={item}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleMovieClick(movie, true)}
                className="cursor-pointer"
              >
                <Card
                  title={movie.name}
                  director={movie.director}
                  actor={movie.actor}
                  img={movie.image}
                  rating={4 + (index * 0.2)} // Randomly varied ratings
                  releaseYear="2023"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Upcoming Movies Section */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Film size={24} className="text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900">Coming Soon</h2>
          </div>
          <button className="flex items-center text-red-600 hover:text-red-700 transition-colors duration-300">
            <span className="mr-1">View All</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {isVisible && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
          >
            {upcomingMovies.map((movie, index) => (
              <motion.div
                key={movie.name}
                variants={item}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleMovieClick(movie)}
                className="cursor-pointer"
              >
                <Card
                  title={movie.name}
                  director={movie.director}
                  actor={movie.actor}
                  img={movie.image}
                  rating={4 + (index * 0.2)} // Randomly varied ratings
                  releaseYear="2024"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MoviesCard;