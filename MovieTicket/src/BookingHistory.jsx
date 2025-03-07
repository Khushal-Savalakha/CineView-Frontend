import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import movieList from './components/movielist.json'; // Import movie data
import { jsPDF } from 'jspdf'; // For PDF generation
// Remove the jspdf-autotable import since it's not installed

const BookingHistory = () => {
  const navigate = useNavigate();
  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : null;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noPurchases, setNoPurchases] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.email) {
      fetchBookings();
    } else {
      setError('User not logged in.');
      setLoading(false);
    }
  }, [user?.email]); // Added dependency to useEffect

  const fetchBookings = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/booking/search/`, {
        email: user.email
      });
      if (response.data.length === 0) {
        setNoPurchases(true);
      } else {
        const sortedBookings = response.data.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        setBookings(sortedBookings);
        setNoPurchases(false);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error); // Changed to console.error
      setError('Failed to retrieve booking history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    let filtered = [...bookings];
    
    if (searchQuery) {
      filtered = filtered.filter(booking => 
        booking.movie_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeTab === 'upcoming') {
      filtered = filtered.filter(booking => new Date(booking.date) >= new Date());
    } else if (activeTab === 'past') {
      filtered = filtered.filter(booking => new Date(booking.date) < new Date());
    }
    
    return filtered;
  };

  const filteredBookings = getFilteredBookings();
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const generateTicketPDF = (booking) => {
    const movie = movieList.find(m => m.name === booking.movie_name);
    const user = JSON.parse(localStorage.getItem("userData"));

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`E-Ticket: ${booking.movie_name}`, 15, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${formatDate(booking.date)}`, 15, 30);
    doc.text(`Time: ${booking.time_slot}`, 15, 40);
    doc.text(`Seat: ${booking.seat_number}`, 15, 50);
    doc.text(`Amount: ₹${booking.amount}`, 15, 60);
    doc.text(`User: ${user?.name || 'Guest'}`, 15, 70);
    doc.text(`Email: ${user?.email || ''}`, 15, 80);

    if (movie?.image) {
      try {
        // Create an image element
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Add this to handle CORS issues
        img.src = movie.image;
        
        img.onload = () => {
          try {
            doc.addImage(img, 'JPEG', 140, 15, 50, 75);
          } catch (error) {
            console.error("Error adding image to PDF:", error);
          } finally {
            doc.save(`${booking.movie_name}-ticket.pdf`);
          }
        };
        
        // Add error handling for the image
        img.onerror = () => {
          console.error("Failed to load image for PDF");
          doc.save(`${booking.movie_name}-ticket.pdf`);
        };
        
        // Set a timeout in case the image takes too long to load
        setTimeout(() => {
          if (!img.complete) {
            console.warn("Image load timeout, saving PDF without image");
            doc.save(`${booking.movie_name}-ticket.pdf`);
          }
        }, 3000);
      } catch (error) {
        console.error("Error processing image:", error);
        doc.save(`${booking.movie_name}-ticket.pdf`);
      }
    } else {
      doc.save(`${booking.movie_name}-ticket.pdf`);
    }
  };

  // Function to handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    if (!bookingId) {
      alert("Booking ID is missing. Cannot cancel booking.");
      return;
    }
    
    if (window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      try {
        setLoading(true);
        await axios.post(`${import.meta.env.VITE_URL}/booking/cancel/`, {
          bookingId: bookingId,
          email: user.email
        });
        
        // Refresh bookings after cancellation
        await fetchBookings();
        alert("Booking cancelled successfully!");
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to handle movie rating
  const handleRateMovie = (bookingId, movieName) => {
    // Store the booking info in localStorage to use in rating page
    localStorage.setItem("ratingInfo", JSON.stringify({
      bookingId,
      movieName
    }));
    
    // Navigate to rating page
    navigate('/rate-movie');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center text-white">
        <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-xl border border-gray-700 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-xl font-medium">Loading your booking history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center text-white">
        <div className="bg-gray-800/80 backdrop-blur-md p-10 rounded-xl shadow-xl border border-gray-700 max-w-md">
          <div className="text-red-500 text-5xl mb-6 flex justify-center">⚠️</div>
          <h2 className="text-2xl font-bold mb-4 text-center">Authentication Required</h2>
          <p className="text-gray-300 mb-8 text-center">{error}</p>
          <div className="flex justify-center">
            <button 
              onClick={() => navigate('/login')} 
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg transition duration-300 font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12">
      <div className="container mx-auto px-4 max-w-5xl mt-[5vh]">
        <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Booking History</h1>
                <p className="text-gray-400 mt-1">View and manage your movie ticket purchases</p>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 px-4 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 absolute right-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-6 border-b border-gray-700 overflow-x-auto pb-1.5">
              <button
                className={`px-5 py-2 font-medium rounded-lg transition-all relative ${activeTab === 'all' ? 'text-white bg-gray-700' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                onClick={() => setActiveTab('all')}
              >
                All Bookings
              </button>
              <button
                className={`px-5 py-2 font-medium rounded-lg transition-all relative ${activeTab === 'upcoming' ? 'text-white bg-gray-700' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={`px-5 py-2 font-medium rounded-lg transition-all relative ${activeTab === 'past' ? 'text-white bg-gray-700' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                onClick={() => setActiveTab('past')}
              >
                Past Bookings
              </button>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            {noPurchases || filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery ? 'No bookings match your search criteria.' : 
                   activeTab !== 'all' ? `You don't have any ${activeTab} bookings.` : 
                   'You haven\'t made any bookings yet.'}
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg transition-all shadow-lg font-medium"
                >
                  Browse Movies
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredBookings.map((booking, index) => {
                  const isPast = new Date(booking.date) < new Date();
                  const movie = movieList.find(m => m.name === booking.movie_name) || {};

                  return (
                    <div 
                      key={index} 
                      className={`p-5 rounded-xl shadow-lg transition-all duration-300 ${isPast ? 'bg-gray-700/50 border border-gray-700' : 'bg-gradient-to-r from-gray-700/60 to-gray-700/80 border border-gray-600 hover:border-red-500/30'}`}
                    >
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="w-full md:w-3/4">
                          <div className="flex items-start gap-2 mb-3">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${isPast ? 'bg-gray-600 text-gray-300' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                              {isPast ? 'Past' : 'Upcoming'}
                            </span>
                            <h3 className="text-xl font-semibold">{booking.movie_name}</h3>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 mb-4">
                            <div>
                              <p className="text-gray-400 text-sm mb-1">Date</p>
                              <p className="font-medium">{formatDate(booking.date)}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm mb-1">Show Time</p>
                              <p className="font-medium">{booking.time_slot}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm mb-1">Seat</p>
                              <p className="font-medium">{booking.seat_number}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-600/50 flex justify-between items-center">
                            <div>
                              <p className="text-gray-400 text-sm">Amount Paid</p>
                              <p className="text-xl font-semibold">₹{booking.amount}</p>
                            </div>
                            
                            {!isPast && (
                              <div className="flex gap-3">
                                <button 
                                  onClick={() => generateTicketPDF(booking)}
                                  className="px-4 py-2 border border-gray-600 hover:border-white rounded-lg text-sm font-medium transition-colors duration-300"
                                >
                                  Download Ticket
                                </button>
                                <button 
                                  onClick={() => handleCancelBooking(booking._id)}
                                  className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition-colors duration-300"
                                >
                                  Cancel Booking
                                </button>
                              </div>
                            )}
                            
                            {isPast && (
                              <div>
                                <button 
                                  onClick={() => handleRateMovie(booking._id, booking.movie_name)}
                                  className="px-4 py-2 bg-transparent border border-gray-600 hover:border-white rounded-lg text-sm font-medium transition-colors duration-300 flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                  Rate Movie
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="w-full md:w-1/4 flex md:justify-center">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-amber-600/10 rounded-lg blur-md"></div>
                            <div className={`aspect-[2/3] w-32 rounded-lg overflow-hidden border-2 ${isPast ? 'border-gray-700' : 'border-red-600/30'} relative z-10`}>
                              <img 
                                src={movie?.image || '/images/poster-fallback.jpg'} 
                                alt={booking.movie_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null; 
                                  e.target.src = '/images/poster-fallback.jpg';
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {filteredBookings.length > 0 && (
            <div className="px-6 md:px-8 pb-8">
              <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Total Bookings</span>
                  <span className="font-medium">{filteredBookings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Amount Spent</span>
                  <span className="font-medium">₹{filteredBookings.reduce((sum, booking) => sum + parseInt(booking.amount || 0), 0)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;