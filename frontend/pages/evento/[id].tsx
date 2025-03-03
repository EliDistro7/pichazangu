import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { Camera, ImagePlus, Video } from "lucide-react"; // Import Lucide icons
import { getEventById, updateEventCoverPhoto, updateEventMedia } from "../../actions/event";
import { getLoggedInUserId } from "hooks/useUser";
import { uploadToCloudinary } from "actions/uploadToCloudinary"; // Import the Cloudinary utility
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/router";

import { useLastViewedPhoto } from "../../utils/useLastViewedPhoto";

const EventDetails = ({ initialEvent }) => {
  console.log('initial event', initialEvent);
  const [event, setEvent] = useState(initialEvent);
  const [activeTab, setActiveTab] = useState("photo");
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const [isUploading, setIsUploading] = useState(false); // Track upload state
  const loggedInUserId = getLoggedInUserId(); // Get the logged-in user ID
  const router = useRouter();
    const { photoId } = router.query;
    const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
    const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

     useEffect(() => {
        if (lastViewedPhoto && !photoId) {
          lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
          setLastViewedPhoto(null);
        }
      }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  if (!event) {
    return <div>Loading event...</div>;
  }

  // Check if the logged-in user is the event author
  const isAuthor = event.author.userId === loggedInUserId;

  // Handle cover photo upload (single file)
  const handleCoverPhotoUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { secureUrl } = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });

      // Update the event cover photo in the database
      await updateEventCoverPhoto({
        eventId: event._id,
        newCoverPhoto: secureUrl,
        userId: loggedInUserId,
      });

      // Update local state
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

  // Handle media upload (images/videos) with multiple files support
  const handleMediaUpload = async (files, type) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Convert FileList to an array and upload all files concurrently
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map((file) =>
        uploadToCloudinary(file, (progress) => {
          // Optionally update progress for each file; here we just show the latest value
          setUploadProgress(progress);
        })
      );
      const uploadResults = await Promise.all(uploadPromises);
      const secureUrls = uploadResults.map((result) => result.secureUrl);

      // Update the event media in the database based on type
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

      // Update local state: append new URLs to the existing media array
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
        <title>{event.title} - Event Details</title>
        <meta name="description" content={event.description} />
        <meta property="og:title" content={event.title} />
        <meta property="og:description" content={event.description} />
        <meta property="og:image" content={event.coverPhoto} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://eventify.com/evento/${event._id}`} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={event.title} />
        <meta property="twitter:description" content={event.description} />
        <meta property="twitter:image" content={event.coverPhoto} />
        <meta property="twitter:url" content={`https://eventify.com/evento/${event._id}`} />
        <meta property="og:site_name" content="Eventify" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={event.title} />
        <meta property="og:image:secure_url" content={event.coverPhoto} />
        
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />


      </Head>
  
      <main className="mx-auto max-w-[1960px] p-4">
        {/* Cover Photo Banner */}
        <div
          className="relative h-96 w-full overflow-hidden mb-8"
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
  
          {/* Render cover photo upload UI for the author */}
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
                activeTab === "photo"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("photo")}
            >
              Images
            </button>
            <button
              className={`px-6 py-2 text-lg font-semibold rounded-r-lg transition ${
                activeTab === "video"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("video")}
            >
              Videos
            </button>
          </div>
  
          {/* Render media upload UI for the author */}
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
                  onChange={(e) =>
                    handleMediaUpload(e.target.files, "image")
                  }
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
                  onChange={(e) =>
                    handleMediaUpload(e.target.files, "video")
                  }
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
  
        {/* Content Based on Active Tab */}
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
          {/* Video Thumbnail */}
          <video
            src={url}
            className="object-cover w-full"
            style={{ transform: "translate3d(0, 0, 0)" }}
            controls={false} // Disable controls for the thumbnail
            muted // Mute the video for autoplay
            loop // Loop the video
            autoPlay // Autoplay the video
          />
        </Link>
      ))
    ) : (
      <p>No videos available.</p>
    )}
  </div>
)}
        </div>
      </main>
  
    
  
      {/* Toast notifications container */}
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
