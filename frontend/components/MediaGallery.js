import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const getMediaData = (media) => {
  if (typeof media === "string") return { url: media, caption: "" };
  if (typeof media === "object" && media.url) return { url: media.url, caption: media.caption || "" };
  return null;
};

const MediaGallery = ({ media, mediaType, eventId, lastViewedPhoto, lastViewedPhotoRef, event }) => {
  const router = useRouter();
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedImages, setLoadedImages] = useState({});
  const [jumpToPage, setJumpToPage] = useState('');
  const totalPages = Math.ceil(media?.length / ITEMS_PER_PAGE) || 1;

  const visibleItems = media?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ) || [];

  useEffect(() => {
    setCurrentPage(1);
    setLoadedImages({});
  }, [media]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToPage = (e) => {
    e.preventDefault();
    const page = parseInt(jumpToPage);
    if (!isNaN(page)) {
      handlePageChange(Math.min(Math.max(1, page), totalPages));
      setJumpToPage('');
    }
  };

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const handleDownload = (url, index) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mediaType}-${index + 1}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSkeleton = () => (
    <div className="mb-5 break-inside-avoid">
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
      {/* Floating Pagination Controls */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 p-3 bg-gray-800/90 backdrop-blur-sm rounded-full shadow-xl border border-gray-700">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            title="Previous Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-200">
            <span className="font-medium">{currentPage}</span>
            <span className="mx-1 text-gray-400">/</span>
            <span>{totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            title="Next Page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 ml-2">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              placeholder="Page"
              className="w-16 px-3 py-1 text-sm bg-gray-700 border border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 placeholder-gray-400 text-center"
            />
            <button
              onClick={handleJumpToPage}
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
              title="Go to Page"
            >
              Go
            </button>
          </div>
        </div>
      </div>

      {/* Elaborate Description */}
      {event.elaborateDescription && (
        <div className="mb-8">
          <ElaborateDescription content={event.elaborateDescription} />
        </div>
      )}

      {/* Media Gallery Grid */}
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
        {visibleItems.length > 0 ? (
          visibleItems.map((item, index) => {
            const data = getMediaData(item);
            if (!data) return null;
            const absoluteIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;

            return (
              <div key={`${absoluteIndex}`} className="mb-5 break-inside-avoid group">
                <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[3/2] bg-gray-100 dark:bg-gray-800">
                  {/* Position indicator top left */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full z-10">
                    {absoluteIndex + 1}/{media.length}
                  </div>

                  {/* Download button top right */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleDownload(data.url, absoluteIndex);
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black/80 text-white rounded-full z-10 transition-all"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <Link
                    href={{
                      pathname: `/p/${absoluteIndex}`,
                      query: { eventId, mediaType, photoId: absoluteIndex },
                    }}
                    shallow
                    ref={absoluteIndex === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                    className="block w-full h-full"
                  >
                    {!loadedImages[absoluteIndex] && renderSkeleton()}
                    <div className={`absolute inset-0 transition-opacity duration-300 ${loadedImages[absoluteIndex] ? 'opacity-100' : 'opacity-0'}`}>
                      {mediaType === "photo" ? (
                        <Image
                          src={data.url}
                          alt={data.caption || `${mediaType} ${absoluteIndex + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover rounded-xl"
                          onLoad={() => handleImageLoad(absoluteIndex)}
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQMAAAAl21bKAAAACAAAAEMlCAYAAAACzMAAAAEhUlEQVR4nO3BMQ0AAADCoPVP8fAAAAABJRU5ErkJggg=="
                          unoptimized={true}
                        />
                      ) : (
                        <video
                          src={data.url}
                          className="w-full h-full object-cover rounded-xl"
                          controls={false}
                          muted
                          loop
                          autoPlay
                          onLoadedData={() => handleImageLoad(absoluteIndex)}
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
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No {mediaType === "photo" ? "images" : "videos"} available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGallery;