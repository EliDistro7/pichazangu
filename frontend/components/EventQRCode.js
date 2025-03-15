import { useState } from "react";
import axios from "axios";

const EventQRCode = ({ eventId }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  console.log('event Id is', eventId);

  const generateQRCode = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/${eventId}/qrcode`, {
        responseType: "blob", // Ensures response is treated as a file
      });
         console.log("we got the blob0")
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
    <div className="p-4 border rounded-lg bg-gray-100 text-center">
      <h3 className="text-lg font-bold mb-2">Event QR Code</h3>
      <button
        onClick={generateQRCode}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Generate QR Code
      </button>

      {qrCodeUrl && (
        <div className="mt-4">
          <img src={qrCodeUrl} alt="Event QR Code" className="mx-auto mb-2 w-40 h-40" />
          <button
            onClick={downloadQRCode}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default EventQRCode;
