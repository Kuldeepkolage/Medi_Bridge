import React from 'react';

const features = [
  { title: 'Advanced Technology', desc: 'State-of-the-art equipment and digital diagnostics for precise treatments.', icon: '⚙️' },
  { title: 'Expert Dentists', desc: 'Board-certified specialists with 15+ years of clinical experience.', icon: '👨‍⚕️' },
  { title: 'Safe & Hygienic', desc: 'ISO-certified sterilization and strict hygiene protocols.', icon: '🛡️' },
  { title: 'Affordable Care', desc: 'Premium quality at transparent, value-driven pricing.', icon: '💰' }
];

const WhyFeature = ({ index }) => {
  return (
    <li className="flex items-start space-x-4 p-5 bg-white rounded-lg border border-gray-100 hover:shadow-md hover:scale-105 transition-all duration-300 group animate-slide-in-left" style={{ animationDelay: `${index * 200}ms` }}>
      <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center shadow-sm mt-1 group-hover:bg-blue-100 group-hover:shadow-md transition-all duration-300">
        <span className="text-2xl">{features[index]?.icon}</span>
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-primary-600 transition-colors duration-300">{features[index]?.title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{features[index]?.desc}</p>
      </div>
    </li>
  );
};

export default WhyFeature;

