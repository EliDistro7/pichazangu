import { useState } from "react";
import { 
  Search, 
  User, 
  LogIn, 
  UserPlus, 
  LayoutDashboard, 
  Moon, 
  Sun, 
  Bell, 
  CalendarPlus 
} from "lucide-react";

export default function Header() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null); // Simulate login state

  return (
    <>
      <header
        className={`${
          darkMode
            ? "bg-gray-900/90 text-white backdrop-blur-lg font-sans" 
            : "bg-white shadow-md text-gray-900"
        } fixed w-full top-0 left-0 z-40 sm:z-50 p-3 transition-all duration-300`}
      >
        {/* Top Row - Brand Name & Theme Toggle */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="/" className=" text-blue-500 text-xl font-bold tracking-wide sm:text-2xl px-2 py-1 rounded-full">
  Eventify
</a>


          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300"
          >
            {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
          </button>
        </div>

        {/* Bottom Row - Search & Icons */}
        <div className="flex flex-wrap justify-between items-center mt-2 gap-2">
          {/* Search Bar */}
          <div className="flex items-center bg-gray-800/60 px-3 py-1 rounded-full w-full max-w-xs flex-grow">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="ml-2 bg-transparent outline-none text-white placeholder-gray-400 w-full"
            />
          </div>

          {/* Right-side Icons */}
          <div className="w-full sm:w-auto flex justify-center sm:justify-end items-center space-x-2">
            {/* New Event Icon */}
            <a
              href="/events"
              className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition"
            >
              <CalendarPlus size={20} />
              <span className="hidden md:inline ml-2">New Event</span>
            </a>

            {/* Notifications Icon */}
            <a
              href="/notifications"
              className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition"
            >
              <Bell size={20} />
              <span className="hidden md:inline ml-2">Notifications</span>
            </a>

            {/* User Auth UI */}
            {user ? (
              <>
                {/* Dashboard */}
                <a
                  href="/dashboard"
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition"
                >
                  <LayoutDashboard size={20} />
                </a>

                {/* Profile */}
                <a
                  href="/profile"
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition"
                >
                  <User size={20} />
                </a>
              </>
            ) : (
              <>
                {/* Login */}
                <a
                  href="/login"
                  className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  <LogIn size={18} />
                </a>

                {/* Signup */}
                <a
                  href="/signup"
                  className="p-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                >
                  <UserPlus size={18} />
                </a>
              </>
            )}
          </div>
        </div>
      </header>
      {/* Spacer to prevent fixed header from covering content */}
      <div className="h-32" />
    </>
  );
}
