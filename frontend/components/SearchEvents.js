import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Search,
  Loader2,
  User,
  Bell,
  CalendarPlus,
  X
} from "lucide-react";
import { searchEvents } from "actions/event";
import { getLoggedInUserId } from "hooks/useUser";
import socket from "hooks/socket";
import { getNotifications } from "actions/notifications";
import NotificationModal from "./NotificationModal";

const SearchEvents = () => {
  const router = useRouter();
  
  // Search states
  const [username, setUsername] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // User states
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user and notification data on component mount
  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      try {
        const userId = await getLoggedInUserId();
        
        if (userId) {
          setUser(userId);
          
          // Fetch notifications
          try {
            const notifications = await getNotifications(userId);
            const unreadCount = notifications.filter(n => !n.read).length;
            setNotificationCount(unreadCount);
          } catch (error) {
            console.error("Error fetching notifications:", error);
          }
          
          // Set up socket listeners for real-time notifications
          setupSocketListeners();
        } else {
          setUser(false);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    
    fetchUserAndNotifications();
    
    // Cleanup socket listeners on component unmount
    return () => cleanupSocketListeners();
  }, []);
  
  // Socket setup and cleanup functions
  const setupSocketListeners = () => {
    socket.on("new_message", () => {
      setNotificationCount(prevCount => prevCount + 1);
    });
    
    socket.on("view_event", () => {
      setNotificationCount(prevCount => prevCount + 1);
    });
  };
  
  const cleanupSocketListeners = () => {
    socket.off("new_message");
    socket.off("view_event");
  };

  // Handle search form submission
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    // Validate input
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }

    // Set loading state and clear previous errors
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      // Execute search and update state with results
      const response = await searchEvents(username);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.response?.data?.error || "Failed to fetch events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  // SearchBar component
  const SearchBar = () => (
    <div className={`relative transition-all duration-300 ${isSearchOpen ? "w-48 md:w-64" : "w-0 opacity-0"}`}>
      {isSearchOpen && (
        <div className="absolute right-0 top-0">
          <div className={`relative flex items-center ${
            darkMode ? "bg-gray-800/80 border-gray-700 focus-within:ring-blue-500/40" : 
                    "bg-gray-100/80 border-gray-200 focus-within:ring-blue-500/30"
          } rounded-full pl-4 pr-2 h-10 border transition-all duration-300 focus-within:ring-2`}>
            <input
              type="text"
              value={username}
              onChange={handleInputChange}
              placeholder="Search albums..."
              className={`w-full bg-transparent outline-none text-sm ${
                darkMode ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-400"
              }`}
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`ml-2 p-1.5 rounded-full ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              } transition-colors`}
              aria-label="Submit search"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin text-blue-400" />
              ) : (
                <Search size={16} className={darkMode ? "text-blue-400" : "text-blue-500"} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Header Navigation */}
      <header className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        darkMode ? "bg-gray-900/95 backdrop-blur-lg border-b border-gray-800" : "bg-white/95 backdrop-blur-lg border-b border-gray-200"
      }`}>
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
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="70%" stopColor="#8B5CF6" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
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
              <SearchBar />
  
              {/* Search Toggle Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full transition-all ${
                  darkMode ? "hover:bg-gray-800/70 text-gray-300 hover:text-blue-400" : 
                            "hover:bg-gray-100 text-gray-600 hover:text-blue-500"
                }`}
                aria-label="Search"
              >
                {isSearchOpen ? (
                  <X size={16} className="transition-transform duration-200 transform hover:rotate-90" />
                ) : (
                  <Search size={16} />
                )}
              </button>
  
              {/* User Controls - Conditional Rendering */}
              {user ? (
                <div className="flex items-center space-x-2">
                  {/* Create Button */}
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
                  
                  {/* User and Notification Icons */}
                  <div className="flex items-center space-x-1">
                    <a
                      href="/dashboard"
                      className={`p-2 rounded-full ${
                        darkMode ? "hover:bg-gray-800/70 text-gray-300 hover:text-blue-400" : 
                                  "hover:bg-gray-100 text-gray-600 hover:text-blue-500"
                      } transition-all`}
                      aria-label="Dashboard"
                    >
                      <User size={16} />
                    </a>
  
                    {/* Notifications with Badge */}
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className={`p-2 rounded-full relative ${
                        darkMode ? "hover:bg-gray-800/70 text-gray-300 hover:text-blue-400" : 
                                  "hover:bg-gray-100 text-gray-600 hover:text-blue-500"
                      } transition-all`}
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
                  {/* Login Button */}
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
                  
                  {/* Sign Up Button */}
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
      <div className="h-16" />
  
      {/* Notification Modal */}
      {isModalOpen && <NotificationModal userId={user} onClose={() => setIsModalOpen(false)} />}
  
      {/* Search Results */}
      <div className="container max-w-4xl mx-auto px-4 pt-8">
        {/* Display error message if there is one */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
        {/* Search Results Content */}
        <div className="rounded-lg shadow-lg">
          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 size={32} className="animate-spin text-blue-500" />
            </div>
          )}
          
          {/* Events List */}
          {searched && !loading && events.length > 0 ? (
            <div className="space-y-4">
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
            searched && !loading && (
              <p className="py-8 text-gray-400 text-lg text-center">No events found.</p>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default SearchEvents;