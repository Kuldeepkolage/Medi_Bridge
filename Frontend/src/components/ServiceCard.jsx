import React from 'react';

const serviceIcons = {
  checkup: '🦷',
  implants: '🔩',
  braces: '🦷',
  whitening: '✨',
  emergency: '🚨'
};

const ServiceCard = ({ title, description, iconKey, index }) => {
  const Icon = serviceIcons[iconKey] || '🦷';

  return (
    <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-xl hover:scale-105 cursor-pointer group overflow-hidden h-full transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
      <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary-100 group-hover:shadow-md transition-all duration-300 mx-auto">
        <span className="text-3xl">{Icon}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-3 text-center group-hover:text-primary-600 transition-colors duration-300">{title}</h3>
      <p className="text-gray-600 text-sm text-center leading-relaxed">{description}</p>
      <div className="mt-6 flex justify-center">
        <span className="px-4 py-2 bg-blue-50 text-primary-600 rounded-lg text-sm font-semibold group-hover:bg-primary-100 transition-colors duration-300">Learn More →</span>
      </div>
    </div>
  );
};

export default ServiceCard;

