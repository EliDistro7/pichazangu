

import React, { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ children, onClose }) => {
  // Disable page scroll when the modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // Close modal if user clicks on the background overlay
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}
    >
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
