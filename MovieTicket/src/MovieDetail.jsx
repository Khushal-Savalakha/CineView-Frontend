import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SEO from './components/SEO';

const MovieDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie } = location.state || {};
  const [activeTab, setActiveTab] = useState("overview");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!movie) {
    return (
      <>
        <SEO 
          title="Movie Not Found"
          description="The requested movie could not be found."
        />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center text-white p-8">
          <div className="bg-gray-800/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl text-center max-w-md border border-gray-700">
            <div className="text-red-500 text-6xl mb-6">⚠️</div>
            <h2 className="text-3xl font-bold mb-5">Movie Not Found</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              We couldn't locate the movie details you're looking for. Please
              return to the movie selection page and try again.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl shadow-lg transition-all duration-300 font-semibold text-lg transform hover:scale-105"
            >
              Back to Movies
            </button>
          </div>
        </div>
      </>
    );
  }

  const handleWatchTrailer = () => {
    setShowTrailer(true);
    setActiveTab("overview");
    document
      .getElementById("trailer-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEO 
        title={movie.name}
        description={movie.description}
        keywords={`${movie.name}, ${movie.director}, movies, tickets, booking`}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative">
        {/* Floating Header on Scroll */}
        <div
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-black/80 backdrop-blur-md shadow-xl border-b border-gray-800">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={movie.image}
                  alt={movie.name}
                  className="w-10 h-14 object-cover rounded-md shadow-lg mr-4"
                />
                <h1 className="text-xl font-bold truncate">{movie.name}</h1>
              </div>
              <button
                className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg font-medium text-sm transition-all flex items-center shadow-lg"
                onClick={() =>
                  navigate("/booking", { state: { movieName: movie.name } })
                }
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section with Backdrop */}
        <div className="relative h-screen overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10"></div>
          <img
            src={movie.backgroundImage}
            alt={movie.name}
            className="w-full h-full object-cover object-center scale-110 filter blur-sm"
          />

          <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10"></div>

          <div className="container mx-auto px-4 relative z-20 h-full flex items-center">
            <div className="flex flex-col md:flex-row gap-8 items-start max-w-6xl backdrop-blur-sm bg-black/30 p-8 rounded-3xl border border-gray-800/30 shadow-2xl">
              <div className="relative group">
                <img
                  src={movie.image}
                  alt={movie.name}
                  className="w-64 md:w-80 object-cover rounded-2xl shadow-2xl border-2 border-gray-700 transform transition-all duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <button
                    className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center shadow-lg border border-white/20 hover:bg-white/20"
                    onClick={handleWatchTrailer}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Watch Trailer
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {movie.categories.split(", ").map((category, index) => (
                    <span
                      key={index}
                      className="text-xs font-medium bg-gray-700/50 backdrop-blur-sm px-3 py-1 rounded-full text-gray-300"
                    >
                      {category.trim()}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {movie.name}
                </h1>

                <div className="flex items-center mt-4 text-lg">
                  <div className="flex items-center bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                    <img
                      src={movie.ratingImage}
                      alt="Rating"
                      className="w-6 h-6 mr-2"
                    />
                    <span className="font-semibold text-amber-400">
                      {movie.rating}
                    </span>
                  </div>
                  <span className="mx-3 text-gray-400">•</span>
                  <span className="text-gray-300">Dir: {movie.director}</span>
                </div>

                <p className="mt-5 text-gray-300 leading-relaxed line-clamp-3 md:line-clamp-4">
                  {movie.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center shadow-xl transform hover:scale-105"
                    onClick={() =>
                      navigate("/booking", { state: { movieName: movie.name } })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Book Tickets
                  </button>

                  <button
                    className="bg-transparent hover:bg-white/10 text-white border-2 border-white/20 px-8 py-4 rounded-xl font-semibold transition-all flex items-center shadow-lg"
                    onClick={handleWatchTrailer}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              className="fill-current text-gray-900"
            >
              <path d="M0,256L48,234.7C96,213,192,171,288,165.3C384,160,480,192,576,202.7C672,213,768,203,864,186.7C960,171,1056,149,1152,149.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12 relative z-30 -mt-32">
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
            {/* Tabs */}
            <div className="flex border-b border-gray-700 overflow-x-auto scrollbar-hide">
              <button
                className={`px-8 py-5 font-medium text-center transition-all relative ${
                  activeTab === "overview"
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
                {activeTab === "overview" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-red-600"></span>
                )}
              </button>
              <button
                className={`px-8 py-5 font-medium text-center transition-all relative ${
                  activeTab === "cast"
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("cast")}
              >
                Cast & Crew
                {activeTab === "cast" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-red-600"></span>
                )}
              </button>
            </div>

            {/* Content based on active tab */}
            <div className="p-8">
              {activeTab === "overview" && (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <span className="inline-block w-8 h-0.5 bg-red-500 mr-3"></span>
                      Synopsis
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {movie.description}
                    </p>

                    <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-xl">
                        <h3 className="text-gray-400 text-sm mb-1">Director</h3>
                        <p className="font-medium text-lg">{movie.director}</p>
                      </div>
                      <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-xl">
                        <h3 className="text-gray-400 text-sm mb-1">Rating</h3>
                        <p className="font-medium text-lg flex items-center">
                          <img
                            src={movie.ratingImage}
                            alt="Rating"
                            className="w-5 h-5 mr-2"
                          />
                          {movie.rating}
                        </p>
                      </div>
                      <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-xl">
                        <h3 className="text-gray-400 text-sm mb-1">Genre</h3>
                        <p className="font-medium text-lg">{movie.categories}</p>
                      </div>
                    </div>
                  </div>

                  <div id="trailer-section">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <span className="inline-block w-8 h-0.5 bg-red-500 mr-3"></span>
                      Trailer
                    </h2>

                    {/* Blurred effect on the card above */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gray-900/50 backdrop-blur-md z-[-1]"></div>

                    <div className="relative aspect-w-16 aspect-h-9 bg-gray-700/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-600/50">
                      {movie.trailerLink && showTrailer ? (
                        <iframe
                          src={movie.trailerLink}
                          title={`${movie.name} Trailer`}
                          className="w-full h-full min-h-[500px]" // Increased height for a better YT experience
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                      ) : (
                        <div className="text-center flex flex-col items-center justify-center min-h-[500px]">
                          <div
                            className="w-24 h-24 bg-gray-800/70 backdrop-blur-md rounded-full flex items-center justify-center mb-4 cursor-pointer transition-transform hover:scale-110"
                            onClick={handleWatchTrailer}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 text-red-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-300 text-lg">
                            {movie.trailerLink
                              ? "Click to watch trailer"
                              : "Trailer coming soon"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "cast" && (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-2xl font-bold mb-8 flex items-center">
                      <span className="inline-block w-8 h-0.5 bg-red-500 mr-3"></span>
                      Director
                    </h2>
                    <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-gray-700/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-600/50">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-amber-600 blur opacity-20"></div>
                        <img
                          src={movie.crew[0].image}
                          alt={movie.director}
                          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-700 relative z-10"
                        />
                      </div>
                      <div className="md:ml-4">
                        <h3 className="text-2xl font-bold">{movie.director}</h3>
                        <p className="text-red-400 font-medium mt-1">Director</p>
                        <p className="text-gray-300 mt-4 leading-relaxed">
                          Award-winning director with a unique visual style and
                          storytelling approach.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-8 flex items-center">
                      <span className="inline-block w-8 h-0.5 bg-red-500 mr-3"></span>
                      Cast
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {movie.cast.map((actor, index) => (
                        <div
                          key={index}
                          className="group bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center text-center border border-transparent hover:border-gray-600 transition-all duration-300 transform hover:scale-[1.02] hover:bg-gray-700/70"
                        >
                          <div className="relative mb-4">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            <img
                              src={actor.image}
                              alt={actor.name}
                              className="w-24 h-24 rounded-full object-cover border-4 border-gray-600 group-hover:border-gray-500 transition-all duration-300 relative z-10"
                            />
                          </div>
                          <h3 className="font-bold text-lg group-hover:text-white transition-colors">
                            {actor.name}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">
                            Actor
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-8 flex items-center">
                      <span className="inline-block w-8 h-0.5 bg-red-500 mr-3"></span>
                      Crew
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {movie.crew.map((crewMember, index) => (
                        <div
                          key={index}
                          className="group bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center text-center border border-transparent hover:border-gray-600 transition-all duration-300 transform hover:scale-[1.02] hover:bg-gray-700/70"
                        >
                          <div className="relative mb-4">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            <img
                              src={crewMember.image}
                              alt={crewMember.name}
                              className="w-24 h-24 rounded-full object-cover border-4 border-gray-600 group-hover:border-gray-500 transition-all duration-300 relative z-10"
                            />
                          </div>
                          <h3 className="font-bold text-lg group-hover:text-white transition-colors">
                            {crewMember.name}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">
                            Crew
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-gray-900 to-black py-16 mt-12 relative">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Ready to experience this film?
            </h2>
            <button
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-10 py-5 rounded-xl font-semibold transition-all flex items-center shadow-xl mx-auto transform hover:scale-105"
              onClick={() =>
                navigate("/booking", { state: { movieName: movie.name } })
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
              Book Your Tickets Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetail;
