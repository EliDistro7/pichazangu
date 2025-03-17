
import { X } from "lucide-react";
import MessageForm from "components/MessageForm";

// components/MessageModal.js
const MessageModal = ({ isOpen, onClose, eventId, userId }) => (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-lg flex items-center justify-center z-50">
        <div className="relative bg-gray-900 text-white rounded-lg shadow-lg p-6 max-w-sm w-full">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
          >
            <X className="text-white" size={20} />
          </button>
          <MessageForm eventId={eventId} userId={userId} />
        </div>
      </div>
    )
  );
  
  export default MessageModal;