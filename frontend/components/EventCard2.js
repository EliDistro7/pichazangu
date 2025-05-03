import React, { useState } from "react";
import { Users, Eye, MoreVertical, MessageCircle, User2Icon } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MessagesList from "components/dashboard/eventcard/MessagesList";
import { getEventFollowers } from "../actions/event";
// QR Code is now handled in EventActionsDropdown component
import EventActionsDropdown from "./EventActionsDropdown";

const EventCard = ({ event, onView, onEdit, onDelete }) => {
  const [followers, setFollowers] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  // QR code state moved to EventActionsDropdown component
  const [showMessages, setShowMessages] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [visibility, setVisibility] = useState(event.visibleOnHomepage);
  const [isFeatured, setIsFeatured] = useState(event.featured);
  const [isActive, setIsActive] = useState(event.activate);

  // Fetch followers
  const fetchFollowers = async () => {
    setLoadingFollowers(true);
    try {
      const data = await getEventFollowers(event._id);
      setFollowers(data.followers);
    } catch (error) {
      console.error("Error fetching followers:", error);
    } finally {
      setLoadingFollowers(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
        {/* Status indicator */}
        <div className={`absolute top-2 left-2 z-10 px-2 py-1 rounded-md text-xs font-medium ${
          isActive ? 'bg-green-900/80 text-green-300' : 'bg-gray-900/80 text-gray-300'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </div>

        {/* Cover Photo */}
        <div className="relative h-48">
          <img src={event.coverPhoto} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

          {/* Actions Dropdown Trigger */}
          <div className="absolute top-2 right-2">
            <div
              onClick={() => setShowActionsDropdown(!showActionsDropdown)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md relative cursor-pointer z-40"
            >
              <MoreVertical size={16} className="text-white" />
            </div>
            
            {/* Actions Dropdown Component */}
            <EventActionsDropdown 
              event={event}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              // QR state handling is now internal to EventActionsDropdown
              isActive={isActive}
              setIsActive={setIsActive}
              visibility={visibility}
              setVisibility={setVisibility}
              isFeatured={isFeatured}
              setIsFeatured={setIsFeatured}
              showActionsDropdown={showActionsDropdown}
              setShowActionsDropdown={setShowActionsDropdown}
            />
          </div>
        </div>

        {/* Event Details */}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">{event.description}</p>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                setShowFollowers(!showFollowers);
                if (!followers.length) fetchFollowers();
              }}
              className="flex items-center space-x-2 text-sm text-gray-300 hover:underline"
            >
              <Users size={16} />
              <span>{event.followers.length} Followers</span>
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Eye size={16} />
              <span>{event.views?.length || 0} Views</span>
            </div>
          </div>

          {/* Followers List */}
          {showFollowers && (
            <div className="bg-gray-700 p-2 rounded-md mt-2">
              {loadingFollowers ? (
                <p className="text-gray-300 text-sm">Loading followers...</p>
              ) : followers.length > 0 ? (
                <ul className="text-gray-300 text-sm space-y-1">
                  {followers.map((follower) => (
                    <li key={follower._id} className="flex items-center space-x-2">
                      <User2Icon size={16} />
                      <span>{follower.username}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300 text-sm">No followers yet.</p>
              )}
            </div>
          )}

          {/* Messages */}
          {event.messages && event.messages.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowMessages(!showMessages)}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition"
              >
                <MessageCircle size={16} />
                <span>{showMessages ? "Hide Messages" : "Show Messages"}</span>
              </button>

              {showMessages && (
                <div className="mt-2 bg-gray-700 p-2 rounded-md">
                  <MessagesList messages={event.messages} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* QR Code Modal has been moved to EventActionsDropdown component */}
      </div>
    </>
  );
};

export default EventCard;