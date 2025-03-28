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
import PasswordModal from "components/PasswordModal2"; // Import the PasswordModal component

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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(initialEvent.private); // Show modal if event is private
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      axios
        .post(`${process.env.NEXT_PUBLIC_SERVER}/validate-token`, { eventId: event._id, token })
        .then((res) => {
          if (res.data.valid) {
            setIsTokenValid(true);
            toast.success("Token verified! You have upload access.");
          } else {
            toast.error("Invalid token! Upload access denied.");
          }
        })
        .catch((err) => {
          console.error("Token validation failed:", err);
          toast.warn("Invalid Token provided.");
        });
    }
  }, [token, event._id]);

  useEffect(() => {
    let logged = getLoggedInUserId();
    let userNameLogged = getLoggedInUsername();
    if(logged) setLoggedUserId(logged);
    
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  useEffect(() => {
    const localStorageKey = "viewedEvents";
    let viewedEvents = JSON.parse(localStorage.getItem(localStorageKey)) || {};
    const userKey = loggedInUserId || "guest";
    if (viewedEvents[userKey]?.includes(initialEvent._id)) return;
    addViewToEvent({ eventId: initialEvent._id, userId: initialEvent.author.userId, senderName: logggedInUsername || "guest", socket })
      .then(() => {
        viewedEvents[userKey] = [...(viewedEvents[userKey] || []), initialEvent._id];
        localStorage.setItem(localStorageKey, JSON.stringify(viewedEvents));
      })
      .catch((error) => {
        console.error("Error adding event view:", error);
      });
  }, [initialEvent._id, loggedInUserId]);

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
      await updateEventCoverPhoto({ eventId: event._id, newCoverPhoto: secureUrl, userId: loggedInUserId });
      setEvent((prevEvent) => ({ ...prevEvent, coverPhoto: secureUrl }));
      toast.success("Cover photo updated successfully");
    } catch (error) {
      console.error("Error uploading cover photo:", error);
      toast.error("Error uploading cover photo");
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
      const uploadResults = await Promise.all(selectedFiles.map((file) => uploadToCloudinary(file, (progress) => setUploadProgress(progress))));
      const uploadedMedia = uploadResults.map((result, index) => ({ url: result.secureUrl, caption: captions[index] || "" }));
      const updatePayload = {
        eventId: event._id,
        senderName: event.author.username,
        userId: loggedInUserId,
        socket,
        newImages: selectedType === "image" ? uploadedMedia : [],
        newVideos: selectedType === "video" ? uploadedMedia : [],
        mediaType: selectedType,
      };
      await updateEventMedia(updatePayload);
      setSelectedFiles([]);
      setCaptions([]);
      toast.success("Media uploaded successfully!");
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Error uploading media.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAuthenticate = (eventData) => {
    // Handle successful authentication
    setIsAuthenticated(true);
    setIsPasswordModalOpen(false);
    console.log("Authenticated event data:", eventData);
  };

  const handleBack = () => {
    const referrer = document.referrer;
    if (referrer && referrer.includes(window.location.origin)) {
      router.back();
    } else {
      router.push('/'); // Default route when no history
    }
  };

  const isAuthor = event.author.userId === loggedInUserId;
  const isInvited = event.invited?.some(invite => invite.invitedId === loggedInUserId);
  const canUploadMedia = isAuthor || isInvited || isTokenValid;

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
        <div className={`${isPasswordModalOpen ? "blur-sm" : ""}`}>
          <SearchEvents />
 
          <CoverPhotoBanner
            event={event}
            isAuthor={isAuthor}
            onCoverPhotoUpload={handleCoverPhotoUpload}
            onMessageClick={() => setIsMessageModalOpen(true)}
          />

<button 
  onClick={() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }} 
  className="flex text-lg items-center space-x-2 ml-5 mb-5 pt-5 transition-colors
             bg-transparent group"
>
  <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent
                  group-hover:from-blue-600 group-hover:to-purple-700">
    <ArrowLeft size={20} className="inline text-blue-500" />
    <span> Back</span>
  </span>
</button>
          <div className="container mx-auto px-4">
           
            <div className="flex justify-center mb-6">
              <button
                className={`px-6 py-2 text-lg font-semibold rounded-l-lg transition ${activeTab === "photo" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                onClick={() => setActiveTab("photo")}
              >
                Images
              </button>
              <button
                className={`px-6 py-2 text-lg font-semibold rounded-r-lg transition ${activeTab === "video" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                onClick={() => setActiveTab("video")}
              >
                Videos
              </button>
            </div>
            {canUploadMedia && (
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
            )}

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="w-full h-1 bg-gray-200">
                <div
                  className="h-full bg-blue-600"
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

      <ToastContainer theme="dark" />
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