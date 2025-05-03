import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { setSecureCookie } from "../hooks/useUser";
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'; // Added Eye and EyeOff icons

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const router = useRouter();

  // Dynamically load Google script
  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google && window.google.accounts) return;
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    initializeGoogleAuth();
  }, []);

  const handleGoogleLogin = async () => {
    console.log('client id', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
    try {
      setLoading(true);
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: 'profile email',
        callback: async (response) => {
          try {
            console.log('token',response.credential)
            const authResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_SERVER}/auth/google`,
              { token: response.credential }
            );

            setSecureCookie('eventifyUserId', authResponse.data.user._id);
            setSecureCookie('eventifyUsername', authResponse.data.user.username);

            if (authResponse.data.isNewUser) {
              toast.success("Welcome! Your account has been created with Google");
            } else {
              toast.success("Welcome back!");
            }
            
            
            setTimeout(() => router.push("/"), 1500);
          } catch (error) {
            toast.error(
              error.response?.data?.message || "Google login failed. Please try again."
            );
          } finally {
            setLoading(false);
          }
        },
        error_callback: (error) => {
          toast.error("Google login cancelled or failed");
          setLoading(false);
        }
      });
      console.log('client object', client)
      client.requestAccessToken();
    } catch (error) {
      console.log(error)
      toast.error("Failed to initialize Google login");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/login`, 
        formData
      );

      toast.success(response.data.message || "Login successful!");
      setSecureCookie('eventifyUserId', response.data.user._id);
      setSecureCookie('eventifyUsername', response.data.user.username);

      setTimeout(() => router.push("/"), 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center py-6 px-4 bg-gray-900 text-gray-200">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full shadow-2xl rounded-xl overflow-hidden bg-gray-800">
        {/* Left Section: Welcome Message */}
        <div className="bg-gradient-to-br from-blue-900 via-gray-800 to-purple-900 p-8 h-full flex flex-col justify-center">
          <h2 className="lg:text-5xl text-3xl font-extrabold lg:leading-[55px] text-white">
            Welcome Back to{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              PichaZangu
            </span>
          </h2>
          <p className="text-sm mt-6 text-gray-300 leading-relaxed">
            Step into a world of stunning visuals. Sign in to access exclusive event galleries, 
            connect with fellow photographers, and showcase your work to a global audience.
          </p>
          
          <div className="mt-12 bg-gray-800 bg-opacity-30 p-6 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-gray-300">
              New to{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-semibold">
                PichaZangu
              </span>
              ?{" "}
              <a href="/sign-up" className="text-blue-400 font-semibold hover:underline">
                Create an account
              </a>
            </p>
          </div>
        </div>

        {/* Right Section: Login Form */}
        <form onSubmit={handleSubmit} className="p-8 w-full">
          <h3 className="text-white text-2xl font-bold mb-8">Sign in to your account</h3>

          <div className="space-y-5">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border border-gray-600 w-full text-sm text-gray-300 pl-10 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border border-gray-600 w-full text-sm text-gray-300 pl-10 pr-12 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-label="Hide password" />
                  ) : (
                    <Eye size={18} aria-label="Show password" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" 
                  disabled={loading}
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="ml-2 text-gray-300">Remember me</span>
              </label>
              <a href="#" className="text-blue-400 hover:underline text-sm">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 py-3 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : "Sign in"}
          </button>
   {/*
          <div className="my-6 flex items-center gap-4">
            <hr className="w-full border-gray-600" />
            <p className="text-sm text-gray-400">or</p>
            <hr className="w-full border-gray-600" />
          </div>

          <div className="flex justify-center">
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50 w-full"
              disabled={loading}
            >
              <img src="/img/google.svg" alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
          </div> */}
        </form>
      </div>

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
    </div>
  );
};

export default Login;