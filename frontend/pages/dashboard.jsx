import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus, ArrowLeft, User, Users, HardDrive, BarChart2 } from "lucide-react";
import { useRouter } from "next/router";
import { getLoggedInUserId } from "../hooks/useUser";
import { getAllEventsByUser, deleteEvent } from "../actions/event";
import SearchEvents from "components/SearchEvents";
import SidebarModal from "../components/SidebarModal";
import { getUserById } from "../actions/users";
import StatsCard from "../components/StatsCard";
import CollaborationRequestsSection from "../components/CollaborationRequestsSection";
import EventList from "../components/EventList2";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import socket from "../hooks/socket";
import OverallStats from "../components/OverallStats";

const Dashboard = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userdata, setUserdata] = useState(null);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalStorageUsed, setTotalStorageUsed] = useState("0");

  useEffect(() => {
    const userId = getLoggedInUserId();
    if (!userId) return;

    setUser(userId);
    const fetchUserEvents = async () => {
      try {
        const [userD, data] = await Promise.all([
          getUserById(userId),
          getAllEventsByUser(userId),
        ]);

        setUserdata(userD);
        setEvents(data);
        setTotalFollowers(data.reduce((acc, event) => acc + event.followers.length, 0));
        setTotalViews(data.reduce((acc, event) => acc + (event.views?.length || 0), 0));
      } catch (err) {
        toast.error("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  const stats = [
    { icon: Users, label: "Followers", value: totalFollowers, iconColor: "text-blue-500" },
    { icon: BarChart2, label: "Views", value: totalViews, iconColor: "text-green-500" },
    { icon: HardDrive, label: "Storage", value: totalStorageUsed, iconColor: "text-purple-500" }
  ];

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

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
        <p className="mb-4 text-lg">Login or signup first</p>
        <div className="flex space-x-4">
          <button onClick={() => router.push("/login")} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">Login</button>
          <button onClick={() => router.push("/sign-up")} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">Sign Up</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      <div className="bg-black p-4 border-b border-gray-800">
        <SearchEvents />
        <div className="max-w-7xl mx-auto flex justify-between items-center mt-0">
          <button onClick={() => router.back()} className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <button onClick={() => setIsSidebarOpen(true)} className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <span>My Profile</span>
            <User size={20} />
          </button>
        </div>
      </div>
      {isSidebarOpen && <SidebarModal user={userdata} onClose={() => setIsSidebarOpen(false)} />}
      <div className="h-16" />
      <div className="max-w-7xl mx-auto">
      
      <div className="flex gap-4 mb-6 w-full">
          <OverallStats stats={stats} />
          <CollaborationRequestsSection events={events} user={user} socket={socket} />
        </div>
        
        <button onClick={() => router.push("/events?tab=create")} className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2">
          <Plus size={20} />
          <span>Create New Album</span>
        </button>
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <EventList
            events={events}
            handleViewEvent={handleViewEvent}
            handleEditEvent={handleEditEvent}
            handleDeleteEvent={(eventId) => (
              <DeleteConfirmationModal eventId={eventId} handleDeleteEvent={handleDeleteEvent} />
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
