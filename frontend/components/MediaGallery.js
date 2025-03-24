import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const getMediaData = (media) => {
  if (typeof media === "string") {
    return { url: media, caption: "" };
  }
  if (typeof media === "object" && media.url) {
    return { url: media.url, caption: media.caption || "" };
  }
  return null;
};

const MediaGallery = ({ media, mediaType, eventId, lastViewedPhoto, lastViewedPhotoRef }) => {
  const [visibleItems, setVisibleItems] = useState(10);
  const [loading, setLoading] = useState(false);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Reset visible items when media changes
  useEffect(() => {
    setVisibleItems(10);
  }, [media]);

  // Load more items when scroll reaches the trigger point
  useEffect(() => {
    if (inView && !loading && visibleItems < media?.length) {
      setLoading(true);
      // Simulate network request delay
      setTimeout(() => {
        setVisibleItems(prev => Math.min(prev + 10, media.length));
        setLoading(false);
      }, 500);
    }
  }, [inView, loading, media?.length, visibleItems]);

  return (
    <div className="pb-8">
      <div className="columns-1 gap-6 sm:columns-2 xl:columns-3 2xl:columns-4">
        {media && media.length > 0 ? (
          media.slice(0, visibleItems).map((item, index) => {
            const data = getMediaData(item);
            if (!data) return null;

            return (
              <Link
                key={index}
                href={{
                  pathname: `/p/${index}`,
                  query: { eventId, mediaType, photoId: index },
                }}
                shallow
                ref={index === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                className="group relative mb-6 block w-full cursor-zoom-in transform transition-transform duration-300 hover:scale-105"
              >
                <div className="relative overflow-hidden rounded-lg shadow-2xl">
                  {mediaType === "photo" ? (
                    <Image
                      src={data.url}
                      alt={data.caption || `${mediaType} ${index + 1}`}
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
            );
          })
        ) : (
          <p className="text-center text-gray-600 text-lg">No {mediaType === "photo" ? "images" : "videos"} available.</p>
        )}
      </div>

      {/* Loading trigger and indicator */}
      {media && visibleItems < media.length && (
        <div ref={loadMoreRef} className="w-full flex justify-center py-4">
          <button 
            onClick={() => setVisibleItems(prev => Math.min(prev + 10, media.length))}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;