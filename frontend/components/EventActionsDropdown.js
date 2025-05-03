import React, { useState } from "react";
import { Eye, Edit, Trash2, QrCode, Power, Lock, Globe, Star } from "lucide-react";
import { toast } from "react-toastify";
import { setEventPrivate, setVisibleOnHomepage, toggleFeaturedStatus, toggleEventActivation } from "../actions/event";
import QRCodeModal from "./dashboard/eventcard/QRCodeModal";

const EventActionsDropdown = ({ 
  event,
  onView, 
  onEdit, 
  onDelete, 
  isActive, 
  setIsActive,
  visibility,
  setVisibility,
  isFeatured,
  setIsFeatured,
  showActionsDropdown,
  setShowActionsDropdown
}) => {
  const [password, setPassword] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);

  // Handle setting event as private
  const handleSetPrivate = async () => {
    if (!password) {
      toast.warning("Please enter a password for private event");
      return;
    }
    try {
      await setEventPrivate(event._id, password);
      toast.success("Event set as private successfully!");
      setPassword("");
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

  // Don't render if dropdown isn't shown
  if (!showActionsDropdown) return null;

  return (
    <>
      {/* QR Code Modal */}
      {showQRCode && <QRCodeModal eventId={event._id} onClose={() => setShowQRCode(false)} />}
      
      {/* Backdrop to close dropdown when clicking outside */}
      <div className="fixed inset-0 z-30" onClick={() => setShowActionsDropdown(false)}></div>
      
      {/* Dropdown content */}
      <div className="fixed top-56 right-4 w-56 bg-gray-700 rounded-md shadow-xl z-40 max-h-[80vh] overflow-y-auto">
        <div className="py-1">
          <button
            onClick={(e) => { e.stopPropagation(); onView(); }}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 text-left"
          >
            <Eye size={16} />
            <span>View</span>
          </button>
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
            onClick={(e) => { e.stopPropagation(); setShowQRCode(true); setShowActionsDropdown(false); }}
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
    </>
  );
};

export default EventActionsDropdown;