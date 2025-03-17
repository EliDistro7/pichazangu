

// components/MediaGallery.js

import Image from "next/image";
import Link from "next/link";

const getMediaData = (media) => {
    if (typeof media === "string") {
      return { url: media, caption: "" };
    }
    if (typeof media === "object" && media.url) {
      return { url: media.url, caption: media.caption || "" };
    }
    return null;
  };
const MediaGallery = ({ media, mediaType, eventId, lastViewedPhoto, lastViewedPhotoRef }) => (
    <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
      {media && media.length > 0 ? (
        media.map((item, index) => {
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
              className="group relative mb-5 block w-full cursor-zoom-in after:content after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              {mediaType === "photo" ? (
                <Image
                  src={data.url}
                  alt={data.caption || `${data.caption} image ${index + 1}`}
                  width={720}
                  height={480}
                  className="object-cover w-full"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQMAAAAl21bKAAAACAAAAEMlCAYAAAACzMAAAAEhUlEQVR4nO3BMQ0AAADCoPVP8fAAAAABJRU5ErkJggg=="
                />
              ) : (
                <video
                  src={data.url}
                  className="object-cover w-full"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                  controls={false}
                  muted
                  loop
                  autoPlay
                />
              )}
              {data.caption && <p className="text-sm text-gray-500 mt-2">{data.caption}</p>}
            </Link>
          );
        })
      ) : (
        <p>No {mediaType === "photo" ? "images" : "videos"} available.</p>
      )}
    </div>
  );
  
  export default MediaGallery;