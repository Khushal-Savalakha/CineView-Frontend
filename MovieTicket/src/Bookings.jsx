import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "./Booking.css";
import SEO from './components/SEO';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : null;
  const { movieName } = location.state || {};

  // Redirect to home if the user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // If movieName is not provided, show an error message or redirect
  if (!movieName) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="bg-red-500 bg-opacity-20 p-6 rounded-lg border border-red-500">
          <h3 className="text-xl font-semibold text-red-400">Error</h3>
          <p>No movie selected. Please return to the movies page and try again.</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-all"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  const [slots, setSlots] = useState(Array.from({ length: 24 }, (_, i) => i + 1));
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [seatStatus, setSeatStatus] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const ticketPrice = 250;

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/seats/get-csrf-token/`);
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.log("Error fetching CSRF token:", error);
    }
  };

  const fetchSeatStatus = async () => {
    if (movieName && selectedDate && selectedTimeSlot) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_URL}/seats/seatsdata/`, {
          movie_name: movieName,
          date: selectedDate.toISOString().split("T")[0],
          time_slot: selectedTimeSlot,
        });

        if (response.status === 200) {
          const seatStatusArray = response.data.seat_status.split(",").map(Number);
          setSeatStatus(seatStatusArray);
        }
      } catch (error) {
        console.error("Error fetching seat status:", error);
      }
    }
  };

  const handleSlotClick = (slot) => {
    if (!selectedTimeSlot) {
      alert("Please select a time slot first.");
      return;
    }

    const isBooked = seatStatus[slot - 1] === 0;
    if (isBooked) return;

    setSelectedSlots((prevSlots) =>
      prevSlots.includes(slot)
        ? prevSlots.filter((s) => s !== slot)
        : [...prevSlots, slot]
    );
  };

  const generateDates = () => {
    const today = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      return currentDate;
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedSlots([]);
    setSelectedTimeSlot("");
    setSeatStatus([]);
  };

  const handleTimeSlotChange = (e) => {
    setSelectedTimeSlot(e.target.value);
    setSelectedSlots([]);
  };

  useEffect(() => {
    if (movieName && selectedDate && selectedTimeSlot) {
      fetchSeatStatus();
    }
  }, [movieName, selectedDate, selectedTimeSlot]);

  const selectedDateStr = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
  const totalPrice = selectedSlots.length * ticketPrice;

  const makePayment = async () => {
    if (selectedSlots.length === 0 || !selectedTimeSlot) {
      alert("Please select at least one seat and a time slot.");
      return;
    }
    
    const stripe = await loadStripe("pk_test_51Q37moFDgyVohtssMBKZtx7aXn0a7YdVV0EcXLRd0XL4sAgxHdFdwF9hA9yriHwaYYqgMw2VHHReiWQoImoSvKjc00ZHGK6KlD");

    const body = {
      email: user.email,
      movie_name: movieName,
      date: selectedDate.toISOString().split("T")[0],
      time_slot: selectedTimeSlot,
      seat_number: selectedSlots.join(","),
      amount: totalPrice * 100, // Stripe uses amount in cents
      seat_status: seatStatus,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_STRIPE_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <>
      <SEO 
        title={`Book Tickets - ${movieName}`}
        description={`Book movie tickets for ${movieName}. Select your seats and showtime.`}
        keywords={`${movieName}, movie tickets, booking, cinema tickets`}
      />
      <div className="min-h-screen bg-gray-900 text-white pt-20 pb-12">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header with movie name */}
            <div className="bg-gradient-to-r from-red-900 to-red-700 p-6">
              <h1 className="text-3xl font-bold">{movieName}</h1>
              <p className="text-gray-200 mt-1">Select your seats and showtime</p>
            </div>
            
            {/* Date Selector */}
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Select Date</h2>
              <div className="date-selector flex space-x-3 pb-2">
                {generateDates().map((date, index) => {
                  const isToday = index === 0;
                  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                  const dayNum = date.getDate();
                  const month = date.toLocaleDateString("en-US", { month: "short" });
                  
                  return (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-20 p-3 rounded-xl cursor-pointer transition-all ${
                        date.toDateString() === selectedDate.toDateString()
                          ? "bg-red-600 text-white"
                          : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      }`}
                      onClick={() => handleDateClick(date)}
                    >
                      <div className="text-center">
                        <div className="text-xs font-medium mb-1">
                          {isToday ? "TODAY" : dayName.toUpperCase()}
                        </div>
                        <div className="text-xl font-bold">{dayNum}</div>
                        <div className="text-xs mt-1">{month}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selector */}
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Select Show Time</h2>
              <div className="flex space-x-4">
                <div 
                  className={`px-6 py-3 rounded-lg cursor-pointer ${
                    selectedTimeSlot === "10:00AM-12:00PM" 
                      ? "bg-red-600 text-white" 
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                  onClick={() => setSelectedTimeSlot("10:00AM-12:00PM")}
                >
                  <div className="text-center">
                    <span className="font-medium">10:00 AM</span>
                    <div className="text-xs mt-1">Morning Show</div>
                  </div>
                </div>
                
                <div 
                  className={`px-6 py-3 rounded-lg cursor-pointer ${
                    selectedTimeSlot === "6:00PM-8:30PM" 
                      ? "bg-red-600 text-white" 
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                  onClick={() => setSelectedTimeSlot("6:00PM-8:30PM")}
                >
                  <div className="text-center">
                    <span className="font-medium">6:00 PM</span>
                    <div className="text-xs mt-1">Evening Show</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seating Chart Section */}
            {selectedTimeSlot && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Select Your Seats</h2>
                
                {/* Screen */}
                <div className="relative mb-10">
                  <div className="w-full h-2 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 rounded-full"></div>
                  <div className="w-1/2 mx-auto h-8 mt-2 bg-gray-700 rounded-t-3xl transform perspective-500 rotateX-60"></div>
                  <p className="text-center text-gray-400 text-sm mt-1">SCREEN</p>
                </div>
                
                {/* Seats Grid */}
                <div className="grid grid-cols-6 gap-3 max-w-md mx-auto mb-8">
                  {slots.map((slot, index) => {
                    const isBooked = seatStatus[index] === 0;
                    return (
                      <div
                        key={index}
                        className={`w-12 h-10 flex items-center justify-center rounded-t-lg cursor-pointer transition-all relative ${
                          isBooked
                            ? "bg-red-700 cursor-not-allowed opacity-50"
                            : selectedSlots.includes(slot)
                            ? "bg-green-600 text-white"
                            : "bg-gray-600 hover:bg-gray-500 text-white"
                        }`}
                        onClick={() => handleSlotClick(slot)}
                      >
                        <span className="font-medium">{slot}</span>
                        {/* Seat bottom */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-lg ${
                          isBooked ? "bg-gray-800" : 
                          selectedSlots.includes(slot) ? "bg-green-800" : "bg-gray-700"
                        }`}></div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Seat Legend */}
                <div className="flex justify-center space-x-6 mb-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-600 mr-2 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-600 mr-2 rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-700 opacity-50 mr-2 rounded"></div>
                    <span>Booked</span>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Summary */}
            <div className="p-6 bg-gray-900">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-bold mb-2">Booking Summary</h2>
                  <div className="space-y-1 text-gray-300">
                    <p><span className="text-gray-400">Movie:</span> {movieName}</p>
                    <p><span className="text-gray-400">Date:</span> {selectedDateStr}</p>
                    <p><span className="text-gray-400">Time:</span> {selectedTimeSlot || "Not selected"}</p>
                    <p><span className="text-gray-400">Seats:</span> {selectedSlots.length > 0 ? selectedSlots.join(", ") : "None selected"}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold mb-4">₹{totalPrice}</div>
                  <button
                    onClick={makePayment}
                    disabled={selectedSlots.length === 0 || !selectedTimeSlot}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      selectedSlots.length === 0 || !selectedTimeSlot
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {selectedSlots.length === 0 ? "Select Seats" : "Pay & Book"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;