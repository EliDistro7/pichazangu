

import { MessageCircle } from "lucide-react";
import MessagesList from "./MessagesList";

const EventMessages = ({ messages, showMessages, onToggleMessages }) => (
  <div className="mt-4">
    <button
      onClick={onToggleMessages}
      className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition"
    >
      <MessageCircle size={16} />
      <span>{showMessages ? "Hide Messages" : "Show Messages"}</span>
    </button>
    {showMessages && (
      <div className="mt-2 bg-gray-700 p-2 rounded-md">
        <MessagesList messages={messages} />
      </div>
    )}
  </div>
);

export default EventMessages;