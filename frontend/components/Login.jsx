import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import {setSecureCookie} from "../hooks/useUser";


const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter()

  // Update state when inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post login credentials to the server
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/login`, formData);
      toast.success(response.data.message || "Login successf!");


      //console.log("id",response.data )
      // Set secure cookies with user data

      setSecureCookie('eventifyUserId', response.data.user._id);
      setSecureCookie('eventifyUsername', response.data.user.username);
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/");
      }, 1500);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center py-6 px-4 bg-gray-900 text-gray-200">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
        {/* Left Section: Welcome Message */}
        <div>
          <h2 className="lg:text-5xl text-3xl font-extrabold lg:leading-[55px] text-white">
            Welcome Back to{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              PichaZangu
            </span>{" "}
            Store
          </h2>
          <p className="text-sm mt-6 text-gray-400">
            Step into a world of stunning visuals. Sign in to access exclusive event galleries, connect with fellow photographers, and showcase your work to a global audience.
          </p>
          <p className="text-sm mt-12 text-gray-400">
            New to{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-semibold">
              PichaZangu
            </span>
            ?{" "}
            <a href="/sign-up" className="text-blue-500 font-semibold hover:underline ml-1">
              Create an account
            </a>
          </p>
        </div>
  
        {/* Right Section: Login Form */}
        <form onSubmit={handleSubmit} className="max-w-md md:ml-auto w-full bg-gray-800 p-6 rounded-lg shadow-xl">
          <h3 className="text-white text-3xl font-extrabold mb-8">Sign in</h3>
  
          <div className="space-y-4">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-gray-700 w-full text-sm text-gray-200 px-4 py-3.5 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email address"
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-gray-700 w-full text-sm text-gray-200 px-4 py-3.5 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm">
                <input type="checkbox" className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded" />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="#" className="text-blue-500 hover:underline text-sm">
                Forgot your password?
              </a>
            </div>
          </div>
  
          <button
            type="submit"
            className="w-full mt-6 py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log in
          </button>
  
          <div className="my-6 flex items-center gap-4">
            <hr className="w-full border-gray-600" />
            <p className="text-sm text-gray-400">or</p>
            <hr className="w-full border-gray-600" />
          </div>
  
          <div className="flex justify-center space-x-6">
            <button type="button" className="border-none outline-none">
              <img src="/google-icon.svg" alt="Google" className="w-8" />
            </button>
            <button type="button" className="border-none outline-none">
              <img src="/facebook-icon.svg" alt="Facebook" className="w-8" />
            </button>
            <button type="button" className="border-none outline-none">
              <img src="/apple-icon.svg" alt="Apple" className="w-8" />
            </button>
          </div>
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
