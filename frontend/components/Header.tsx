import { useState, useEffect } from "react";
import {
  User,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Bell,
  Camera,
  CalendarPlus,
  MessageCircle,
  Home,
} from "lucide-react";
import { getLoggedInUserId } from "hooks/useUser";

export default function Header() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user1 = getLoggedInUserId();
    if (user1) {
      console.log("user is logged in", user1);
      setUser(user1);
    } else {
      console.log('it did not get user from cookies')
      setUser(false);
    }
  }, []);

  return (
    <>
      <header
        className={`${
          darkMode
            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white backdrop-blur-lg font-sans"
            : "bg-gradient-to-r from-white via-gray-100 to-white shadow-md text-gray-900"
        }  w-full  sm:z-50 p-4 transition-all duration-300`}
      >
        {/* Top Row - Brand Name and Home Icon */}
        <div className="flex justify-between items-center">
          {/* Brand Name with Home Icon */}
          <a
            href="/"
            className="text-2xl sm:text-3xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-600 transition-all duration-500 flex items-center gap-2"
          >
            <Camera size={28} className="text-purple-500 font-bold" />{" "}
            {/* Home Icon */}
            pichazangu
          </a>
        </div>

        {/* Second Row - Centered Icons */}
        <div className="flex justify-center items-center mt-3 space-x-3">
            {/* Home */}
            <a
            href="/"
            className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors duration-300"
          >
            <Home size={22} className="text-blue-400" />
            <span className="hidden md:inline ml-2 text-blue-400">Home</span>
          </a>
          {/* New Event Icon */}
          <a
            href="/events?tab=create"
            className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors duration-300"
          >
            <CalendarPlus size={22} className="text-blue-400" />
            <span className="hidden md:inline ml-2 text-blue-400">New Album</span>
          </a>

          {/* Conditional Rendering for Notifications and Messages */}
          {user ? (
            <>
              {/* Notifications Icon */}
              <a
                href="/notifications"
                className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors duration-300"
              >
                <Bell size={22} className="text-blue-400" />
                <span className="hidden md:inline ml-2 text-blue-400">
                  Notifications
                </span>
              </a>

              {/* Messages Icon */}
              <a
                href="/messages"
                className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors duration-300"
              >
                <MessageCircle size={22} className="text-blue-400" />
                <span className="hidden md:inline ml-2 text-blue-400">Messages</span>
              </a>
            </>
          ) : (
            <>
              {/* Login Icon */}
              <a
                href="/login"
                className="flex items-center p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
              >
                <LogIn size={20} />
                <span className="hidden md:inline ml-2">Login</span>
              </a>

              {/* Signup Icon */}
              <a
                href="/sign-up"
                className="flex items-center p-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300"
              >
                <UserPlus size={20} />
                <span className="hidden md:inline ml-2">Signup</span>
              </a>
            </>
          )}

          {/* Dashboard and Profile Icons (Conditional Rendering) */}
          {user && (
            <>
              {/* Dashboard Icon */}
              <a
                href="/dashboard"
                className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors duration-300"
              >
                <LayoutDashboard size={22} className="text-blue-400" />
                <span className="hidden md:inline ml-2 text-blue-400">Dashboard</span>
              </a>

              {/* Profile Icon */}
              <a
                href="/profile"
                className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors duration-300"
              >
                <User size={22} className="text-blue-400" />
                <span className="hidden md:inline ml-2 text-blue-400">Profile</span>
              </a>
            </>
          )}
        </div>
      </header>
      {/* Spacer to prevent <div className="h-32" /> fixed header from covering content */}
      
    </>
  );
}