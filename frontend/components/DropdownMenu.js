


// components/DropdownMenu.js
import { Loader2 } from "lucide-react";

const DropdownMenu = ({
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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
      <div className="absolute right-4 top-14 bg-gray-800 rounded-md shadow-lg p-1 w-40">
        {/* View Button */}
        <button
          onClick={onViewClick}
          className="w-full text-left px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-700 rounded-md"
        >
          {loadingView ? <Loader2 size={16} className="animate-spin" /> : "View"}
        </button>

        {/* Follow/Unfollow Button */}
        <button
          onClick={onFollowClick}
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
          onClick={onShareClick}
          className="w-full text-left px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-700 rounded-md"
        >
          Share
        </button>

        {/* Collaborate Button */}
        <button
          onClick={onCollaborateClick}
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
  );
};

export default DropdownMenu;