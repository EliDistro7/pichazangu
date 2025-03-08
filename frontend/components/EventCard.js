import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { authenticateEvent } from "../actions/event";
import { getLoggedInUserId } from "hooks/useUser";
import axios from "axios";
import socket from "hooks/socket";
import { WhatsappShareButton, FacebookShareButton, TwitterShareButton } from "react-share";
import { WhatsappIcon, FacebookIcon, TwitterIcon } from "react-share";
import { FiShare2 } from "react-icons/fi";

const EventCard = ({ event }) => {
  const router = useRouter();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loadingView, setLoadingView] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);

  useEffect(() => {
    const userId = getLoggedInUserId();
    setIsLoggedIn(!!userId);

    if (userId && event.followers.includes(userId)) {
      setIsFollowing(true);
    }
  }, [event.followers]);

  const handleViewClick = async () => {
    setLoadingView(true);
    if (!event.private) {
      await router.push(`/evento/${event._id}`);
    } else {
      setShowPasswordInput(true);
    }
    setLoadingView(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await authenticateEvent({ eventId: event._id, password });
      await router.push(`/evento/${event._id}`);
    } catch (err) {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleFollowClick = async () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }

    setLoadingFollow(true);
    const userId = getLoggedInUserId();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/${event._id}/toggle-follow`,
        { userId }
      );
      const data = response.data;
      setIsFollowing(data.isFollowing);

      if (data.isFollowing) {
        socket.emit("follow_event", {
          userId,
          eventId: event._id,
          eventOwnerId: event.ownerId,
        });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }

    setLoadingFollow(false);
  };

  const toggleSharePopup = () => {
    setIsSharePopupOpen(!isSharePopupOpen);
  };

  return (
    <div id={event._id} className="font-sans relative group overflow-hidden rounded-xl shadow-2xl">
      {/* Cover Photo */}
      <div className="relative h-64 w-full bg-gray-300 flex items-center justify-center">
        {event.coverPhoto ? (
          <Image
            src={event.coverPhoto}
            alt={event.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-110"
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500">
            <span className="text-white text-lg font-semibold"></span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Event details overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h2 className="text-2xl font-bold text-white">{event.title}</h2>
        <p className="text-white text-sm mt-1 line-clamp-2">{event.description}</p>
        <div className="flex items-center mt-3 space-x-3">
          <span className="text-white text-sm">by {event.author.username}</span>
          <button
            onClick={handleViewClick}
            className="flex items-center space-x-1 bg-white bg-opacity-20 px-3 py-1 rounded hover:bg-opacity-40 transition"
            disabled={loadingView}
          >
            {loadingView ? (
              <Loader2 size={16} className="text-white animate-spin" />
            ) : (
              <Eye size={16} className="text-white" />
            )}
            <span className="text-white text-xs">View</span>
          </button>
          <button
            onClick={handleFollowClick}
            disabled={!isLoggedIn || loadingFollow}
            className={`flex items-center space-x-1 ${
              isLoggedIn
                ? isFollowing
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 cursor-not-allowed"
            } px-3 py-1 rounded transition`}
          >
            {loadingFollow ? (
              <Loader2 size={16} className="text-white animate-spin" />
            ) : null}
            <span className="text-white text-xs">{isFollowing ? "Unfollow" : "Follow"}</span>
          </button>
          <button
            onClick={toggleSharePopup}
            className="flex items-center space-x-1 bg-white bg-opacity-20 px-3 py-1 rounded hover:bg-opacity-40 transition"
          >
            <FiShare2 size={16} className="text-white" />
            <span className="text-white text-xs">Share</span>
          </button>
        </div>
        {showLoginPrompt && (
          <div className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg">
            Please log in to follow this event.
          </div>
        )}
      </div>

      {/* Password Input Modal */}
      {showPasswordInput && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-white mb-4">Private Event</h3>
            <p className="text-gray-300 mb-4">This event is private. Please enter the password to view.</p>
            <form onSubmit={handlePasswordSubmit}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <div className="flex justify-end mt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordInput(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Popup */}
      {isSharePopupOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-center">Share this event</h3>
            <div className="flex space-x-4 justify-center">
              <WhatsappShareButton url={`https://pichazangu.store/evento/${event._id}`} title={event.title}>
                <WhatsappIcon className="w-8 h-8 rounded-full" />
              </WhatsappShareButton>
              <FacebookShareButton url={`https://pichazangu.store/evento/${event._id}`} title={event.title}>
                <FacebookIcon className="w-8 h-8 rounded-full" />
              </FacebookShareButton>
              <TwitterShareButton url={`https://pichazangu.store/evento/${event._id}`} title={event.title}>
                <TwitterIcon className="w-8 h-8 rounded-full" />
              </TwitterShareButton>
            </div>
            <button
              onClick={toggleSharePopup}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md block mx-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;