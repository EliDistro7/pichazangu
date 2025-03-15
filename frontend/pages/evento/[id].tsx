import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { Camera, ImagePlus, Video, Loader2,MessageSquare,X, ArrowLeft } from "lucide-react";
import { getEventById, updateEventCoverPhoto, updateEventMedia,addViewToEvent } from "../../actions/event";
import { getLoggedInUserId, getLoggedInUsername } from "hooks/useUser";
import { uploadToCloudinary } from "actions/uploadToCloudinary";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLastViewedPhoto } from "../../utils/useLastViewedPhoto";
import MessageForm from 'components/MessageForm';
import SearchEvents from "components/SearchEvents";
import socket from "hooks/socket";
import axios from "axios";


const EventDetails = ({ initialEvent }) => {
  console.log('initialEvent acces token', initialEvent.accessToken);
  const [event, setEvent] = useState(initialEvent);
  const [activeTab, setActiveTab] = useState("photo");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false); // Controls loading UI for media clicks
  //const loggedInUserId = getLoggedInUserId();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false); // State for message modal
  const [loggedInUserId, setLoggedUserId] = useState(null);
  const [logggedInUsername, setLogggedInUsername] = useState(null);
  const router = useRouter();
  const { token } = router.query;
  
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const lastViewedPhotoRef = useRef(null);
  const [caption, setCaption] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [captions, setCaptions] = useState([]);
 
  const [selectedType, setSelectedType] = useState("");
  


const [isTokenValid, setIsTokenValid] = useState(false);

useEffect(() => {
  

 

  if (token) {
    // Validate the token with the backend
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
}, []);



  // Scroll to last viewed photo if available
  useEffect(() => {
    let logged = getLoggedInUserId();
    let userNameLogged = getLoggedInUsername();
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
    //console.log('initial event: ' + initialEvent._id)
    addViewToEvent({ eventId: initialEvent._id,userId:initialEvent.author.userId, senderName: logggedInUsername || "guest", socket:socket })
      .then(() => {
        
        // Update localStorage after successful request
        viewedEvents[userKey] = [...(viewedEvents[userKey] || []), initialEvent._id];
        localStorage.setItem(localStorageKey, JSON.stringify(viewedEvents));
        //console.log('viewed succesfully')
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

  {/* Helper function to extract URL and caption */}
const getMediaData = (media) => {
  if (typeof media === "string") {
    return { url: media, caption: "" };
  }
  if (typeof media === "object" && media.url) {
    return { url: media.url, caption: media.caption || "" };
  }
  return null;
};

  if (!event) {
    return <div>Loading event...</div>;
  }

  // Check if the logged-in user is the event author
  const isAuthor = event.author.userId === loggedInUserId;

  // Check if the logged-in user is an invited collaborator
const isInvited = event.invited?.some(invite => invite.invitedId === loggedInUserId);

// Allow media upload for both the author and invited users
const canUploadMedia = isAuthor || isInvited || isTokenValid;

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
        caption: captions[index] || "",
      }));

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



  return (
    <>
      <head>
<title>{event.title}</title>
<meta name="description" content={initialEvent.description} />
<meta property="og:title" content={`${initialEvent.title} `} />
<meta property="og:description" content={initialEvent.description} />
<meta property="og:image" content={initialEvent.coverPhoto} />
<meta property="og:type" content="website" />
<meta property="og:url" content={`https://pichazangu.store/evento/${initialEvent._id}`} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={initialEvent.title} />
<meta name="twitter:description" content={initialEvent.description} />
<meta name="twitter:image" content={initialEvent.coverPhoto} />
</head>
  
      <main className=" max-w-[1960px] p-4 px-0 mx-0">
        <SearchEvents />
        
           {/* Back Button */}
           <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-400 ml-3 hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
  
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
  {/* Author Section */}
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
  {canUploadMedia && (
 <div className="flex flex-col items-center mb-6 gap-4">
 <div className="flex gap-4">
   <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
     <ImagePlus className="w-5 h-5 mr-2" />
     <span>Add Image</span>
     <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "image")} multiple />
   </label>

   <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
     <Video className="w-5 h-5 mr-2" />
     <span>Add Video</span>
     <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, "video")} multiple />
   </label>
 </div>

 {selectedFiles.length > 0 && (
   <div className="flex flex-col w-full max-w-md mt-4">
     {selectedFiles.map((file, index) => (
       <div key={index} className="flex flex-col items-center gap-2 mb-2">
         {selectedType === "image" ? (
           <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-32 object-cover rounded-lg" />
         ) : (
           <video controls className="w-full h-32 object-cover rounded-lg">
             <source src={URL.createObjectURL(file)} type={file.type} />
           </video>
         )}
         <span className="truncate w-2/3">{file.name}</span>
         <input
           type="text"
           placeholder="Add a caption (optional)"
           value={captions[index] || ""}
           onChange={(e) => handleCaptionChange(e, index)}
           className="flex-1 px-2 py-1 border border-gray-300 rounded-lg"
         />
       </div>
     ))}
     <button
       className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
       onClick={handleMediaUpload}
       disabled={isUploading}
     >
       {isUploading ? `Uploading... (${uploadProgress}%)` : "Upload Media"}
     </button>
   </div>
 )}
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
        event.imageUrls.map((media, index) => {
          const data = getMediaData(media);
          if (!data) return null;

          return (
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
                src={data.url}
                alt={data.caption || `${event.title} image ${index + 1}`}
                width={720}
                height={480}
                className="object-cover w-full"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQMAAAAl21bKAAAACAAAAEMlCAYAAAACzMAAAAEhUlEQVR4nO3BMQ0AAADCoPVP8fAAAAABJRU5ErkJggg=="
              />
              {data.caption && <p className="text-sm text-gray-500 mt-2">{data.caption}</p>}
            </Link>
          );
        })
      ) : (
        <p>No images available.</p>
      )}
    </div>
  )}

  {activeTab === "video" && (
    <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
      {event.videoUrls && event.videoUrls.length > 0 ? (
        event.videoUrls.map((media, index) => {
          const data = getMediaData(media);
          if (!data) return null;

          return (
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
                src={data.url}
                className="object-cover w-full"
                style={{ transform: "translate3d(0, 0, 0)" }}
                controls={false}
                muted
                loop
                autoPlay
              />
              {data.caption && <p className="text-sm text-gray-500 mt-2">{data.caption}</p>}
            </Link>
          );
        })
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
              <MessageForm eventId={initialEvent._id} userId={`${initialEvent.author.userId}`}/>
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
  
      <ToastContainer theme="dark"/>
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