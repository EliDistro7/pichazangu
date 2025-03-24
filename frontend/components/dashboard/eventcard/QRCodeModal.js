

import EventQRCode from "./QRCodeModal";

const QRCodeModal = ({ eventId, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-gray-700 p-4 rounded-lg shadow-lg text-center">
      <h3 className="text-lg font-bold mb-2">Event QR Code</h3>
      <EventQRCode eventId={eventId} />
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Close
      </button>
    </div>
  </div>
);

export default QRCodeModal;