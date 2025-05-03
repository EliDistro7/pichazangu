import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import EventHead from "components/EventHead";
import CoverPhotoBanner from "components/CoverPhotoBanner";
import MediaUpload from "components/MediaUpload";
import MediaGallery from "components/MediaGallery";
import MessageModal from "components/MessageModal2";
import LoadingSpinner from "components/LoadingSpinner";
import { getEventById, updateEventCoverPhoto, updateEventMedia, addViewToEvent, authenticateEvent } from "actions/event";
import { getLoggedInUserId, getLoggedInUsername } from "hooks/useUser";
import { uploadToCloudinary } from "actions/uploadToCloudinary";
import { useLastViewedPhoto } from "utils/useLastViewedPhoto";
import socket from "hooks/socket";
import SearchEvents from "components/SearchEvents";
import { ArrowLeft } from "lucide-react";
import PasswordModal from "components/PasswordModal2";

const EventDetails = ({ initialEvent }) => {
  const [event, setEvent] = useState(initialEvent);
  const [activeTab, setActiveTab] = useState("photo");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [loggedInUserId, setLoggedUserId] = useState(null);
  const [logggedInUsername, setLogggedInUsername] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const router = useRouter();
  const { token } = router.query;
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const lastViewedPhotoRef = useRef(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(initialEvent.private);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Token validation effect
  useEffect(() => {
    if (token) {
      axios
        .post(`${process.env.NEXT_PUBLIC_SERVER}/validate-token`, { eventId: event._id, token })
        .then((res) => {
          if (res.data.valid) {
            setIsTokenValid(true);
            // Set admin ID as the logged user ID for token users
            setLoggedUserId(process.env.NEXT_PUBLIC_ADMIN_ID);
            setLogggedInUsername("Token User");
            toast.success("Token verified! You now have upload access.", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          } else {
            toast.error("Invalid token! Upload access denied.", {
              position: "top-center"
            });
          }
        })
        .catch((err) => {
          console.error("Token validation failed:", err);
          toast.warn("Invalid Token provided.", {
            position: "top-center"
          });
        });
    }
  }, [token, event._id]);

  // Set logged in user data
  useEffect(() => {
    // Only set if not already set by token validation
    if (!isTokenValid) {
      let logged = getLoggedInUserId();
      if (logged) {
        setLoggedUserId(logged);
        setLogggedInUsername(getLoggedInUsername());
      }
    }
    
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto, isTokenValid]);

  // Track event views
  useEffect(() => {
    const localStorageKey = "viewedEvents";
    let viewedEvents = JSON.parse(localStorage.getItem(localStorageKey)) || {};
    const userKey = loggedInUserId || "guest";
    
    if (viewedEvents[userKey]?.includes(initialEvent._id)) return;
    
    addViewToEvent({ 
      eventId: initialEvent._id, 
      userId: initialEvent.author.userId, 
      senderName: logggedInUsername || "guest", 
      socket 
    })
      .then(() => {
        viewedEvents[userKey] = [...(viewedEvents[userKey] || []), initialEvent._id];
        localStorage.setItem(localStorageKey, JSON.stringify(viewedEvents));
      })
      .catch((error) => {
        console.error("Error adding event view:", error);
      });
  }, [initialEvent._id, loggedInUserId, logggedInUsername, initialEvent.author.userId]);

  // Handle route changes
  useEffect(() => {
    const handleRouteChangeStart = () => setIsMediaLoading(true);
    const handleRouteChangeComplete = () => setIsMediaLoading(false);
    
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeComplete);
    
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeComplete);
    };
  }, [router.events]);

  const handleCoverPhotoUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const { secureUrl } = await uploadToCloudinary(file, (progress) => setUploadProgress(progress));
      
      // Use the appropriate user ID (logged in or admin from token)
      const userId = isTokenValid ? process.env.NEXT_PUBLIC_ADMIN_ID : loggedInUserId;
      
      await updateEventCoverPhoto({ 
        eventId: event._id, 
        newCoverPhoto: secureUrl, 
        userId: userId 
      });
      
      setEvent((prevEvent) => ({ ...prevEvent, coverPhoto: secureUrl }));
      toast.success("Cover photo updated successfully", {
        position: "top-center"
      });
    } catch (error) {
      console.error("Error uploading cover photo:", error);
      toast.error("Error uploading cover photo", {
        position: "top-center"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setCaptions(new Array(files.length).fill(""));
    setSelectedType(type);
  };

  const handleCaptionChange = (e, index) => {
    const newCaptions = [...captions];
    newCaptions[index] = e.target.value;
    setCaptions(newCaptions);
  };

  const handleMediaUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadResults = await Promise.all(
        selectedFiles.map((file) => 
          uploadToCloudinary(file, (progress) => setUploadProgress(progress))
        )
      );
      
      const uploadedMedia = uploadResults.map((result, index) => ({ 
        url: result.secureUrl, 
        caption: captions[index] || "" 
      }));

      // Use the appropriate user ID (logged in or admin from token)
      const userId = isTokenValid ? process.env.NEXT_PUBLIC_ADMIN_ID : loggedInUserId;
      
      const updatePayload = {
        eventId: event._id,
        senderName: isTokenValid ? "Token User" : event.author.username,
        userId: userId,
        socket,
        newImages: selectedType === "image" ? uploadedMedia : [],
        newVideos: selectedType === "video" ? uploadedMedia : [],
        mediaType: selectedType,
      };
      
      await updateEventMedia(updatePayload);
      
      // Refresh event data after upload
      const updatedEvent = await getEventById(event._id);
      setEvent(updatedEvent);
      
      setSelectedFiles([]);
      setCaptions([]);
      toast.success("Media uploaded successfully!", {
        position: "top-center"
      });
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Error uploading media.", {
        position: "top-center"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAuthenticate = (eventData) => {
    // Handle successful authentication
    setIsAuthenticated(true);
    setIsPasswordModalOpen(false);
    setEvent(eventData);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/'); // Default route when no history
    }
  };

  // Determine if user can upload media
  const isAuthor = event.author.userId === loggedInUserId;
  const isInvited = event.invited?.some(invite => invite.invitedId === loggedInUserId);
  const canUploadMedia = isAuthor || isInvited || isTokenValid;

  // Check if event is private and not authenticated
  const shouldShowContent = !event.private || isAuthenticated;

  return (
    <>
      <EventHead event={event} />
      <main className="max-w-[1960px] p-4 px-0 mx-0">
        {/* Password Modal */}
        {isPasswordModalOpen && (
          <PasswordModal
            eventId={event._id}
            onClose={() => setIsPasswordModalOpen(false)}
            onAuthenticate={handleAuthenticate}
          />
        )}

        {/* Main Content */}
        <div className={`${isPasswordModalOpen ? "blur-sm pointer-events-none" : ""}`}>
          <SearchEvents />
 
          <CoverPhotoBanner
            event={event}
            isAuthor={isAuthor}
            onCoverPhotoUpload={handleCoverPhotoUpload}
            onMessageClick={() => setIsMessageModalOpen(true)}
          />

          <button 
            onClick={handleBack}
            className="flex items-center space-x-2 ml-5 mb-5 px-4 py-2 rounded-lg
                      bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100
                      transition-all duration-300 shadow-sm hover:shadow group"
          >
            <ArrowLeft size={20} className="text-blue-600 group-hover:transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Back
            </span>
          </button>

          {shouldShowContent && (
            <div className="container mx-auto px-4">
              <div className="flex justify-center mb-8">
                <div className="inline-flex p-1 bg-gray-100 rounded-xl shadow-sm">
                  <button
                    className={`px-8 py-3 text-lg font-medium rounded-lg transition-all duration-300 ${
                      activeTab === "photo" 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md" 
                        : "bg-transparent text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveTab("photo")}
                  >
                    Images
                  </button>
                  <button
                    className={`px-8 py-3 text-lg font-medium rounded-lg transition-all duration-300 ${
                      activeTab === "video" 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md" 
                        : "bg-transparent text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveTab("video")}
                  >
                    Videos
                  </button>
                </div>
              </div>

              {canUploadMedia && (
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-sm">
                  <MediaUpload
                    selectedFiles={selectedFiles}
                    selectedType={selectedType}
                    captions={captions}
                    onFileChange={handleFileChange}
                    onCaptionChange={handleCaptionChange}
                    onMediaUpload={handleMediaUpload}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                  />
                </div>
              )}

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              {/* Render Content Based on Active Tab */}
              {activeTab === "photo" && (
                <MediaGallery
                  media={event.imageUrls}
                  mediaType="photo"
                  eventId={event._id}
                  lastViewedPhoto={lastViewedPhoto}
                  lastViewedPhotoRef={lastViewedPhotoRef}
                  event={event}
                  canUpload={canUploadMedia}
                />
              )}

              {activeTab === "video" && (
                <MediaGallery
                  media={event.videoUrls}
                  mediaType="video"
                  eventId={event._id}
                  lastViewedPhoto={lastViewedPhoto}
                  lastViewedPhotoRef={lastViewedPhotoRef}
                  event={event}
                  canUpload={canUploadMedia}
                />
              )}
            </div>
          )}
        </div>

        {/* Message Modal */}
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          eventId={event._id}
          userId={event.author.userId}
        />
      </main>

      {/* Global Loading UI for media route changes */}
      <LoadingSpinner isVisible={isMediaLoading} />

      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" 
      />
    </>
  );
};

export async function getServerSideProps({ params }) {
  try {
    const event = await getEventById(params.id);
    return {
      props: {
        initialEvent: JSON.parse(JSON.stringify(event)),
      },
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return {
      notFound: true,
    };
  }
}

export default EventDetails;