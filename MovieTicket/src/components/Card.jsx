import React from "react";
import { Star } from "lucide-react";

const Card = ({ img, title, director, actor, rating = 4.5, releaseYear }) => {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
      {/* Image container with gradient overlay */}
      <div className="relative w-full h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity z-10"></div>
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover object-top mx-auto transition-transform duration-500 group-hover:scale-110"
        />

        {/* Quick info that appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <p className="font-medium truncate">{actor}</p>
          <p className="text-sm opacity-90">{releaseYear || "2023"}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors duration-300 line-clamp-1">
            {title}
          </h2>
          <div className="flex items-center bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold">
            <Star size={14} className="mr-1 fill-current" />
            {rating}
          </div>
        </div>

        <p className="text-gray-700 text-sm">
          <span className="font-semibold text-red-600">Director: </span>
          <span className="text-gray-600">{director}</span>
        </p>
      </div>
    </div>
  );
};

export default Card;
