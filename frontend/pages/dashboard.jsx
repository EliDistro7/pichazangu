import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2, Edit, Eye, Plus, Users, BarChart2 } from "lucide-react";
import { useRouter } from "next/router";
import { getLoggedInUserId } from "../hooks/useUser";
import { getAllEventsByUser, deleteEvent } from "../actions/event";

const Dashboard = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = getLoggedInUserId();

  useEffect(() => {
    if (userId) {
      fetchUserEvents();
    }
  }, [userId]);

  const fetchUserEvents = async () => {
    try {
      const data = await getAllEventsByUser(userId);
      console.log('events', data);
      setEvents(data);
    } catch (err) {
      toast.error("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
      toast.success("Event deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete event.");
    }
  };

  const handleEditEvent = (eventId) => {
    router.push(`/evento/${eventId}`);
  };

  const handleViewEvent = (eventId) => {
    router.push(`/evento/${eventId}`);
  };

  // Calculate total followers and views across all events
  const totalFollowers = events.reduce((acc, event) => acc + event.followers.length, 0);
  const totalViews = events.reduce((acc, event) => acc + (event.views || 0), 0);

  return (
    <div className="min-h-screen bg-black text-white p-6">
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Events</h1>

        {/* Overall Stats */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4">
            <Users size={24} className="text-blue-500" />
            <div>
              <p className="text-gray-400 text-sm">Total Followers</p>
              <p className="text-xl font-semibold">{totalFollowers}</p>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4">
            <BarChart2 size={24} className="text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-xl font-semibold">{totalViews}</p>
            </div>
          </div>
        </div>

        {/* Create Event Button */}
        <button
          onClick={() => router.push("/create-event")}
          className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create New Event</span>
        </button>

        {/* Event Cards */}
        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events found. Create one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Cover Photo */}
                <div className="relative h-48">
                  <img
                    src={event.coverPhoto}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>

                {/* Event Details */}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {event.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <Users size={16} />
                      <span>{event.followers.length} Followers</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <Eye size={16} />
                      <span>{event.views || 0} Views</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleViewEvent(event._id)}
                      className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition"
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditEvent(event._id)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                      >
                        <Edit size={16} className="text-white" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-md"
                      >
                        <Trash2 size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;