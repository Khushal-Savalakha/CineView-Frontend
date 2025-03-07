import React from 'react';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">CineViews</h3>
            <p className="mb-4 text-gray-400 leading-relaxed">
              Experience cinema like never before. The ultimate destination for movie lovers with the latest releases, exclusive content, and premium viewing experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-600 transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-300 block">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-300 block">Movies</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-300 block">Events</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-300 block">Gift Cards</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-300 block">Careers</a>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-300 block">FAQs</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-300 block">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-300 block">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-300 block">Contact Support</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-red-500 flex-shrink-0 mt-1" />
                <span className="text-gray-400">123 Cinema Street, Movie City, MC 54321</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-red-500 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-red-500 flex-shrink-0" />
                <span className="text-gray-400">contact@cineviews.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white text-lg font-bold mb-2">Subscribe to our Newsletter</h4>
              <p className="text-gray-400">Get updates on new releases and exclusive offers</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-red-500 text-gray-900 w-full md:w-64"
              />
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-r-lg font-medium transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-black py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} CineViews. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;