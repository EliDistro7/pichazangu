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

const SearchEvents = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false); // Tracks if a search has been made
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Toggle search form

  // Header Logic
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user1 = await getLoggedInUserId();
      console.log("User ID from getLoggedInUserId:", user1); // Debugging
      if (user1) {
        console.log("User is logged in:", user1);
        setUser(user1);
      } else {
        console.log("No user found in cookies");
        setUser(false);
      }
    };

    fetchUser();
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
      {/* Header */}
      <header
        className={`${
          darkMode
            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white backdrop-blur-lg font-sans"
            : "bg-gradient-to-r from-white via-gray-100 to-white shadow-md text-gray-900"
        } fixed w-full top-0 left-0 z-50 transition-all duration-300`}
      >
        {/* Top Row - Brand Name and Search Icon */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          {/* Brand Name */}
          <a
            href="/"
            className="text-2xl sm:text-3xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-600 transition-all duration-500 flex items-center gap-2"
          >
            <Camera size={28} className="text-purple-500 font-bold" />
            pichazangu
          </a>

          {/* Search Icon */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors"
          >
            {isSearchOpen ? (
              <X size={20} className="text-gray-400" />
            ) : (
              <Search size={20} className="text-gray-400" />
            )}
          </button>
        </div>

        {/* Search Form (Conditional Rendering) */}
        {isSearchOpen && (
          <div className="p-4 border-b border-gray-700">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex items-center space-x-4"
            >
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Search albums and events..."
                className="flex-1 p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        )}

        {/* Second Row - Navigation Icons */}
        <div className="flex justify-center items-center p-4 space-x-4">
          {/* Home */}
          <a
            href="/"
            className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors"
            title="Home"
          >
            <Home size={22} className="text-blue-400" />
            <span className="hidden md:inline ml-2 text-blue-400">Home</span>
          </a>

          {/* New Album */}
          <a
            href="/events?tab=create"
            className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors"
            title="New Album"
          >
            <CalendarPlus size={22} className="text-blue-400" />
            <span className="hidden md:inline ml-2 text-blue-400">New Album</span>
          </a>

          {/* Conditional Rendering for Notifications and Messages */}
          {user ? (
            <>
              {/* Notifications 
              <a
                href="/notifications"
                className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors"
                title="Notifications"
              >
                <Bell size={22} className="text-blue-400" />
                <span className="hidden md:inline ml-2 text-blue-400">
                  Notifications
                </span>
              </a>

             
              <a
                href="/messages"
                className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors"
                title="Messages"
              >
                <MessageCircle size={22} className="text-blue-400" />
                <span className="hidden md:inline ml-2 text-blue-400">Messages</span>
              </a>

              */}

              {/* My Profile */}
              <a
                href="/dashboard"
                className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors"
                title="My Profile"
              >
                <User size={22} className="text-blue-400" />
                <span className="hidden md:inline ml-2 text-blue-400">My Profile</span>
              </a>
            </>
          ) : (
            <>
              {/* Login */}
              <a
                href="/login"
                className="flex items-center p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                title="Login"
              >
                <LogIn size={20} />
                <span className="hidden md:inline ml-2">Login</span>
              </a>

              {/* Signup */}
              <a
                href="/sign-up"
                className="flex items-center p-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                title="Signup"
              >
                <UserPlus size={20} />
                <span className="hidden md:inline ml-2">Signup</span>
              </a>
            </>
          )}
        </div>
      </header>

      {/* Spacer to prevent fixed header from covering content */}
      <div className="h-32" />

      {/* Search Events Content */}
      <div className="max-w-4xl mx-auto rounded-lg shadow-lg mt-20">
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