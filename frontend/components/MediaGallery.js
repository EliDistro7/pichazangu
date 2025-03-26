import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import ElaborateDescription from "components/ElaborateDescriptions";
import { Shuffle } from "lucide-react";

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
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Create both original and shuffled versions of the media array
  const displayMedia = useMemo(() => {
    return shuffled && media ? shuffleArray(media) : media || [];
  }, [media, shuffled]);

  // Reset visible items when media changes
  useEffect(() => {
    setVisibleItems(10);
  }, [media]);

  // Load more items when scroll reaches the trigger point
  useEffect(() => {
    if (inView && !loading && visibleItems < displayMedia.length) {
      setLoading(true);
      setTimeout(() => {
        setVisibleItems(prev => Math.min(prev + 10, displayMedia.length));
        setLoading(false);
      }, 500);
    }
  }, [inView, loading, displayMedia, visibleItems]);

  const toggleShuffle = () => {
    setShuffled(!shuffled);
    setVisibleItems(10); // Reset visible items when shuffling
  };

  return (
    <div className="pb-8 dark:bg-gray-900 dark:text-gray-100">
      {/* Elaborate Description Section */}
      {event.elaborateDescription && (
        <div className="mb-8">
          <ElaborateDescription content={event.elaborateDescription} />
        </div>
      )}

      {/* Shuffle Controls */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleShuffle}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <Shuffle className="w-5 h-5" />
          {shuffled ? "Show Original Order" : "Shuffle Media"}
        </button>
      </div>

      {/* Media Gallery Grid */}
      <div className="columns-1 gap-6 sm:columns-2 xl:columns-3 2xl:columns-4">
        {displayMedia.length > 0 ? (
          displayMedia.slice(0, visibleItems).map((item, index) => {
            const data = getMediaData(item);
            if (!data) return null;

            // Get original index for linking purposes
            const originalIndex = media.indexOf(item);

            return (
              <div key={`${originalIndex}-${index}`} className="mb-6 break-inside-avoid">
                <Link
                  href={{
                    pathname: `/p/${originalIndex}`,
                    query: { eventId, mediaType, photoId: originalIndex },
                  }}
                  shallow
                  ref={originalIndex === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                  className="group relative block w-full cursor-zoom-in transform transition-transform duration-300 hover:scale-[1.02]"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg dark:shadow-gray-800/50">
                    {mediaType === "photo" ? (
                      <Image
                        src={data.url}
                        alt={data.caption || `${mediaType} ${originalIndex + 1}`}
                        width={720}
                        height={480}
                        className="object-cover w-full h-full transition-opacity duration-300 group-hover:opacity-90"
                        style={{ transform: "translate3d(0, 0, 0)" }}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQMAAAAl21bKAAAACAAAAEMlCAYAAAACzMAAAAEhUlEQVR4nO3BMQ0AAADCoPVP8fAAAAABJRU5ErkJggg=="
                      />
                    ) : (
                      <video
                        src={data.url}
                        className="object-cover w-full h-full transition-opacity duration-300 group-hover:opacity-90"
                        style={{ transform: "translate3d(0, 0, 0)" }}
                        controls={false}
                        muted
                        loop
                        autoPlay
                      />
                    )}
                    {data.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent p-4">
                        <p className="text-sm text-white font-medium">{data.caption}</p>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No {mediaType === "photo" ? "images" : "videos"} available.
            </p>
          </div>
        )}
      </div>

      {/* Loading trigger and indicator */}
      {displayMedia.length > 0 && visibleItems < displayMedia.length && (
        <div ref={loadMoreRef} className="w-full flex justify-center py-4">
          <button
            onClick={() => setVisibleItems(prev => Math.min(prev + 10, displayMedia.length))}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-purple-600 dark:bg-purple-700 text-white hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors duration-200 disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;