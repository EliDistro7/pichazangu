import React from "react";
import EventCard from "components/EventCard2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteEvent } from "../actions/event";

const EventList = ({ events, handleViewEvent, handleEditEvent, handleDeleteEvent }) => {
  if (events.length === 0) {
    return <p>No events found. Create one to get started!</p>;
  }

  const confirmDelete = (eventId) => {
    toast.dark(
      <div className="p-4">
        <p className="text-white mb-4">Are you sure you want to delete this event?</p>
        <div className="flex space-x-4">
          <button
            onClick={async () => {
              try {
                if (handleDeleteEvent) {
                  await handleDeleteEvent(eventId);
                } else {
                  await deleteEvent(eventId);
                }
                toast.success("Event deleted successfully!");
                toast.dismiss();
              } catch (err) {
                toast.error("Failed to delete event.");
                toast.dismiss();
              }
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
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            onView={() => handleViewEvent(event._id)}
            onEdit={() => handleEditEvent(event._id)}
            onDelete={() => confirmDelete(event._id)}
          />
        ))}
      </div>
    </>
  );
};

export default EventList;