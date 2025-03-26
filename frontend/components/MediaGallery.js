import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import ElaborateDescription from "components/ElaborateDescriptions";
import { Button } from "react-bootstrap";
import { Shuffle } from "react-bootstrap-icons";

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
    <div className="pb-8">
      {/* Elaborate Description Section */}
      {event.elaborateDescription && (
        <div className="mb-8">
          <ElaborateDescription content={event.elaborateDescription} />
        </div>
      )}

      {/* Shuffle Controls */}
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline-primary"
          onClick={toggleShuffle}
          className="d-flex align-items-center gap-2"
        >
          <Shuffle />
          {shuffled ? "Show Original Order" : "Shuffle Media"}
        </Button>
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
                  className="group relative block w-full cursor-zoom-in transform transition-transform duration-300 hover:scale-105"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-2xl">
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
          <div className="col-span-full text-center">
            <p className="text-gray-600 text-lg">No {mediaType === "photo" ? "images" : "videos"} available.</p>
          </div>
        )}
      </div>

      {/* Loading trigger and indicator */}
      {displayMedia.length > 0 && visibleItems < displayMedia.length && (
        <div ref={loadMoreRef} className="w-full flex justify-center py-4">
          <Button 
            variant="primary"
            onClick={() => setVisibleItems(prev => Math.min(prev + 10, displayMedia.length))}
            disabled={loading}
            className="d-flex align-items-center gap-2"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;