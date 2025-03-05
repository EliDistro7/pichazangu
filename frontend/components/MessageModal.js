

import React from "react";
import { X, User, Phone, MessageSquare } from "lucide-react";

const MessageModal = ({ message, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-gray-800 text-gray-200 p-6 rounded-lg shadow-lg w-96 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <MessageSquare className="text-blue-500" size={24} /> Message Details
        </h2>

        {/* Sender Name */}
        <div className="mb-3">
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <User size={16} className="text-blue-500" /> Sender Name
          </p>
          <p className="text-lg font-semibold">{message.senderName}</p>
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <Phone size={16} className="text-blue-500" /> Phone Number
          </p>
          <p className="text-lg font-semibold">{message.phoneNumber}</p>
        </div>

        {/* Message Content */}
        <div className="mb-3">
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <MessageSquare size={16} className="text-blue-500" /> Message
          </p>
          <p className="bg-gray-700 p-3 rounded-md">{message.content}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
