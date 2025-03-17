import React from 'react';
import { Phone } from 'lucide-react';

const RandomAd = () => {
  return (
    <div className="p-6 bg-gradient-to-r from-blue-900 to-blue-700 border border-blue-800 rounded-lg text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Ad Title */}
      <h3 className="text-2xl font-bold mb-2 animate-pulse">🌟 Advertise Here!</h3>

      {/* Ad Description */}
      <p className="text-sm text-blue-100 mb-4">
        Reach your audience with us. Contact us now to get started!
      </p>

      {/* Call to Action */}
      <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-all duration-300">
        <Phone className="w-6 h-6 text-yellow-400 animate-bounce" />
        <a
          href="tel:+255793151051"
          className="text-lg font-semibold text-white hover:text-yellow-400 transition-colors duration-300"
        >
          +255 793 151 051
        </a>
      </div>
    </div>
  );
};

export default RandomAd;