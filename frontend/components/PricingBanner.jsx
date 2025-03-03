import React from 'react';
import { Phone, Image, Video } from 'lucide-react';

const PricingBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-lg shadow-2xl text-white overflow-hidden transform transition-all hover:scale-105 duration-300">
      {/* Masked Section */}
      <div className="absolute inset-0 clip-path-mask bg-white/5 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        {/* Text Section */}
        <div className="flex flex-col space-y-6 max-w-md">
          <h2 className="text-3xl font-bold text-white/90">
            🚀 Get <span className="text-yellow-400">1GB</span> of Storage for Only
          </h2>
          <p className="text-5xl font-extrabold animate-bounce text-yellow-400">
            2,000 TZS
          </p>
          <p className="text-lg font-medium text-white/80">
            Store your event memories securely and access them anytime, anywhere!
          </p>

          {/* Storage Details */}
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <p className="text-sm font-semibold text-white/80">
              📸 <span className="font-bold">1GB</span> can hold approximately:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              <li className="flex items-center space-x-2">
                <Image className="w-4 h-4 text-yellow-400" />
                <span><span className="font-bold">300+</span> standard-quality photos</span>
              </li>
              <li className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-yellow-400" />
                <span><span className="font-bold">15-20</span> minutes of HD video</span>
              </li>
            </ul>
          </div>

         {/* Call to Action */}
<div className="flex items-center space-x-2">
  <Phone className="w-5 h-5 text-yellow-400" />
  <a href="tel:+255617833806" className="text-sm font-medium text-white/80 hover:underline">
    Call us for more details: <span className="font-bold">+255 617 833 806</span>
  </a>
</div>

        </div>

        {/* Smartphone Image with Gallery Preview */}
        <div className="relative w-64 h-64">
          {/* Smartphone Frame */}
          <div className="absolute inset-0 bg-[url('/img/smartphone.png')] bg-contain bg-no-repeat z-20"></div>
          {/* Gallery Images */}
          <div className="absolute inset-4 rounded-lg overflow-hidden z-10 animate-scrollGallery">
            <div className="grid grid-cols-2 gap-2">
              <img src="/img/gallery-image-1.webp" alt="Gallery 1" className="w-full h-auto rounded" />
              <img src="/img/gallery-image-2.webp" alt="Gallery 2" className="w-full h-auto rounded" />
              <img src="/img/gallery-image-1.webp" alt="Gallery 3" className="w-full h-auto rounded" />
              <img src="/gallery-image-4.jpg" alt="Gallery 4" className="w-full h-auto rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingBanner;