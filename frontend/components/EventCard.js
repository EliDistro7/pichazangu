import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Eye, EyeOff, Loader2, MoreVertical } from "lucide-react";
import { useRouter } from "next/router";
import { authenticateEvent, requestCollaboration } from "../actions/event";
import { getLoggedInUserId,  } from "hooks/useUser";
import {getUserById} from "actions/users";
import axios from "axios";
import socket from "hooks/socket";
import { WhatsappShareButton, FacebookShareButton, TwitterShareButton } from "react-share";
import { WhatsappIcon, FacebookIcon, TwitterIcon } from "react-share";
import { FiShare2 } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

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
  const [isRequestingCollaboration, setIsRequestingCollaboration] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // New state to track collaboration status
  const [collaborationStatus, setCollaborationStatus] = useState("default"); // "default", "pending", or "collaborating"

  useEffect(() => {
    const userId = getLoggedInUserId();
    setIsLoggedIn(!!userId);

    if (userId && event.followers.includes(userId)) {
      setIsFollowing(true);
    }

    // Check if the user is collaborating or has a pending request
    if (userId) {
      const isCollaborating = event.invited.some((inv) => inv.invitedId.toString() === userId);
      const isPending = event.pendingRequests.some((req) => req.userId.toString() === userId);

      if (isCollaborating) {
        setCollaborationStatus("collaborating");
      } else if (isPending) {
        setCollaborationStatus("pending");
      } else {
        setCollaborationStatus("default");
      }
    }
  }, [event.followers, event.invited, event.pendingRequests]);

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

  const handleRequestCollaboration = async (e) => {
    e.stopPropagation(); // Prevent card click event
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }

    setIsRequestingCollaboration(true);
    const userId = getLoggedInUserId();
    const user = await getUserById(userId); // Replace with the actual username from your user context
    const username = user.username; // Replace with the actual username from your user context
    try {
      await requestCollaboration({
        eventId: event._id,
        userId,
        username,
        socket,
      });
      setCollaborationStatus("pending"); // Update collaboration status
      toast.success("Collaboration request sent successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to send collaboration request.");
    } finally {
      setIsRequestingCollaboration(false);
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent card click event
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Calculate total images and videos
  const totalImages = event.imageUrls.length;
  const totalVideos = event.videoUrls.length;

  return (
    <div
      id={event._id}
      className="font-sans relative group overflow-hidden rounded-xl shadow-2xl transform transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={(e) => {
        // Prevent routing if a button is clicked
        if (!e.target.closest("button")) {
          handleViewClick();
        }
      }}
    >
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
  
      {/* Cover Photo */}
      <div className="relative w-full bg-gray-300 flex items-center justify-center">
        {event.coverPhoto ? (
          <Image
            src={event.coverPhoto}
            alt={event.title}
            width={800} // Set a default width
            height={600} // Set a default height
            layout="responsive" // Use responsive layout
            objectFit="contain" // Ensure the image fits within the container without cropping
            className="transition-transform duration-500 group-hover:scale-110"
            onLoad={() => setImageLoaded(true)}
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
          onClick={toggleDropdown}
          className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded-md hover:bg-opacity-70 transition-all duration-300"
        >
          <MoreVertical size={20} className="text-white" />
        </button>
      </div>
  
      {/* Event details overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-transparent to-transparent">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
          {event.title}
        </h2>
        <p className="text-white text-sm line-clamp-2">{event.description}</p>
        <p className="text-xs text-gray-300 opacity-75 mb-1">by {event.author.username}</p>
      </div>
  
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={toggleDropdown}
        >
          <div className="absolute right-4 top-14 bg-gray-800 rounded-md shadow-lg p-1 w-40">
            {/* View Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewClick();
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-700 rounded-md"
            >
              {loadingView ? <Loader2 size={16} className="animate-spin" /> : "View"}
            </button>
  
            {/* Follow/Unfollow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFollowClick();
                setIsDropdownOpen(false);
              }}
              disabled={!isLoggedIn || loadingFollow}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-700 rounded-md"
            >
              {loadingFollow ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isFollowing ? (
                "Unfollow"
              ) : (
                "Follow"
              )}
            </button>
  
            {/* Share Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSharePopup();
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-700 rounded-md"
            >
              Share
            </button>
  
            {/* Collaborate Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRequestCollaboration(e);
                setIsDropdownOpen(false);
              }}
              disabled={!isLoggedIn || isRequestingCollaboration || collaborationStatus !== "default"}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-700 rounded-md"
            >
              {collaborationStatus === "collaborating"
                ? "Uncollaborate"
                : collaborationStatus === "pending"
                ? "Collaboration Pending"
                : "Collaborate"}
            </button>
          </div>
        </div>
      )}
  
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
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md block mx-auto hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
  
      {/* Login Prompt */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-white mb-4">Login Required</h3>
            <p className="text-gray-300 mb-4">You need to log in to perform this action.</p>
            <Link href="/login">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
                Go to Login
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;