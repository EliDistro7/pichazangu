"use client";
import { Camera, MessageSquare } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const CoverPhotoBanner = ({ event, isAuthor, onCoverPhotoUpload, onMessageClick }) => (
  <div
    className="relative h-[400px] w-full overflow-hidden mb-8 rounded-xl shadow-lg"
    style={{
      backgroundImage: `url(${event.coverPhoto})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>

    {/* Content Container */}
    <div className="absolute inset-0 flex flex-col items-center justify-end text-center text-white p-6">
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-3"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >
        {event.title}
      </motion.h1>

      <motion.p 
        className="max-w-2xl mb-6 text-lg text-gray-300"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {event.description}
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-transform hover:scale-105"
        >
          View Profile
        </Link>
      </motion.div>
    </div>

    {/* Message Button */}
    <motion.button
      onClick={onMessageClick}
      className="absolute bottom-6 left-6 p-3 bg-white/90 backdrop-blur-sm rounded-full cursor-pointer hover:bg-white transition-all hover:scale-110 shadow-lg"
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <MessageSquare className="w-6 h-6 text-gray-800" />
    </motion.button>

    {/* Cover Photo Upload Button (Visible to Author) */}
    {isAuthor && (
      <motion.label
        className="absolute bottom-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-full cursor-pointer hover:bg-white transition-all hover:scale-110 shadow-lg"
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Camera className="w-6 h-6 text-gray-800" />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onCoverPhotoUpload(e.target.files[0])}
        />
      </motion.label>
    )}
  </div>
);

export default CoverPhotoBanner;
