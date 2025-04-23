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
      <header className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${darkMode ? "bg-gray-900/95 backdrop-blur-lg border-b border-gray-800" : "bg-white/95 backdrop-blur-lg border-b border-gray-200"}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Name */}
            <div className="flex items-center">
              <a href="/" className="flex items-center group">
                <div className="relative h-9 w-9 overflow-hidden rounded-lg group-hover:scale-105 transition-all duration-300">
                  <svg 
                    className="opacity-90 group-hover:opacity-100 transition-all duration-300"
                    viewBox="0 0 100 100" 
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="pGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" /> {/* blue-500 */}
                        <stop offset="70%" stopColor="#8B5CF6" /> {/* violet-500 */}
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    
                    {/* Outer P shape with extended tail */}
                    <path
                      d="M30 15
                      C45 0 55 0 70 15
                      C85 30 85 50 70 65
                      C55 80 45 80 30 65
                      V110
                      H20
                      V10
                      H30
                      V15
                      Z"
                      fill="url(#pGradient)"
                      filter="url(#glow)"
                      strokeWidth="0"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-semibold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-blue-400 transition-colors">
                  Pichazangu
                </span>
              </a>
            </div>
  
            {/* Right Side Controls */}
            <div className="flex items-center space-x-1 md:space-x-3">
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
                    <div className={`relative flex items-center ${darkMode ? "bg-gray-800/80" : "bg-gray-100/80"} rounded-full pl-4 pr-2 h-10 border ${darkMode ? "border-gray-700" : "border-gray-200"} transition-all duration-300 focus-within:ring-2 ${darkMode ? "focus-within:ring-blue-500/40" : "focus-within:ring-blue-500/30"}`}>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Search albums..."
                        className={`w-full bg-transparent outline-none text-sm ${darkMode ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-400"}`}
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className={`ml-2 p-1.5 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} transition-colors`}
                        aria-label="Submit search"
                      >
                        {loading ? (
                          <Loader2 size={16} className="animate-spin text-blue-400" />
                        ) : (
                          <Search size={16} className={`${darkMode ? "text-blue-400" : "text-blue-500"}`} />
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
  
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full transition-all ${darkMode ? "hover:bg-gray-800/70 text-gray-300 hover:text-blue-400" : "hover:bg-gray-100 text-gray-600 hover:text-blue-500"}`}
                aria-label="Search"
              >
                {isSearchOpen ? (
                  <X size={16} className="transition-transform duration-200 transform hover:rotate-90" />
                ) : (
                  <Search size={16} />
                )}
              </button>
  
              {/* User Controls */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <a
                    href="/events?tab=create"
                    className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                      darkMode 
                        ? "bg-gray-800/70 hover:bg-gray-700 text-gray-300 hover:text-white" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    <CalendarPlus size={14} className="flex-shrink-0" />
                    <span className="hidden md:inline">Create</span>
                  </a>
                  
                  <div className="flex items-center space-x-1">
                    <a
                      href="/dashboard"
                      className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-800/70 text-gray-300 hover:text-blue-400" : "hover:bg-gray-100 text-gray-600 hover:text-blue-500"} transition-all`}
                      aria-label="Dashboard"
                    >
                      <User size={16} />
                    </a>
  
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className={`p-2 rounded-full relative ${darkMode ? "hover:bg-gray-800/70 text-gray-300 hover:text-blue-400" : "hover:bg-gray-100 text-gray-600 hover:text-blue-500"} transition-all`}
                      aria-label="Notifications"
                    >
                      <Bell size={16} />
                      {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                          {notificationCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <a
                    href="/login"
                    className={`px-4 py-1.5 text-sm font-medium rounded-full ${
                      darkMode 
                        ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white" 
                        : "bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white"
                    } transition-all shadow-sm hover:shadow`}
                  >
                    Login
                  </a>
                  <a
                    href="/sign-up"
                    className={`px-4 py-1.5 text-sm font-medium rounded-full border ${
                      darkMode 
                        ? "border-gray-700 hover:border-blue-500/50 bg-gray-900/50 hover:bg-gray-800/70 text-gray-300" 
                        : "border-gray-300 hover:border-blue-400/50 bg-white hover:bg-gray-50 text-gray-700"
                    } transition-all`}
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
      <div className="h-8" />
  
      {isModalOpen && <NotificationModal userId={user} onClose={() => setIsModalOpen(false)} />}
  
      {/* Search Events Content */}
      <div className="max-w-4xl mx-auto rounded-lg shadow-lg mt-10">
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