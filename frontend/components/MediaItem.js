
'use client';

import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import downloadPhoto from "utils/downloadPhoto";
import VideoPlayer from "./VideoPlayer"; // Import the new VideoPlayer component


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

  const handleDownload = (url, filename) => {
    downloadPhoto(url, filename);
  };

  return (
    <div className="mb-5 group">
      <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-100 dark:bg-gray-800">

        
        <div className={`transition-opacity duration-300 ${mediaType === "photo" && isLoaded ? 'opacity-100' : 'opacity-100'}`}>
          {mediaType === "photo" ? (
            // Photo display with position indicator and download button
            <>
              {/* Position indicator */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full z-10">
                {index + 1}/{totalItems}
              </div>

              {/* Download button */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  handleDownload(data.url, `${index}.jpg`);
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
              </Link>

              {data.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-sm text-white font-medium line-clamp-2">{data.caption}</p>
                </div>
              )}
            </>
          ) : (
            // Video display with enhanced video player
            <Link
              href={{
                pathname: `/p/${index}`,
                query: { eventId, mediaType, photoId: index },
              }}
              shallow
              ref={index === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              className="block w-full"
              onClick={(e) => e.preventDefault()} // Prevent navigation when clicking video player
            >
              <VideoPlayer 
                src={data.url}
                caption={data.caption}
                onDownload={handleDownload}
                autoPlay={false}
                controls={true}
                index={index}
                totalItems={totalItems}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaItem;