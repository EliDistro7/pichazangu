// components/SharePopup.js
import { WhatsappShareButton, FacebookShareButton, TwitterShareButton } from "react-share";
import { WhatsappIcon, FacebookIcon } from "react-share";

// Custom X (Twitter) logo for dark theme
const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8 text-white"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SharePopup = ({ eventId, title, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-center text-white">Share this event</h3>
        <div className="flex space-x-4 justify-center">
          {/* WhatsApp */}
          <WhatsappShareButton url={`https://pichazangu.store/evento/${eventId}`} title={title}>
            <WhatsappIcon className="w-8 h-8 rounded-full" />
          </WhatsappShareButton>

          {/* Facebook */}
          <FacebookShareButton url={`https://pichazangu.store/evento/${eventId}`} title={title}>
            <FacebookIcon className="w-8 h-8 rounded-full" />
          </FacebookShareButton>

          {/* X (Twitter) */}
          <TwitterShareButton url={`https://pichazangu.store/evento/${eventId}`} title={title}>
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <XIcon />
            </div>
          </TwitterShareButton>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md block mx-auto hover:bg-gray-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SharePopup;