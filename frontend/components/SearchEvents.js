import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Search,
  Loader2,
  User,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Bell,
  Camera,
  CalendarPlus,
  MessageCircle,
  Home,
  X,
} from "lucide-react";
import { searchEvents } from "actions/event";
import { getLoggedInUserId } from "hooks/useUser";
import socket from "hooks/socket";
import {getNotifications} from "actions/notifications";
import NotificationModal from "./NotificationModal";
import Image from "next/image";

const SearchEvents = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false); // Tracks if a search has been made
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Toggle search form
  const [notificationCount, setNotificationCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);




  // Header Logic
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      const user1 = await getLoggedInUserId();
      if (user1) {
        setUser(user1);
  
        try {
          const notifications = await getNotifications(user1);
         // console.log('notifications', notifications);
          const unreadCount = notifications.filter(n => !n.read).length;
          setNotificationCount(unreadCount);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
  
        // Listen for new notifications via socket
        socket.on("new_message", (notification) => {
          setNotificationCount((prevCount) => prevCount + 1);
        });
        // Listen for new notifications via socket
        socket.on("view_event", (notification) => {
          setNotificationCount((prevCount) => prevCount + 1);
        });
      } else {
        setUser(false);
      }
    };
  
    fetchUserAndNotifications();
  
    return () => {
      socket.off("new_message");
      socket.off('view_event');
    };
  }, []);
  

  // Search Logic
  const handleSearch = async () => {
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true); // Mark that a search has been initiated

    try {
      const response = await searchEvents(username);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.response?.data?.error || "Failed to fetch events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
  <header className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${darkMode ? "bg-gray-900/90 backdrop-blur-md border-b border-gray-800" : "bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm"}`}>
  <div className="container mx-auto px-6">
    <div className="flex items-center justify-between h-16">
      {/* Brand Logo & Name */}
      <div className="flex items-center space-x-3">
        <a href="/" className="flex items-center group">
          <div className="relative h-9 w-9 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-blue-400/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0.5 rounded-[5px] bg-gray-900 overflow-hidden">
              <Image 
                src={'/img/picha2.jpeg'} 
                alt="Pichazangu Logo"
                fill
                className="w-full p-1.5 transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
          </div>
          <span className={`ml-3 text-xl font-medium ${darkMode ? "text-white" : "text-gray-900"} `}>
            Pichazangu
            <span className="text-blue-400">.</span>
          </span>
        </a>
      </div>

      {/* Navigation Center */}
      <nav className="hidden md:flex items-center space-x-1">
        <a
          href="/"
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${darkMode ? "hover:bg-gray-800/70 text-gray-300 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"}`}
        >
          <Home size={18} className="flex-shrink-0" />
          <span>Home</span>
        </a>
      
      </nav>

      {/* Right Side Controls */}
      <div className="flex items-center space-x-3">
        {/* Dynamic Search Bar */}
        <div className={`relative transition-all duration-300 ${isSearchOpen ? "w-48 md:w-64" : "w-0 opacity-0"}`}>
          {isSearchOpen && (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="absolute right-0 top-0"
            >
              <div className={`relative flex items-center ${darkMode ? "bg-gray-800" : "bg-gray-100"} rounded-full pl-4 pr-2 h-10 border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Search albums..."
                  className={`w-full bg-transparent outline-none ${darkMode ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`ml-2 p-1.5 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} transition-colors`}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Search size={16} />
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Search Toggle */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={`p-2 rounded-full transition-all ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} ${isSearchOpen ? "rotate-90" : ""}`}
          aria-label="Search"
        >
          {isSearchOpen ? (
            <X size={18} className={darkMode ? "text-gray-300" : "text-gray-600"} />
          ) : (
            <Search size={18} className={darkMode ? "text-gray-300" : "text-gray-600"} />
          )}
        </button>

        {/* User Controls */}
        {user ? (
          <div className="flex items-center space-x-2">
           
            <a
          href="/events?tab=create"
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${darkMode ? "hover:bg-gray-800/70 text-gray-300 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"}`}
        >
          <CalendarPlus size={18} className="flex-shrink-0" />
         
        </a>
            <a
              href="/dashboard"
              className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} transition-colors`}
            >
              <User size={18} className={darkMode ? "text-gray-300" : "text-gray-600"} />
            </a>

            <button
              onClick={() => setIsModalOpen(true)}
              className={`p-2 rounded-full relative ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} transition-colors`}
            >
              <Bell size={18} className={darkMode ? "text-gray-300" : "text-gray-600"} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <a
              href="/login"
              className={`px-3 py-1.5 text-sm rounded-full ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-50 hover:bg-blue-100 text-blue-600"} transition-colors`}
            >
              Login
            </a>
            <a
              href="/sign-up"
              className={`px-3 py-1.5 text-sm rounded-full border ${darkMode ? "border-blue-600 hover:bg-blue-900/30 text-blue-400" : "border-blue-400 hover:bg-blue-50 text-blue-600"} transition-colors`}
            >
              Sign Up
            </a>
          </div>
        )}
      </div>
    </div>
  </div>
</header>

      {/* Spacer to prevent fixed header from covering content */}
      <div className="h-2" />

      {isModalOpen && <NotificationModal userId={user} onClose={() => setIsModalOpen(false)} />}


      {/* Search Events Content */}
      <div className="max-w-4xl mx-auto rounded-lg shadow-lg mt-10">
        {/* Before Search UI */}
     

        {/* Events List */}
        {searched && events.length > 0 ? (
          <div className="mt-8 space-y-6">
            {events.map((event) => (
              <button
                key={event._id}
                onClick={() => router.push(`/evento/${event._id}`)}
                className="w-full text-left p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition-all"
              >
                <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                <p className="text-md text-gray-400 mt-2">{event.description}</p>
                <p className="text-sm text-gray-500 mt-3">
                  Created by: <span className="text-blue-400">{event.author.username}</span>
                </p>
              </button>
            ))}
          </div>
        ) : (
          searched && !loading && <p className="mt-6 text-gray-400 text-lg text-center">No events found.</p>
        )}
      </div>
    </>
  );
};

export default SearchEvents;