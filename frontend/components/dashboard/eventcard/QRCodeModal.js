import React from "react";
import EventQRCode from "./EventQRCode";

const QRCodeModal = ({ eventId, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-md w-full border border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-white">Event QR Code</h3>
      <div className="bg-white p-4 rounded-md inline-block mb-4">
        <EventQRCode eventId={eventId} />
      </div>
      <div className="text-sm text-gray-400 mb-4">
        Scan this QR code to quickly access the event details
      </div>
      <button
        onClick={onClose}
        className="mt-2 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Close
      </button>
    </div>
  </div>
);

export default QRCodeModal;