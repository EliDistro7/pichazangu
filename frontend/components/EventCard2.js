import React, { useState } from "react";
import { Users, Eye, Edit, Trash2, MessageCircle } from "lucide-react";
import MessagesList from "./MessagesList";


const EventCard = ({ event, handleViewEvent, handleEditEvent, handleDeleteEvent }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openMessageModal = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Cover Photo */}
      <div className="relative h-48">
        <img src={event.coverPhoto} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Event Details */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{event.description}</p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Users size={16} />
            <span>{event.followers.length} Followers</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Eye size={16} />
            <span>{event.views?.length || 0} Views</span>
          </div>
        </div>

        {/* Messages */}
        {event.messages && event.messages.length > 0 && (
          <MessagesList messages={event.messages} onMessageClick={openMessageModal} />
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleViewEvent(event._id)}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition"
          >
            <Eye size={16} />
            <span>View</span>
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEditEvent(event._id)}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              <Edit size={16} className="text-white" />
            </button>
            <button
              onClick={() => handleDeleteEvent(event._id)}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-md"
            >
              <Trash2 size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Message Modal */}
    
    </div>
  );
};

export default EventCard;