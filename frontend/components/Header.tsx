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
    console.log('useEffect is runnning')
    const user1 = getLoggedInUserId();
    console.log(user1);
    if (user1) {
      console.log("user is logged in", user1);
      setUser(user1);
    } else {
      console.log("it did not get user from cookies");
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
        } fixed w-full top-0 left-0 z-50 p-4 transition-all duration-300`}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Brand Name with Home Icon */}
          <a
            href="/"
            className="text-2xl sm:text-3xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-600 transition-all duration-500 flex items-center gap-2"
          >
            <Camera size={28} className="text-purple-500 font-bold" />
            pichazangu
          </a>

          {/* Navigation Icons */}
          <nav className="flex items-center space-x-4">
            {/* Home */}
            <a
              href="/"
              className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors duration-300"
              title="Home"
            >
              <Home size={22} className="text-blue-400" />
              <span className="hidden md:inline ml-2 text-blue-400">Home</span>
            </a>

            {/* New Album */}
            <a
              href="/events?tab=create"
              className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors duration-300"
              title="New Album"
            >
              <CalendarPlus size={22} className="text-blue-400" />
              <span className="hidden md:inline ml-2 text-blue-400">New Album</span>
            </a>

            {/* Conditional Rendering for Notifications and Messages */}
            {user ? (
              <>
                {/* Notifications */}
                <a
                  href="/notifications"
                  className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors duration-300"
                  title="Notifications"
                >
                  <Bell size={22} className="text-blue-400" />
                  <span className="hidden md:inline ml-2 text-blue-400">
                    Notifications
                  </span>
                </a>

                {/* Messages */}
                <a
                  href="/messages"
                  className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors duration-300"
                  title="Messages"
                >
                  <MessageCircle size={22} className="text-blue-400" />
                  <span className="hidden md:inline ml-2 text-blue-400">Messages</span>
                </a>

                {/* My Profile */}
                <a
                  href="/dashboard"
                  className="flex items-center p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors duration-300"
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
                  className="flex items-center p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
                  title="Login"
                >
                  <LogIn size={20} />
                  <span className="hidden md:inline ml-2">Login</span>
                </a>

                {/* Signup */}
                <a
                  href="/sign-up"
                  className="flex items-center p-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300"
                  title="Signup"
                >
                  <UserPlus size={20} />
                  <span className="hidden md:inline ml-2">Signup</span>
                </a>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Spacer to prevent fixed header from covering content */}
      <div className="h-20" />
    </>
  );
}