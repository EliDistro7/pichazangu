

import React from "react";
import { toast } from "react-toastify";

const DeleteConfirmationModal = ({ eventId, handleDeleteEvent }) => {
  const confirmDelete = () => {
    toast.dark(
      <div className="p-4">
        <p className="text-white mb-4">Are you sure you want to delete this event?</p>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              handleDeleteEvent(eventId);
              toast.dismiss();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false,
        closeOnClick: false,
      }
    );
  };

  return (
    <button onClick={confirmDelete} className="text-red-600 hover:text-red-700">
      Delete
    </button>
  );
};

export default DeleteConfirmationModal;