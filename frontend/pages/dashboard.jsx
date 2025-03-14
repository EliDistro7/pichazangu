import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2, Edit, Eye, Plus, Users, BarChart2, ArrowLeft, User, HardDrive } from "lucide-react";
import { useRouter } from "next/router";
import { getLoggedInUserId } from "../hooks/useUser";
import { getAllEventsByUser, deleteEvent, getEventFollowers } from "../actions/event";
import EventCard from "components/EventCard2";
import SearchEvents from "components/SearchEvents";
import SidebarModal from "../components/SidebarModal";
import { getUserById } from "../actions/users";
import axios from "axios";


const fetchFileSize = async (url) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const size = response.headers.get("Content-Length");
    return size ? parseInt(size, 10) : 0;
  } catch (error) {
    console.error("Error fetching file size:", error);
    return 0;
  }
};

const formatStorageSize = (sizeInBytes) => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`; // Bytes
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)} KB`; // Kilobytes
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`; // Megabytes
  } else if (sizeInBytes < 1024 * 1024 * 1024 * 1024) {
    return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`; // Gigabytes
  } else {
    return `${(sizeInBytes / (1024 * 1024 * 1024 * 1024)).toFixed(2)} TB`; // Terabytes
  }
};

const calculateTotalStorage = async (events) => {
  const fileUrls = [];

  // Extract all media URLs from events
  events.forEach(event => {
    if (event.coverPhoto) fileUrls.push(event.coverPhoto);

    if (Array.isArray(event.imageUrls)) {
      fileUrls.push(...event.imageUrls.map(img => (typeof img === "string" ? img : img.url)));
    }

    if (Array.isArray(event.videoUrls)) {
      fileUrls.push(...event.videoUrls.map(vid => (typeof vid === "string" ? vid : vid.url)));
    }
  });

  // Fetch file sizes for all URLs
  const fileSizes = await Promise.all(fileUrls.map(fetchFileSize));

  // Calculate total storage used and convert it into human-readable format
  const totalStorageBytes = fileSizes.reduce((total, size) => total + size, 0);
  
  return formatStorageSize(totalStorageBytes);
};

const Dashboard = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userdata, setUserdata] = useState(null);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar
  const [totalStorageUsed, setTotalStorageUsed] = useState('0');


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
  
        const totalStorage = await calculateTotalStorage(data);
  
        setUserdata(userD);
        setEvents(data);
        setTotalStorageUsed(totalStorage);
        //console.log(totalStorage)
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
  

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
      toast.success("Event deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete event.");
    }
  };

  const confirmDelete = (eventId) => {
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

  const handleEditEvent = (eventId) => {
    router.push(`/evento/${eventId}`);
  };

  const handleViewEvent = (eventId) => {
    router.push(`/evento/${eventId}`);
  };

  // If no user is logged in, render a Login UI.
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
        <p className="mb-4 text-lg">Login or signup first</p>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/sign-up")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            Sign Up
          </button>
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

      {/* Top Navigation Bar */}
      <div className="bg-black p-4 border-b border-gray-800">
        <SearchEvents />
        <div className="max-w-7xl mx-auto flex justify-between items-center mt-0">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          {/* My Profile Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <span>My Profile</span>
            <User size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar Modal */}
      {isSidebarOpen && (
        <SidebarModal user={userdata} onClose={() => setIsSidebarOpen(false)} />
      )}

      {/* Spacer to prevent fixed header from covering content */}
      <div className="h-16" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-thin mb-6">Your Albums</h1>

        {/* Overall Stats */}
     {/* Overall Stats */}
     <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 hover:bg-gray-700 transition-colors">
            <Users size={24} className="text-blue-500" />
            <div>
              <p className="text-gray-400 text-sm">Total Followers</p>
              <p className="text-xl font-semibold">{totalFollowers}</p>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 hover:bg-gray-700 transition-colors">
            <BarChart2 size={24} className="text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-xl font-semibold">{totalViews}</p>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 hover:bg-gray-700 transition-colors">
            <HardDrive size={24} className="text-purple-500" />
            <div>
              <p className="text-gray-400 text-sm">Storage Used</p>
              <p className="text-xl font-semibold">{totalStorageUsed} GB</p>
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
                handleDeleteEvent={confirmDelete} // Use confirmDelete instead of handleDeleteEvent
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;