

import React, { useState } from "react";
import { X, LogOut, User, Mail, Users } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const SidebarModal = ({ user, onClose }) => {
  const router = useRouter();

  // Handle logout with confirmation
  const handleLogout = () => {
    toast.info(
      <div>
        <p>Are you sure you want to log out?</p>
        <div className="flex justify-end space-x-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss();
              // Perform logout logic here (e.g., clear cookies, redirect)
              router.push("/login");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  return (
    <>
      {/* Sidebar Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-50 p-6 transform transition-transform duration-300 ease-in-out">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700"
        >
          <X size={20} />
        </button>

        {/* User Info */}
        <div className="mt-8">
          <div className="flex items-center space-x-4">
            <User size={24} className="text-blue-500" />
            <div>
              <p className="text-lg font-semibold">{user?.username}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Following Count */}
          <div className="mt-6 flex items-center space-x-4">
            <Users size={20} className="text-green-500" />
            <div>
              <p className="text-sm text-gray-400">Following</p>
              <p className="text-lg font-semibold">{user?.following?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-8 w-full flex items-center justify-center space-x-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Toast Container */}
      <ToastContainer 
      
      theme="dark"
      />
    </>
  );
};

export default SidebarModal;