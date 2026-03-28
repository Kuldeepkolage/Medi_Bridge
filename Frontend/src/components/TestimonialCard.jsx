import React from 'react';

const TestimonialCard = ({ name, text, rating, avatar }) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden group cursor-pointer animate-fade-in-up">
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-lg mr-1">★</span>
        ))}
      </div>
      
      <p className="text-gray-700 text-base leading-relaxed mb-6">"{text}"</p>
      
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-sm">
          {avatar}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm">{name}</h4>
          <span className="text-gray-500 text-xs">Verified Patient</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;

