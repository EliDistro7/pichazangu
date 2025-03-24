import React, { useState } from "react";
import { Users, Eye, Edit, Trash2, User2Icon, QrCode, MessageCircle, MoreVertical, Lock, Globe, Star, Power } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MessagesList from "components/dashboard/eventcard/MessagesList";
import { getEventFollowers, setEventPrivate, setVisibleOnHomepage, toggleFeaturedStatus, toggleEventActivation } from "../actions/event";
import EventQRCode from "components/dashboard/eventcard/QRCodeModal";

const EventCard = ({ event, onView, onEdit, onDelete }) => {
  const [followers, setFollowers] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [password, setPassword] = useState("");
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
      toast.error("Error fetching followers");
      console.error("Error fetching followers:", error);
    } finally {
      setLoadingFollowers(false);
    }
  };

  // Handle setting event as private
  const handleSetPrivate = async () => {
    if (!password) {
      toast.warning("Please enter a password for private event");
      return;
    }
    try {
      await setEventPrivate(event._id, password);
      toast.success("Event set as private successfully!");
    } catch (error) {
      toast.error("Error setting event as private");
      console.error("Error setting event as private:", error);
    }
  };

  // Toggle homepage visibility
  const handleToggleVisibility = async () => {
    try {
      const newVisibility = !visibility;
      await setVisibleOnHomepage(event._id, newVisibility);
      setVisibility(newVisibility);
      toast.success(`Event ${newVisibility ? "added to" : "removed from"} homepage`);
    } catch (error) {
      toast.error("Error updating event visibility");
      console.error("Error updating event visibility:", error);
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async () => {
    try {
      const updatedEvent = await toggleFeaturedStatus(event._id);
      setIsFeatured(updatedEvent.featured);
      toast.success(`Event ${updatedEvent.featured ? "marked as featured" : "unmarked as featured"}`);
    } catch (error) {
      toast.error("Error toggling featured status");
      console.error("Error toggling featured status:", error);
    }
  };

  // Toggle event activation
  const handleToggleActivation = async () => {
    try {
      const updatedEvent = await toggleEventActivation(event._id);
      setIsActive(updatedEvent.activate);
      toast.success(`Event ${updatedEvent.activate ? "activated" : "deactivated"}`);
      setShowActionsDropdown(false);
    } catch (error) {
      toast.error("Error toggling event activation");
      console.error("Error toggling activation:", error);
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
    
    {/* Dropdown Menu - Positioned outside normal flow */}
    {showActionsDropdown && (
      <div className="fixed inset-0 z-30" onClick={() => setShowActionsDropdown(false)}></div>
    )}
    
    {showActionsDropdown && (
      <div className="fixed top-56 right-4 w-56 bg-gray-700 rounded-md shadow-xl z-40 max-h-[80vh] overflow-y-auto">
        <div className="py-1">
          <button
            onClick={(e) => { e.stopPropagation(); onView(); }}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 text-left"
          >
            <Eye size={16} />
            <span>View</span>
          </button>
          {/* Other buttons with same e.stopPropagation() */}
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 text-left"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 text-left"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setShowQR(true); }}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 text-left"
          >
            <QrCode size={16} />
            <span>Generate QR Code</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleActivation(); }}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 text-left"
          >
            <Power size={16} className={isActive ? 'text-green-400' : 'text-gray-400'} />
            <span>{isActive ? 'Deactivate' : 'Activate'} Event</span>
          </button>

          {/* Set Event as Private */}
          <div className="p-2 border-t border-gray-600">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-sm bg-gray-600 text-white px-2 py-1 rounded-md mb-2"
            />
            <button
              onClick={(e) => { e.stopPropagation(); handleSetPrivate(); }}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md"
            >
              <Lock size={16} />
              <span>Set Private</span>
            </button>
          </div>

          {/* Toggle Visibility */}
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleVisibility(); }}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 border-t border-gray-600"
          >
            <Globe size={16} />
            <span>{visibility ? "Remove from Homepage" : "Show on Homepage"}</span>
          </button>

          {/* Toggle Featured Status */}
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleFeatured(); }}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 border-t border-gray-600"
          >
            <Star size={16} />
            <span>{isFeatured ? "Unmark as Featured" : "Mark as Featured"}</span>
          </button>
        </div>
      </div>
    )}
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
    </>
  );
};

export default EventCard;