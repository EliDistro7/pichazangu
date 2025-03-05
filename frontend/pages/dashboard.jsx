import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2, Edit, Eye, Plus, Users, BarChart2 } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getLoggedInUserId } from "../hooks/useUser";
import { getAllEventsByUser, deleteEvent } from "../actions/event";
import EventCard from "components/EventCard2";
import SearchEvents from "components/SearchEvents";


const Dashboard = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  

  
  useEffect(() => {
    const userId = getLoggedInUserId();
    if (userId) {
       setUser(userId);
       console.log('userid ', userId)
       const fetchUserEvents = async () => {
        try {
          const data = await getAllEventsByUser(userId);
         //console.log('events', data)
         setEvents(data)
      setTotalFollowers(data.reduce((acc, event) => acc + event.followers.length, 0));
         setTotalViews(data.reduce((acc, event) => acc + event.views?.length || 0, 0));
          ;
        } catch (err) {
          toast.error("Failed to fetch events.");
        } finally {
          setLoading(false);
        }
      };
      fetchUserEvents();
    }
  }, []);


  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
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

  // If no user is logged in, render a Login UI.
    if(!user){
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
          <p className="mb-4 text-lg">Login or signup first</p>
          <div className="flex space-x-4">
            <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
            
                Login
          
            </Link>
            <Link href="/sign-up" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
            
                Sign Up
             
            </Link>
          </div>
        </div>
      );
    }

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
      <SearchEvents />
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
          onClick={() => router.push("/events?tab=create")}
          className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create New Album</span>
        </button>

        {/* Event Cards */}
        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events found. Create one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
              key={event._id}
              event={event}
              handleViewEvent={handleViewEvent}
              handleEditEvent={handleEditEvent}
              handleDeleteEvent={handleDeleteEvent}
            />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
