import { WhatsappShareButton, FacebookShareButton, TwitterShareButton } from "react-share";
import { WhatsappIcon, FacebookIcon } from "react-share";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom X (Twitter) logo
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

const SharePopup = ({ eventId, title, coverPhoto, onClose }) => {
  const eventUrl = `https://pichazangu.store/evento/${eventId}`;

  // Copy to clipboard function
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link.");
    }
  };

  // Instagram Story sharing (mobile)
  const shareToInstagramStory = () => {
    const instagramURL = `https://www.instagram.com/stories/create/`;
    window.open(instagramURL, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-center text-white">Share this event</h3>
        <div className="flex space-x-4 justify-center">
          {/* WhatsApp */}
          <WhatsappShareButton url={eventUrl} title={title}>
            <WhatsappIcon className="w-8 h-8 rounded-full" />
          </WhatsappShareButton>

          {/* Facebook */}
          <FacebookShareButton url={eventUrl} title={title}>
            <FacebookIcon className="w-8 h-8 rounded-full" />
          </FacebookShareButton>

          {/* X (Twitter) */}
          <TwitterShareButton url={eventUrl} title={title}>
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <XIcon />
            </div>
          </TwitterShareButton>

          {/* Instagram */}
          <button
            onClick={copyToClipboard}
            className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold"
          >
            IG
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md block mx-auto hover:bg-gray-600 transition"
        >
          Close
        </button>
      </div>
      <ToastContainer position="bottom-center" autoClose={3000} theme="dark" />
    </div>
  );
};

export default SharePopup;
