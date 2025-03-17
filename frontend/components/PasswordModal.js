


// components/PasswordModal.js
import { Eye, EyeOff } from "lucide-react";

const PasswordModal = ({
  showPassword,
  password,
  error,
  onPasswordChange,
  onToggleShowPassword,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold text-white mb-4">Private Event</h3>
        <p className="text-gray-300 mb-4">This event is private. Please enter the password to view.</p>
        <form onSubmit={onSubmit}>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={onPasswordChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={onToggleShowPassword}
              className="absolute inset-y-0 right-0 pr-2 flex items-center"
            >
              {showPassword ? (
                <EyeOff size={20} className="text-gray-400" />
              ) : (
                <Eye size={20} className="text-gray-400" />
              )}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end mt-4 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;