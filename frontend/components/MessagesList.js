import React, { useState } from "react";
import MessageModal from "./MessageModal";

const MessagesList = ({ messages }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  return (
    <div className="mb-4">
      <h3 className="text-gray-300 text-sm mb-2">Messages:</h3>
      <div className="bg-gray-700 rounded-md p-2">
        {messages.map((msg, index) => (
          <button
            key={index}
            onClick={() => handleOpenModal(msg)}
            className="block w-full text-left px-3 py-2 border-b border-gray-600 last:border-none hover:bg-gray-600 transition"
          >
            <span className="font-semibold text-white">{msg.senderName}: </span>
            <span className="text-gray-300">
              {msg.content.length > 50 ? msg.content.substring(0, 50) + "..." : msg.content}
            </span>
          </button>
        ))}
      </div>
      
      {/* Message Modal */}
      <MessageModal message={selectedMessage} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default MessagesList;
