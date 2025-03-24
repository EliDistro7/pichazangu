// components/CoverPhoto.js
import Image from "next/image";
import { Camera, Video, Lock } from "lucide-react"; // Added Lock to imports
import ImageCarousel from 'components/ImageCarousel';
import { useEffect, useState } from "react";

const CoverPhoto = ({ coverPhoto, title, totalImages, totalVideos, author, event }) => {
  const isFeaturedWithImages = event.featured && event.imageUrls && event.imageUrls.length > 0;
  const [isBlinking, setIsBlinking] = useState(false);

  // Blinking animation effect
  useEffect(() => {
    if (event.activate) {
      const interval = setInterval(() => {
        setIsBlinking(prev => !prev);
      }, 1000); // Blink every second
      return () => clearInterval(interval);
    }
  }, [event.activate]);

  return (
    <div className="relative w-full h-[400px] bg-gray-300 flex items-center justify-center overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 w-full h-full">
        {isFeaturedWithImages ? (
          <ImageCarousel images={event.imageUrls} className="w-full h-full object-cover pointer-events-none" />
        ) : coverPhoto ? (
          <Image
            src={coverPhoto}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="pointer-events-none"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500">
            <span className="text-white text-lg font-semibold"></span>
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>

      {/* Content Above the Background */}
      <div className="relative z-10 w-full h-full p-4">
        {/* Author Info - Top Left */}
        <div className="absolute top-2 left-2 flex items-center space-x-2 bg-black/30 px-2 py-1 rounded-md">
          <p className="text-sm text-white">{author.username}</p>
        </div>

        {/* Total Images and Videos - Top Right */}
        <div className="absolute top-2 right-2 flex items-center space-x-2 bg-black/30 px-2 py-1 rounded-md">
          <div className="flex items-center space-x-1">
            <Camera size={16} className="text-white" />
            <span className="text-white text-sm">{totalImages}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Video size={16} className="text-white" />
            <span className="text-white text-sm">{totalVideos}</span>
          </div>
          
          {/* Padlock icon for inactive events */}
          {!event.activate && (
            <div className="ml-2">
              <Lock size={16} className="text-gray-300" />
            </div>
          )}
            
          {/* Active Status Indicator */}
          {event.activate && (
            <div className="ml-2 flex items-center">
              <span className={`relative flex h-3 w-3 ${isBlinking ? 'opacity-70' : 'opacity-100'}`}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 "></span>
                <span className="relative inline-flex rounded-full h-3 w-3 "></span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverPhoto;