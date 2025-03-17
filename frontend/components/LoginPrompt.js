

// components/LoginPrompt.js
import Link from "next/link";

const LoginPrompt = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold text-white mb-4">Login Required</h3>
        <p className="text-gray-300 mb-4">You need to log in to perform this action.</p>
        <Link href="/login">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
            Go to Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LoginPrompt;