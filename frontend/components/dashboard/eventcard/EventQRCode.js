import { useState } from "react";
import axios from "axios";

const EventQRCode = ({ eventId }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const generateQRCode = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/${eventId}/qrcode`, {
        responseType: "blob", // Ensures response is treated as a file
      });
      const qrObjectURL = URL.createObjectURL(response.data);
      setQrCodeUrl(qrObjectURL);
    } catch (error) {
      console.error("Error generating QR Code:", error);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `event-${eventId}-qrcode.png`;
    link.click();
  };

  return (
    <div className="p-6 border border-gray-700 rounded-lg bg-gray-800 text-center shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-100">Event QR Code</h3>
      <button
        onClick={generateQRCode}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
      >
        Generate QR Code
      </button>

      {qrCodeUrl && (
        <div className="mt-6">
          <img
            src={qrCodeUrl}
            alt="Event QR Code"
            className="mx-auto mb-4 w-48 h-48 border-2 border-gray-700 rounded-lg"
          />
          <button
            onClick={downloadQRCode}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
          >
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default EventQRCode;