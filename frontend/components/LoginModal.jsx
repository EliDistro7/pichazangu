import React from "react";
import Link from "next/link";
import { X } from "lucide-react";

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="relative bg-gray-900 text-white rounded-lg shadow-lg p-6 max-w-sm w-full transform scale-95 transition duration-300 ease-out opacity-0 animate-fade-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
        >
          <X size={20} className="text-white" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Welcome</h2>
        <p className="mb-6 text-gray-400 text-center">Login or Sign Up to continue.</p>
        
        <div className="flex justify-center space-x-4">
          <Link href="/login">
            <a className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
              Login
            </a>
          </Link>
          <Link href="/sign-up">
            <a className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition">
              Sign Up
            </a>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginModal;
