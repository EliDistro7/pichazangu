

// components/CoverPhoto.js
import Image from "next/image";
import { MoreVertical } from "lucide-react";

const CoverPhoto = ({ coverPhoto, title, totalImages, totalVideos, onDropdownToggle }) => {
  return (
    <div className="relative w-full bg-gray-300 flex items-center justify-center">
      {coverPhoto ? (
        <Image
          src={coverPhoto}
          alt={title}
          width={800}
          height={600}
          layout="responsive"
          objectFit="contain"
          className="transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500">
          <span className="text-white text-lg font-semibold"></span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>

      {/* Total Images and Videos */}
      <div className="absolute top-2 left-2 flex items-center space-x-2 bg-black bg-opacity-50 px-2 py-1 rounded-md">
        <span className="text-white text-sm">{totalImages} 📷</span>
        <span className="text-white text-sm">{totalVideos} 🎥</span>
      </div>

      {/* Dropdown Toggle Button */}
      <button
        onClick={onDropdownToggle}
        className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded-md hover:bg-opacity-70 transition-all duration-300"
      >
        <MoreVertical size={20} className="text-white" />
      </button>
    </div>
  );
};

export default CoverPhoto;