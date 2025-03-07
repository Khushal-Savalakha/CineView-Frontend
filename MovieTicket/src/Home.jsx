// Home.jsx
import React from 'react';
import Navbar from './components/Navbar';
import HomeSection from './components/HomeSection';
import MoviesCard from './components/MoviesCard';
import Footer from './components/Footer';

const Home = () => {
  return (
    <>
      <Navbar />
      <HomeSection />
      <MoviesCard />
      <Footer />
    </>
  );
};

export default Home;
