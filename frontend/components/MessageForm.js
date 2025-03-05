import React, { useState } from "react";
import { User, Phone, MessageSquare, Check, X } from "lucide-react";
import { addMessage } from "actions/event";

const MessageForm = ({ eventId }) => {
  const [message, setMessage] = useState({
    senderName: "",
    phoneNumber: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await addMessage({ eventId, ...message });
      setSuccess("Message sent successfully!");
      setMessage({ senderName: "", phoneNumber: "", content: "" }); // Reset form
    } catch (err) {
      setError(err.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <MessageSquare className="text-blue-500" size={24} /> New Message
      </h2>

      {success && <p className="text-green-400 text-sm">{success}</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sender Name */}
        <div className="space-y-2">
          <label className="text-gray-300 text-sm flex items-center gap-2">
            <User size={16} className="text-blue-500" /> Sender Name
          </label>
          <input
            type="text"
            name="senderName"
            value={message.senderName}
            onChange={handleChange}
            required
            placeholder="Enter your name"
            className="w-full p-2 bg-gray-700 text-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="text-gray-300 text-sm flex items-center gap-2">
            <Phone size={16} className="text-blue-500" /> Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={message.phoneNumber}
            onChange={handleChange}
            required
            placeholder="Enter phone number"
            className="w-full p-2 bg-gray-700 text-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="text-gray-300 text-sm flex items-center gap-2">
            <MessageSquare size={16} className="text-blue-500" /> Message Content
          </label>
          <textarea
            name="content"
            value={message.content}
            onChange={handleChange}
            required
            placeholder="Enter your message"
            rows="4"
            className="w-full p-2 bg-gray-700 text-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 p-2 rounded-md transition-colors ${
            loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {loading ? "Submitting..." : <><Check size={18} /> Submit Message</>}
        </button>

        {/* Reset Button */}
        <button
          type="button"
          onClick={() => setMessage({ senderName: "", phoneNumber: "", content: "" })}
          className="w-full flex items-center justify-center gap-2 p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <X size={18} /> Reset Form
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
