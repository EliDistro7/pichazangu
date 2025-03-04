import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { Eye, EyeOff } from 'lucide-react'; // Import eye icons for password toggle

function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

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
    <div className="font-sans bg-gray-900 text-white max-w-4xl flex items-center mx-auto md:h-screen p-4">
      <div className="grid md:grid-cols-3 items-center shadow-lg rounded-xl overflow-hidden bg-gray-800">
        {/* Left-side content */}
        <div className="max-md:order-1 flex flex-col justify-center md:space-y-16 space-y-8 max-md:mt-16 min-h-full bg-gradient-to-r from-gray-800 to-gray-700 lg:px-8 px-4 py-4">
          <div>
            <h2 className="lg:text-5xl text-3xl font-extrabold lg:leading-[55px] text-white">
              Capture & Share Your Vision
            </h2>
            <p className="text-[13px] text-gray-300 mt-3 leading-relaxed">
              Join <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold">PichaZangu</span> and showcase your photography to the world. Share your unique perspective, connect with fellow artists, and grow your audience.
            </p>
          </div>
          <div>
            <h4 className="text-white text-lg">Your Platform, Your Art</h4>
            <p className="text-[13px] text-gray-300 mt-3 leading-relaxed">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold">PichaZangu</span> is built for photographers like you. Share your work, get inspired, and be part of a thriving creative community.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 w-full py-6 px-6 sm:px-16 max-md:max-w-xl mx-auto">
          <div className="mb-6">
            <h3 className="text-white text-xl font-bold">Join <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">PichaZangu</span></h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="text-gray-300 bg-gray-700 border border-gray-600 w-full text-sm p-2.5 rounded-md focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="text-gray-300 bg-gray-700 border border-gray-600 w-full text-sm p-2.5 rounded-md focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="relative">
              <label className="text-gray-300 text-sm mb-2 block">Password</label>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'} // Toggle password visibility
                value={formData.password}
                onChange={handleChange}
                required
                className="text-gray-300 bg-gray-700 border border-gray-600 w-full text-sm p-2.5 rounded-md focus:ring-blue-500 pr-10"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 mt-6"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 shrink-0 text-blue-500 border-gray-600 rounded"
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
              className="w-full py-2.5 px-4 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Sign Up
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

export default SignUp;