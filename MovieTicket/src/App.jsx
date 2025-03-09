import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Searched from './components/Searched';
import React, { Suspense, lazy } from 'react';
import './animations.css'; 


// Lazy load components 
const Home = lazy(() => import('./Home'));
const Signup = lazy(() => import('./Signup'));
const Login = lazy(() => import('./Login'));
const LogOut = lazy(() => import('./Logout'));
const Bookings = lazy(() => import('./Bookings'));
const Profile = lazy(() => import('./Profile'));
const BookingHistory = lazy(() => import('./BookingHistory'));
const Account = lazy(() => import('./Account'));
const MovieDetail = lazy(() => import('./MovieDetail'));


// Loading component
const Loading = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Navbar />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<LogOut />} />
            <Route path="/booking" element={<Bookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/searched" element={<Searched/>} />
            <Route path="/account" element={<Account />} />
            <Route path="/movie-detail" element={<MovieDetail />} /> {/* No changes needed here */}
            <Route path="/Home" element={<Home />} />
            <Route path="/bookingHistory" element={<BookingHistory />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
