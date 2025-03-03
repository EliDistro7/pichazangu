import React from 'react';
import {Phone} from 'lucide-react'; 
const RandomAd = () => {
  return (
    <div className="p-4 bg-blue-900 border border-blue-700 rounded-lg text-blue-100">
      <h3 className="font-bold">🌟 Special Offer!</h3>
      <p>Get 1GB of storage for only 2,000 TZS. Store your event memories securely!</p>
               {/* Call to Action */}
<div className="flex items-center space-x-2">
  <Phone className="w-5 h-5 text-yellow-400" />
  <a href="tel:+255617833806" className="text-sm font-medium text-white/80 hover:underline">
    Call us for more details: <span className="font-bold">+255 617 833 806</span>
  </a>
</div>
    </div>
  );
};

export default RandomAd;