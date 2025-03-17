import { likeEvent, unlikeEvent } from "actions/event"; // Add unlikeEvent
import { useState, useEffect } from "react";
import { Loader2, Eye, Heart, UserPlus, Share, MoreVertical } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DropdownMenu = ({
  eventId,
  userId,
  socket,
  onViewClick,
  onFollowClick,
  onShareClick,
  onCollaborateClick,
  loadingView,
  loadingFollow,
  isFollowing,
  isLoggedIn,
  collaborationStatus,
  isRequestingCollaboration,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false); // For like animation

  // Check if the user has already liked this event
  useEffect(() => {
    const likedEvents = JSON.parse(localStorage.getItem("likedEvents") || "[]");
    if (likedEvents.includes(eventId)) {
      setHasLiked(true);
    }
  }, [eventId]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to like an event.");
      return;
    }

    setIsLiking(true); // Start animation

    try {
      if (hasLiked) {
        // Unlike the event
        const { totalLikes } = await unlikeEvent({ eventId, socket });

        if (totalLikes !== null) {
          // Remove the event ID from localStorage
          const likedEvents = JSON.parse(localStorage.getItem("likedEvents") || "[]");
          const updatedLikedEvents = likedEvents.filter((id) => id !== eventId);
          localStorage.setItem("likedEvents", JSON.stringify(updatedLikedEvents));

          // Update state to reflect that the user has unliked the event
          setHasLiked(false);

          // Show success toast
          toast.success("Unliked");
          console.log("Event unliked successfully! Total likes:", totalLikes);
        }
      } else {
        // Like the event
        const { totalLikes } = await likeEvent({ eventId, socket });

        if (totalLikes !== null) {
          // Store the event ID in localStorage
          const likedEvents = JSON.parse(localStorage.getItem("likedEvents") || "[]");
          likedEvents.push(eventId);
          localStorage.setItem("likedEvents", JSON.stringify(likedEvents));

          // Update state to reflect that the user has liked the event
          setHasLiked(true);

          // Show success toast
          //toast.success("Liked");
          //console.log("Event liked successfully! Total likes:", totalLikes);
        }
      }
    } catch (error) {
      toast.error("Failed to like/unlike the event. Please try again.");
      console.error("Error liking/unliking event:", error);
    } finally {
      setIsLiking(false); // Stop animation
    }
  };

  return (
    <>
      {/* Toast Container */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        theme="dark"
      />
  
      {/* Dropdown Menu */}
      <div className="absolute inset-x-0 bottom-[-10px] z-50 rounded-md shadow-lg p-2 flex flex-wrap items-center gap-2 bg-gradient-to-t from-black/80 to-transparent w-full">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={!isLoggedIn || isLiking} // Disable if not logged in or during animation
          className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm ${
            hasLiked ? "text-red-500" : "text-gray-200"
          } hover:bg-gray-700/50 rounded-md transition-all duration-300 ${
            isLiking ? "animate-pulse" : ""
          }`}
        >
          <Heart size={16} className="w-4 h-4 sm:w-5 sm:h-5" fill={hasLiked ? "red" : "none"} />
          <span>{hasLiked ? "Liked" : "Like"}</span>
        </button>
  
        {/* Follow Button */}
        <button
          onClick={onFollowClick}
          disabled={!isLoggedIn || loadingFollow}
          className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm ${
            isFollowing ? "text-green-500" : "text-gray-200"
          } hover:bg-gray-700/50 rounded-md transition-all duration-300`}
        >
          <UserPlus size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>
            {loadingFollow ? (
              <Loader2 size={16} className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : isFollowing ? (
              "Unfollow"
            ) : (
              "Follow"
            )}
          </span>
        </button>
  
        {/* Share Button */}
        <button
          onClick={onShareClick}
          className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-300"
        >
          <Share size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Share</span>
        </button>
  
        {/* More Button (Dropdown Toggle) */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-300"
        >
          <MoreVertical size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>More</span>
        </button>
  
        {/* Dropdown Menu for Additional Options (Modal-Like Overlay) */}
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setIsDropdownOpen(false)}
            ></div>
  
            {/* Dropdown Content */}
            <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700/50 p-3 flex flex-col gap-1.5 z-50 w-[90%] max-w-[200px] sm:w-auto sm:max-w-none">
              {/* View Button */}
              <button
                onClick={() => {
                  onViewClick();
                  setIsDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-gray-200 hover:bg-gray-800/70 rounded-md transition-colors duration-200"
              >
                <Eye size={16} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                <span>
                  {loadingView ? (
                    <Loader2 size={16} className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-gray-300" />
                  ) : (
                    "View"
                  )}
                </span>
              </button>
  
              {/* Collaborate Button */}
              <button
                onClick={(e) => {
                  onCollaborateClick(e);
                  setIsDropdownOpen(false);
                }}
                disabled={!isLoggedIn || isRequestingCollaboration || collaborationStatus !== "default"}
                className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-gray-200 hover:bg-gray-800/70 rounded-md transition-colors duration-200"
              >
                <span>
                  {collaborationStatus === "collaborating"
                    ? "Uncollaborate"
                    : collaborationStatus === "pending"
                    ? "Pending"
                    : "Collaborate"}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DropdownMenu;