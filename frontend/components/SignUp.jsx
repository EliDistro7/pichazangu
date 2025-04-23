import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Phone, User, Mail, Lock } from 'lucide-react'; // Added more icons

function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '', // Added phone number field
    password: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Update state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error('Please accept the Terms and Conditions.');
      return;
    }
    try {
      // Call your registration API
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/register`, formData);
      toast.success('Registration successful!');
      router.push('/login'); // Redirect to login page
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="font-sans bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
      <div className="grid md:grid-cols-3 items-center shadow-2xl rounded-xl overflow-hidden bg-gray-800 max-w-5xl w-full">
        {/* Left-side content */}
        <div className="max-md:order-1 flex flex-col justify-center md:space-y-12 space-y-8 max-md:mt-16 min-h-full bg-gradient-to-br from-blue-900 via-gray-800 to-purple-900 lg:px-8 px-4 py-8">
          <div>
            <h2 className="lg:text-5xl text-3xl font-extrabold lg:leading-[55px] text-white">
              Capture & Share Your Vision
            </h2>
            <p className="text-[14px] text-gray-300 mt-4 leading-relaxed">
              Join <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold">PichaZangu</span> and showcase your photography to the world. Share your unique perspective, connect with fellow artists, and grow your audience.
            </p>
          </div>
          <div className="bg-gray-800 bg-opacity-30 p-6 rounded-lg backdrop-blur-sm">
            <h4 className="text-white text-lg font-semibold">Your Platform, Your Art</h4>
            <p className="text-[14px] text-gray-300 mt-3 leading-relaxed">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold">PichaZangu</span> is built for photographers like you. Share your work, get inspired, and be part of a thriving creative community.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 w-full py-8 px-6 sm:px-16 max-md:max-w-xl mx-auto">
          <div className="mb-8">
            <h3 className="text-white text-2xl font-bold">Join <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">PichaZangu</span></h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="text-gray-300 bg-gray-700 border border-gray-600 w-full text-sm p-2.5 pl-10 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Email</label>
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
                  className="text-gray-300 bg-gray-700 border border-gray-600 w-full text-sm p-2.5 pl-10 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="text-gray-300 bg-gray-700 border border-gray-600 w-full text-sm p-2.5 pl-10 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-gray-300 text-sm mb-2 block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="text-gray-300 bg-gray-700 border border-gray-600 w-full text-sm p-2.5 pl-10 pr-10 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center mt-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 shrink-0 text-blue-500 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-3 block text-sm text-gray-300">
                I accept the{' '}
                <a href="#" className="text-blue-400 font-semibold hover:underline">
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full py-3 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              Create Account
            </button>
          </div>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 font-semibold hover:underline">
              Login here
            </a>
          </p>
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
}

export default SignUp