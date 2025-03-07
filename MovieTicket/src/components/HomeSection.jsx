import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import banner2 from '../assets/images/banner2.webp';
import banner3 from '../assets/images/banner3.webp';
import banner4 from '../assets/images/banner4.webp';


const HomeSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    {
      id: 1,
      image: banner2,
      title: 'The Latest Blockbusters',
      subtitle: 'Experience movies like never before'
    },
    {
      id: 2,
      image: banner3,
      title: 'Award-Winning Films',
      subtitle: 'Critically acclaimed cinema at your fingertips'
    },
    {
      id: 3,
      image: banner4,
      title: 'Coming Soon',
      subtitle: 'Get ready for the most anticipated releases'
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[50vh] md:h-[70vh] mt-16 overflow-hidden bg-black">
      {/* Carousel */}
      <div className="relative h-full w-full">
        {banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Image with gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 z-10"></div>
            <img 
              src={banner.image} 
              alt={`Banner ${banner.id}`} 
              className="object-cover w-full h-full" 
            />
            
            {/* Text content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 z-20 text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-2 transform translate-y-8 opacity-0 animate-slideUp">
                {banner.title}
              </h1>
              <p className="text-xl md:text-2xl max-w-lg transform translate-y-8 opacity-0 animate-slideUp animation-delay-300">
                {banner.subtitle}
              </p>
              <button className="mt-6 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold transition-colors duration-300 transform translate-y-8 opacity-0 animate-slideUp animation-delay-600">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <button 
        onClick={prevSlide} 
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-30 transition-colors duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide} 
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-30 transition-colors duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Indicator dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-red-600 w-8' : 'bg-white/70 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeSection;