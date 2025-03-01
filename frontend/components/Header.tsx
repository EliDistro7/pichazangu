import { useState, useEffect } from "react";
import {
  Search,
  User,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Bell,
  Camera,
  CalendarPlus,
} from "lucide-react";
import { getLoggedInUserId } from "hooks/useUser";

export default function Header() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false); // State to toggle search bar
 useEffect( ()=>{
    
  const user1 = getLoggedInUserId();
  if(user1){
    console.log('user is logged in', user1)
    setUser(true)
  }else{
    setUser(false)
  }
  // Replace this with actual API call to fetch user data
 },[]) 
 

  return (
    <>
      <header
        className={`${
          darkMode
            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white backdrop-blur-lg font-sans"
            : "bg-gradient-to-r from-white via-gray-100 to-white shadow-md text-gray-900"
        } fixed w-full top-0 left-0 z-40 sm:z-50 p-4 transition-all duration-300`}
      >
        {/* Top Row - Brand Name and Search Icon */}
        <div className="flex justify-between items-center">
          {/* Brand Name */}
        

<a
  href="/"
  className="text-2xl sm:text-3xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-600 transition-all duration-500 flex items-center gap-2"
>
  <Camera size={28} className="text-purple-500 font-bold" /> {/* Icon added here */}
  pichazangu
</a>

          {/* Search Icon (Toggles Search Bar) */}
          <button
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-800/70 transition-colors duration-300"
          >
            <Search size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Expanded Search Bar (Conditional Rendering) */}
      {/* Expanded Search Bar (Conditional Rendering) */}
{isSearchExpanded && (
  <div className="absolute left-0 top-full mt-2 w-full flex items-center bg-gray-800/60 px-4 py-2 rounded-full transition-all duration-300">
    <Search size={20} className="text-gray-400" />
    <input
      type="text"
      placeholder="Search..."
      className="ml-2 bg-transparent outline-none text-white placeholder-gray-400 flex-1"
    />
  </div>
)}

        {/* Second Row - Centered Icons */}
        <div className="flex justify-center items-center mt-3 space-x-3">
          {/* New Event Icon */}
          <a
            href="/events"
            className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors duration-300"
          >
            <CalendarPlus size={22} className="text-blue-400" />
            <span className="hidden md:inline ml-2 text-blue-400">New Event</span>
          </a>

          {/* Notifications Icon */}
          <a
            href="/#"
            className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors duration-300"
          >
            <Bell size={22} className="text-blue-400" />
            <span className="hidden md:inline ml-2 text-blue-400">Notifications</span>
          </a>

          {/* User Auth UI */}
          {user ? (
            <>
              {/* Dashboard */}
              <a
                href="/dashboard"
                className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors duration-300"
              >
                <LayoutDashboard size={22} className="text-blue-400" />
                <span className="hidden md:inline ml-2 text-blue-400">Dashboard</span>
              </a>

              {/* Profile */}
              <a
                href="#"
                className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors duration-300"
              >
                <User size={22} className="text-blue-400" />
                <span className="hidden md:inline ml-2 text-blue-400">Profile</span>
              </a>
            </>
          ) : (
            <>
              {/* Login */}
              <a
                href="/login"
                className="flex items-center p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
              >
                <LogIn size={20} />
                <span className="hidden md:inline ml-2">Login</span>
              </a>

              {/* Signup */}
              <a
                href="/sign-up"
                className="flex items-center p-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300"
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
    </>
  );
}