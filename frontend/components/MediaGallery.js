import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import ElaborateDescription from "components/ElaborateDescriptions";
import { Shuffle } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const getMediaData = (media) => {
  if (typeof media === "string") {
    return { url: media, caption: "" };
  }
  if (typeof media === "object" && media.url) {
    return { url: media.url, caption: media.caption || "" };
  }
  return null;
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const MediaGallery = ({ media, mediaType, eventId, lastViewedPhoto, lastViewedPhotoRef, event }) => {
  const [visibleItems, setVisibleItems] = useState(10);
  const [loading, setLoading] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const displayMedia = useMemo(() => {
    return shuffled && media ? shuffleArray(media) : media || [];
  }, [media, shuffled]);

  useEffect(() => {
    setVisibleItems(10);
    setLoadedImages({});
  }, [media]);

  useEffect(() => {
    if (inView && !loading && visibleItems < displayMedia.length) {
      setLoading(true);
      setTimeout(() => {
        setVisibleItems(prev => Math.min(prev + 10, displayMedia.length));
        setLoading(false);
      }, 100);
    }
  }, [inView, loading, displayMedia, visibleItems]);

  const toggleShuffle = () => {
    setShuffled(!shuffled);
    setVisibleItems(10);
    setLoadedImages({});
  };

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const renderSkeleton = () => (
    <div className="mb-6 break-inside-avoid">
      <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[3/2]">
        <Skeleton 
          height="100%"
          width="100%"
          baseColor="#f3f4f6"
          highlightColor="#e5e7eb"
          style={{ borderRadius: '0.75rem' }}
        />
      </div>
    </div>
  );

  return (
    <div className="pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        {event.elaborateDescription && (
          <div className="flex-1">
            <ElaborateDescription content={event.elaborateDescription} />
          </div>
        )}
        
        {/* Shuffle Button - Modern Floating Style */}
        <button
          onClick={toggleShuffle}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 fixed bottom-6 right-6 z-10 md:static md:rounded-lg md:px-4 md:py-2 md:bg-gradient-to-r md:from-blue-500 md:to-blue-600 md:text-white md:hover:from-blue-600 md:hover:to-blue-700"
        >
          <Shuffle className="w-5 h-5" />
          <span className="hidden md:inline">
            {shuffled ? "Original Order" : "Shuffle"}
          </span>
        </button>
      </div>

      {/* Media Gallery Grid */}
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
        {displayMedia.length > 0 ? (
          displayMedia.slice(0, visibleItems).map((item, index) => {
            const data = getMediaData(item);
            if (!data) return null;

            const originalIndex = media.indexOf(item);
            const isLoaded = loadedImages[originalIndex];

            return (
              <div key={`${originalIndex}-${index}`} className="mb-5 break-inside-avoid">
                <Link
                  href={{
                    pathname: `/p/${originalIndex}`,
                    query: { eventId, mediaType, photoId: originalIndex },
                  }}
                  shallow
                  ref={originalIndex === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                  className="group relative block w-full cursor-zoom-in transform transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[3/2] bg-gray-100 dark:bg-gray-800">
                    {!isLoaded && renderSkeleton()}
                    
                    <div className={`absolute inset-0 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                      {mediaType === "photo" ? (
                    <Image
                    src={data.url}
                    alt={data.caption || `${mediaType} ${originalIndex + 1}`}
                    width={0}  // Let the image determine its width
                    height={0} // Let the image determine its height
                    sizes="100vw"
                    className="w-full h-auto object-contain rounded-xl"
                    onLoad={() => handleImageLoad(originalIndex)}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQMAAAAl21bKAAAACAAAAEMlCAYAAAACzMAAAAEhUlEQVR4nO3BMQ0AAADCoPVP8fAAAAABJRU5ErkJggg=="
                    unoptimized={true} // Add this if you want completely original sizes
                  />
                      ) : (
                        <video
                          src={data.url}
                          className="object-cover w-full h-full transition-opacity duration-300 group-hover:opacity-90"
                          controls={false}
                          muted
                          loop
                          autoPlay
                          onLoadedData={() => handleImageLoad(originalIndex)}
                        />
                      )}
                      {data.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <p className="text-sm text-white font-medium line-clamp-2">{data.caption}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No {mediaType === "photo" ? "images" : "videos"} available.
            </p>
          </div>
        )}
      </div>

      {/* Loading trigger - Modern Floating Button */}
      {displayMedia.length > 0 && visibleItems < displayMedia.length && (
        <div ref={loadMoreRef} className="w-full flex justify-center py-6">
          <button
            onClick={() => setVisibleItems(prev => Math.min(prev + 10, displayMedia.length))}
            disabled={loading}
            className={`flex items-center justify-center gap-3 px-6 py-3 rounded-full shadow-lg transition-all duration-300 ${
              loading 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-xl'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-500 dark:border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span>Load More</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;