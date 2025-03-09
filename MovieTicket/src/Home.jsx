// Home.jsx
import React from 'react';
import Navbar from './components/Navbar';
import HomeSection from './components/HomeSection';
import MoviesCard from './components/MoviesCard';
import Footer from './components/Footer';
import SEO from './components/SEO';

const Home = () => {
  return (
    <>
      <SEO 
        title="Book Movie Tickets Online"
        description="Book your favorite movie tickets online. Watch latest movies in theaters near you."
        keywords="movie tickets, cinema, movies, entertainment, booking"
      />
      <Navbar />
      <HomeSection />
      <MoviesCard />
      <Footer />
    </>
  );
};

export default Home;
