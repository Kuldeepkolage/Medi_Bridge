import React from 'react';

const StatCard = ({ number, label, icon, color }) => {
  return (
    <div className="group relative bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default animate-fade-in-up">
      <div className={`w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all duration-300`}>
        {icon}
      </div>
      <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
        {number}
      </div>
      <p className="text-gray-600 font-medium text-base">{label}</p>
    </div>
  );
};

export default StatCard;

