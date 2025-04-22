import React, { useState, useEffect } from "react";
import { getLoggedInUserId } from "hooks/useUser";
import LoginModal from "components/LoginModal";
import { uploadToCloudinary } from "../actions/uploadToCloudinary";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/router";

const EventForm = ({ onSubmit, loggedInUsername, loggedInUserId }) => {
  const router = useRouter();
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    elaborateDescription: "",
    author: { username: loggedInUsername, userId: loggedInUserId },
    coverPhoto: null,
    isPrivate: false,
    password: "",
    visibleOnHomepage: false,
    boosted: false,
  });
  const [selectedCoverPhoto, setSelectedCoverPhoto] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [coverProgress, setCoverProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState([]);
  const [videoProgress, setVideoProgress] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [uploadControllers, setUploadControllers] = useState({}); // Store controllers
  
  useEffect(() => {
    const userId = getLoggedInUserId();
    if (userId) {
      setUser(userId);
    }
  }, []);

  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => URL.revokeObjectURL(image.url));
      selectedVideos.forEach((video) => URL.revokeObjectURL(video.url));
    };
  }, [selectedImages, selectedVideos]);
  
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "author") return;
    setNewEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  const handleCoverPhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewEvent((prev) => ({ ...prev, coverPhoto: file }));
      setSelectedCoverPhoto(URL.createObjectURL(file));
    }
  };
  const handleImageDelete = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const handleVideoDelete = (index) => {
    const updatedVideos = [...selectedVideos];
    updatedVideos.splice(index, 1);
    setSelectedVideos(updatedVideos);
  };

  const handleCancelUpload = (url, type) => {
    if (uploadControllers[url]) {
      uploadControllers[url].abort(); // Abort request
      const updatedControllers = { ...uploadControllers };
      delete updatedControllers[url];
      setUploadControllers(updatedControllers);
    }
  
    if (type === "images") {
      setSelectedImages(selectedImages.filter((image) => image.url !== url));
    } else if (type === "videos") {
      setSelectedVideos(selectedVideos.filter((video) => video.url !== url));
    }
  };
  

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
  
    const newFiles = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      caption: "", 
    }));
  
    if (type === "images") {
      setSelectedImages((prev) => [...prev, ...newFiles]);
    } else if (type === "videos") {
      setSelectedVideos((prev) => [...prev, ...newFiles]);
    }
  };
  
  
  
  
  const handleCaptionChange = (index, type, caption) => {
    if (type === "images") {
      setSelectedImages((prev) => {
        const updated = [...prev];
        updated[index].caption = caption;
        return updated;
      });
    } else if (type === "videos") {
      setSelectedVideos((prev) => {
        const updated = [...prev];
        updated[index].caption = caption;
        return updated;
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("new event", newEvent);
    
    try {
      let coverPhotoUrl = "";
      if (newEvent.coverPhoto) {
        toast.info("Uploading cover photo...");
        const uploadResult = await uploadToCloudinary(newEvent.coverPhoto, (progress) => {
          setCoverProgress(progress);
        });
        coverPhotoUrl = uploadResult.secureUrl;
        toast.success("Cover photo uploaded successfully!");
      }
  
      toast.info("Uploading images...");
      const uploadedImages = await Promise.all(
        selectedImages.map(async (image, index) => {
          const result = await uploadToCloudinary(image.file, (progress) => {
            setImageProgress((prev) => {
              const newProgress = [...prev];
              newProgress[index] = progress;
              return newProgress;
            });
          });
          return { url: result.secureUrl, caption: image.caption };
        })
      );
      toast.success("Images uploaded successfully!");
  
      toast.info("Uploading videos...");
      const uploadedVideos = await Promise.all(
        selectedVideos.map(async (video, index) => {
          const result = await uploadToCloudinary(video.file, (progress) => {
            setVideoProgress((prev) => {
              const newProgress = [...prev];
              newProgress[index] = progress;
              return newProgress;
            });
          });
          return { url: result.secureUrl, caption: video.caption };
        })
      );
      toast.success("Videos uploaded successfully!");
  
      const eventToCreate = {
        title: newEvent.title,
        description: newEvent.description,
        elaborateDescription: newEvent.elaborateDescription,
        author: newEvent.author,
        private: newEvent.isPrivate,
        password: newEvent.isPrivate ? newEvent.password : undefined,
        coverPhoto: coverPhotoUrl,
        imageUrls: uploadedImages,
        videoUrls: uploadedVideos,
        visibleOnHomepage: newEvent.visibleOnHomepage,
        boosted: newEvent.boosted,
      };
  
      await onSubmit(eventToCreate);
      console.log("event to create", eventToCreate);
      toast.success("Event created successfully!");
  
      // **Refresh event data**
      if (refreshEvents) {
        refreshEvents(); // Call the function that refetches events
      }
  
      // **Reset form**
      setNewEvent({
        title: "",
        description: "",
        elaborateDescription: "",
        author: { username: loggedInUsername, userId: loggedInUserId },
        coverPhoto: null,
        isPrivate: false,
        password: "",
        visibleOnHomepage: false,
        boosted: false,
      });
      setSelectedCoverPhoto(null);
      setSelectedImages([]);
      setSelectedVideos([]);
      setCoverProgress(0);
      setImageProgress([]);
      setVideoProgress([]);
    } catch (err) {
      console.error("Error creating event:", err);
      toast.error("Error creating event. Please try again.");
    }
  };
  
  
  
  

  // If no user is logged in, render a Login UI.
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
        <p className="mb-4 text-lg">Login or signup first</p>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/sign-up")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            name="title"
            placeholder="Enter event name"
            value={newEvent.title}
            onChange={handleInputChange}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Cover Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Cover Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverPhotoUpload}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            required
          />
          {selectedCoverPhoto && (
            <div className="mt-2">
              <img
                src={selectedCoverPhoto}
                alt="Cover Photo Preview"
                className="w-40 h-auto rounded-lg border border-gray-700"
              />
              {coverProgress > 0 && coverProgress < 100 && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-700 rounded">
                    <div className="h-full bg-blue-600 rounded" style={{ width: `${coverProgress}%` }}></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{coverProgress}% uploaded</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Event Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Subtitle</label>
          <textarea
            name="description"
            placeholder="Enter event description"
            value={newEvent.description}
            onChange={handleInputChange}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        {/* Elaborate Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Elaborate Description</label>
          <textarea
            name="elaborateDescription"
            placeholder="Enter detailed description (optional)"
            value={newEvent.elaborateDescription}
            onChange={handleInputChange}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        {/* Private Event Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isPrivate"
            checked={newEvent.isPrivate}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 border-gray-700 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-gray-300">Private Event</label>
        </div>

        {/* Password Field (Conditional) */}
        {newEvent.isPrivate && (
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Set password for private event"
                value={newEvent.password}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2 flex items-center"
              >
                {showPassword ? (
                  <EyeOff size={20} className="text-gray-400" />
                ) : (
                  <Eye size={20} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Visible on Homepage Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="visibleOnHomepage"
            checked={newEvent.visibleOnHomepage}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 border-gray-700 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-gray-300">Visible on Homepage</label>
        </div>

       
            {/* Image Upload */}
            <div>
        <label className="block text-sm font-medium text-gray-300">Upload Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileUpload(e, "images")}
          className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        {selectedImages.length > 0 && (
          <div className="mt-2 space-y-2">
          {selectedImages.map((image, index) => (
  <div key={index} className="flex items-center space-x-4">
    <img src={image.url} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-gray-700" />
    <div className="flex-1">
      <input
        type="text"
        placeholder="Add caption..."
        value={image.caption}
        onChange={(e) => handleCaptionChange(index, "images", e.target.value)}
        className="w-full p-2 text-sm bg-gray-800 border border-gray-600 rounded-md text-white"
      />
      <div className="h-2 bg-gray-700 rounded mt-1">
        <div className="h-full bg-blue-600 rounded" style={{ width: `${imageProgress[index]}%` }}></div>
      </div>
      <p className="text-sm text-gray-400 mt-1">{imageProgress[index]}% uploaded</p>
    </div>
    <button
      onClick={() => handleCancelUpload(image.url, "images")}
      className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
    >
      Cancel
    </button>
  </div>
))}

          </div>
        )}
      </div>

      {/* Video Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300">Upload Videos</label>
        <input
          type="file"
          multiple
          accept="video/*"
          onChange={(e) => handleFileUpload(e, "videos")}
          className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        {selectedVideos.length > 0 && (
          <div className="mt-2 space-y-2">
           {selectedVideos.map((video, index) => (
  <div key={index} className="flex items-center space-x-4">
    <video src={video.url} controls className="w-24 h-16 rounded-lg border border-gray-700" />
    <div className="flex-1">
      <input
        type="text"
        placeholder="Add caption..."
        value={video.caption}
        onChange={(e) => handleCaptionChange(index, "videos", e.target.value)}
        className="w-full p-2 text-sm bg-gray-800 border border-gray-600 rounded-md text-white"
      />
      <div className="h-2 bg-gray-700 rounded mt-1">
        <div className="h-full bg-blue-600 rounded" style={{ width: `${videoProgress[index]}%` }}></div>
      </div>
      <p className="text-sm text-gray-400 mt-1">{videoProgress[index]}% uploaded</p>
    </div>
    <button
      onClick={() => handleCancelUpload(video.url, "videos")}
      className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
    >
      Cancel
    </button>
  </div>
))}

          </div>
        )}
      </div>


        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Create Event
        </button>
      </form>
    </>
  );
};

export default EventForm;