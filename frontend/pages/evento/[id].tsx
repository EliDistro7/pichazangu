import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { Camera, ImagePlus, Video, Loader2,MessageSquare,X } from "lucide-react";
import { getEventById, updateEventCoverPhoto, updateEventMedia,addViewToEvent } from "../../actions/event";
import { getLoggedInUserId } from "hooks/useUser";
import { uploadToCloudinary } from "actions/uploadToCloudinary";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLastViewedPhoto } from "../../utils/useLastViewedPhoto";
import MessageForm from 'components/MessageForm';
import SearchEvents from "components/SearchEvents";

const EventDetails = ({ initialEvent }) => {
  const [event, setEvent] = useState(initialEvent);
  const [activeTab, setActiveTab] = useState("photo");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false); // Controls loading UI for media clicks
  //const loggedInUserId = getLoggedInUserId();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false); // State for message modal
  const [loggedInUserId, setLoggedUserId] = useState(null);
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const lastViewedPhotoRef = useRef(null);

  // Scroll to last viewed photo if available
  useEffect(() => {
    let logged = getLoggedInUserId();
    setLoggedUserId(logged);
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);


  useEffect(() => {
    const localStorageKey = "viewedEvents";
    
    // Get stored viewed events
    let viewedEvents = JSON.parse(localStorage.getItem(localStorageKey)) || {};
  
    // Get userId or use 'guest' as identifier
    const userKey = loggedInUserId || "guest";
  
    // If event already viewed, don't send request
    if (viewedEvents[userKey]?.includes(initialEvent._id)) return;
  
    // Send request to add view
    console.log('initial event: ' + initialEvent._id)
    addViewToEvent({ eventId: initialEvent._id, userId: loggedInUserId || "guest" })
      .then(() => {
        // Update localStorage after successful request
        viewedEvents[userKey] = [...(viewedEvents[userKey] || []), initialEvent._id];
        localStorage.setItem(localStorageKey, JSON.stringify(viewedEvents));
        console.log('viewed succesfully')
      })
      .catch((error) => {
        console.error("Error adding event view:", error);
      });
  }, [initialEvent._id, loggedInUserId]);
  

  // Listen for route change events to display media loading UI
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

  if (!event) {
    return <div>Loading event...</div>;
  }

  // Check if the logged-in user is the event author
  const isAuthor = event.author.userId === loggedInUserId;

  // Handle cover photo upload
  const handleCoverPhotoUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const { secureUrl } = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });
      await updateEventCoverPhoto({
        eventId: event._id,
        newCoverPhoto: secureUrl,
        userId: loggedInUserId,
      });
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

  // Handle media (images/videos) upload
  const handleMediaUpload = async (files, type) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map((file) =>
        uploadToCloudinary(file, (progress) => {
          setUploadProgress(progress);
        })
      );
      const uploadResults = await Promise.all(uploadPromises);
      const secureUrls = uploadResults.map((result) => result.secureUrl);
      if (type === "image") {
        await updateEventMedia({
          eventId: event._id,
          newImages: secureUrls,
          newVideos: [],
          userId: loggedInUserId,
        });
      } else if (type === "video") {
        await updateEventMedia({
          eventId: event._id,
          newImages: [],
          newVideos: secureUrls,
          userId: loggedInUserId,
        });
      }
      setEvent((prevEvent) => ({
        ...prevEvent,
        [type === "image" ? "imageUrls" : "videoUrls"]: [
          ...(prevEvent[type === "image" ? "imageUrls" : "videoUrls"] || []),
          ...secureUrls,
        ],
      }));
      toast.success("Media updated successfully");
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Error uploading media");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
       <Head>
        <title>{event.title} </title>
        <meta name="description" content={initialEvent.description} />
        <meta property="og:title" content={`${initialEvent.title} - Event Details`} />
        <meta property="og:description" content={initialEvent.description} />
        <meta property="og:image" content={initialEvent.coverPhoto} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={initialEvent.coverPhoto}  />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${initialEvent.title} `} />
        <meta name="twitter:description" content={initialEvent.description} />
        <meta name="twitter:image" content={initialEvent.coverPhoto} />
      </Head>
  
      <main className=" max-w-[1960px] p-4 px-0 mx-0">
        <SearchEvents />
        {/* Cover Photo Banner */}
        <div
          className="relative h-96 w-full overflow-hidden mb-8 px-0 mt-0"
          style={{
            backgroundImage: `url(${event.coverPhoto})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <p className="max-w-2xl mb-6">{event.description}</p>
            <Link
              href="/dashboard"
              className="inline-block border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              View Profile
            </Link>
          </div>
          <div className="absolute bottom-4 left-4">
              {/* Message Icon */}
          <button
            onClick={() => setIsMessageModalOpen(true)}
            className=" p-2 bg-white/80 rounded-full cursor-pointer hover:bg-white/90 transition"
          >
            <MessageSquare className="w-5 h-5 text-gray-700" />
          </button>
          </div>
          {isAuthor && (
            <div className="absolute bottom-4 right-4">
            
              <label className="flex items-center justify-center p-2 bg-white/80 rounded-full cursor-pointer hover:bg-white/90 transition">
                <Camera className="w-5 h-5 text-gray-700" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleCoverPhotoUpload(e.target.files[0])}
                />
              </label>
            </div>
          )}
        </div>
  
        <div className="container mx-auto px-4">
          <p className="mb-4 text-lg">
            <span className="font-semibold">Author:</span> {event.author.username}
          </p>
  
          {/* Tabs Section */}
          <div className="flex justify-center mb-6">
            <button
              className={`px-6 py-2 text-lg font-semibold rounded-l-lg transition ${
                activeTab === "photo" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("photo")}
            >
              Images
            </button>
            <button
              className={`px-6 py-2 text-lg font-semibold rounded-r-lg transition ${
                activeTab === "video" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("video")}
            >
              Videos
            </button>
          </div>
  
          {/* Media Upload UI for the Author */}
          {isAuthor && (
            <div className="flex justify-center mb-6 gap-4">
              <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
                <ImagePlus className="w-5 h-5 mr-2" />
                <span>Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleMediaUpload(e.target.files, "image")}
                />
              </label>
              <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
                <Video className="w-5 h-5 mr-2" />
                <span>Add Video</span>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleMediaUpload(e.target.files, "video")}
                />
              </label>
            </div>
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
            <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
              {event.imageUrls && event.imageUrls.length > 0 ? (
                event.imageUrls.map((url, index) => (
                  <Link
                    key={index}
                    href={{
                      pathname: `/p/${index}`,
                      query: { eventId: event._id, mediaType: "photo", photoId: index },
                    }}
                    shallow
                    ref={index === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                    className="group relative mb-5 block w-full cursor-zoom-in after:content after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                  >
                    <Image
                      src={url}
                      alt={`${event.title} image ${index + 1}`}
                      width={720}
                      height={480}
                      className="object-cover w-full"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQMAAAAl21bKAAAACAAAAEMlCAYAAAACzMAAAAEhUlEQVR4nO3BMQ0AAADCoPVP8fAAAAABJRU5ErkJggg=="
                    />
                  </Link>
                ))
              ) : (
                <p>No images available.</p>
              )}
            </div>
          )}
  
          {activeTab === "video" && (
            <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
              {event.videoUrls && event.videoUrls.length > 0 ? (
                event.videoUrls.map((url, index) => (
                  <Link
                    key={index}
                    href={{
                      pathname: `/p/${index}`,
                      query: { eventId: event._id, mediaType: "video", photoId: index },
                    }}
                    shallow
                    ref={index === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                    className="group relative mb-5 block w-full cursor-zoom-in after:content after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                  >
                    <video
                      src={url}
                      className="object-cover w-full"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      controls={false}
                      muted
                      loop
                      autoPlay
                    />
                  </Link>
                ))
              ) : (
                <p>No videos available.</p>
              )}
            </div>
          )}
        </div>

          {/* Message Modal */}
          {isMessageModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-lg flex items-center justify-center z-50">
            <div className="relative bg-gray-900 text-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="absolute top-3 right-3 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
              >
                <X className="text-white" size={20} />
              </button>
              <MessageForm eventId={initialEvent._id} />
            </div>
          </div>
        )}
      </main>
      
      {/* Global Loading UI for media route changes */}
      {isMediaLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader2 className="text-white animate-spin" size={48} />
        </div>
      )}
  
      <ToastContainer />
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
