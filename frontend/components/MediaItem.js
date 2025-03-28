

import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MediaItem = ({ 
  item, 
  index, 
  mediaType, 
  eventId, 
  lastViewedPhoto, 
  lastViewedPhotoRef,
  totalItems,
  isLoaded,
  onLoad,
  onDownload
}) => {
  const data = typeof item === "string" 
    ? { url: item, caption: "" } 
    : { url: item.url, caption: item.caption || "" };

  return (
    <div className="mb-5 group">
      <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-100 dark:bg-gray-800">
        {/* Position indicator */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full z-10">
          {index + 1}/{totalItems}
        </div>

        {/* Download button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            onDownload(data.url, index);
          }}
          className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black/80 text-white rounded-full z-10 transition-all"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>

        <Link
          href={{
            pathname: `/p/${index}`,
            query: { eventId, mediaType, photoId: index },
          }}
          shallow
          ref={index === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
          className="block w-full"
        >
          {!isLoaded && (
            <div className="aspect-[4/3]">
              <Skeleton 
                height="100%"
                width="100%"
                baseColor="#f3f4f6"
                highlightColor="#e5e7eb"
                style={{ borderRadius: '0.75rem' }}
              />
            </div>
          )}
          <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {mediaType === "photo" ? (
              <div className="w-full">
                <Image
                  src={data.url}
                  alt={data.caption || `${mediaType} ${index + 1}`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                  onLoad={() => onLoad(index)}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQMAAAAl21bKAAAACAAAAEMlCAYAAAACzMAAAAEhUlEQVR4nO3BMQ0AAADCoPVP8fAAAAABJRU5ErkJggg=="
                  unoptimized={true}
                />
              </div>
            ) : (
              <video
                src={data.url}
                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                controls={false}
                muted
                loop
                autoPlay
                onLoadedData={() => onLoad(index)}
              />
            )}
          </div>
        </Link>

        {data.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-sm text-white font-medium line-clamp-2">{data.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaItem;