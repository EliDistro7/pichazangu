

import { useState } from "react";
import { authenticateEvent } from "actions/event"; // Import the authenticateEvent function
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter} from "next/router";

const PasswordModal = ({ eventId, onClose, onAuthenticate }) => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Authenticate the event
      const eventData = await authenticateEvent({ eventId, password });

      // If authentication is successful, close the modal and allow access
      onAuthenticate(eventData);
      onClose();
    } catch (error) {
      setError(error.message || "Failed to authenticate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/80">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700/50 p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Enter Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 mb-4 text-sm text-gray-200 bg-gray-800/50 rounded-md border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {error && (
            <p className="text-sm text-red-500 mb-4">{error}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={()=>{
                 router.push('/')
              }}
              className="px-4 py-2 text-sm text-gray-200 bg-gray-700/50 hover:bg-gray-700/70 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
            >
              {isLoading ? "Authenticating..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;