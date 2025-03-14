import React, { useState } from "react";
import { Users, Eye, Edit, Trash2, User2Icon, QrCode, MessageCircle, MoreVertical } from "lucide-react";
import MessagesList from "./MessagesList";
import { getEventFollowers } from "../actions/event";
import EventQRCode from "./EventQRCode";

const EventCard = ({ event, handleViewEvent, handleEditEvent, handleDeleteEvent }) => {
  const [followers, setFollowers] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);

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
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Cover Photo */}
      <div className="relative h-48">
        <img src={event.coverPhoto} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        {/* Actions Dropdown Trigger */}
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowActionsDropdown(!showActionsDropdown)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md relative"
          >
            <MoreVertical size={16} className="text-white" />
            {showActionsDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                <button
                  onClick={() => handleViewEvent(event._id)}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  <Eye size={16} />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleEditEvent(event._id)}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => setShowQR(true)}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  <QrCode size={16} />
                  <span>Generate QR Code</span>
                </button>
              </div>
            )}
          </button>
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
                    <User2Icon />
                    <span>{follower.username}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300 text-sm">No followers yet.</p>
            )}
          </div>
        )}

        {/* Toggle Messages Button */}
        {event.messages && event.messages.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowMessages(!showMessages)}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition"
            >
              <MessageCircle size={16} />
              <span>{showMessages ? "Hide Messages" : "Show Messages"}</span>
            </button>

            {/* Messages (Toggled) */}
            {showMessages && (
              <div className="mt-2 bg-gray-700 p-2 rounded-md">
                <MessagesList messages={event.messages} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-700 p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold mb-2">Event QR Code</h3>
            <EventQRCode eventId={event._id} />
            <button
              onClick={() => setShowQR(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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