import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import ElaborateDescription from "components/ElaborateDescriptions";
import { Shuffle, ChevronLeft, ChevronRight, ArrowLeft, ImagePlus, Download } from "lucide-react";
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
  const router = useRouter();
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [shuffled, setShuffled] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [jumpToPage, setJumpToPage] = useState('');
  const totalPages = Math.ceil(media?.length / ITEMS_PER_PAGE) || 1;

  const displayMedia = useMemo(() => {
    return shuffled && media ? shuffleArray(media) : media || [];
  }, [media, shuffled]);

  const visibleItems = displayMedia.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
    setLoadedImages({});
  }, [media, shuffled]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const toggleShuffle = () => {
    setShuffled(!shuffled);
  };

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

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
      {/* Compact Dark Toolbar */}
      <div className="flex items-center justify-between mb-6 p-3 bg-gray-800 rounded-lg border border-gray-700 shadow-md">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={toggleShuffle}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
            title={shuffled ? "Original Order" : "Shuffle"}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={() => {/* Add image functionality */}}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
            title="Add Images"
          >
            <ImagePlus className="w-5 h-5" />
          </button>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            title="Previous Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center px-3 py-1 bg-gray-700 rounded-lg text-sm text-gray-200">
            <span>{currentPage}</span>
            <span className="mx-1 text-gray-400">/</span>
            <span>{totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            title="Next Page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Jump to Page */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            placeholder="Page"
            className="w-16 px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-200 placeholder-gray-400"
          />
          <button
            onClick={handleJumpToPage}
            className="px-2 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            title="Go to Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
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

            const originalIndex = media.indexOf(item);
            const isLoaded = loadedImages[originalIndex];

            return (
              <div key={`${originalIndex}-${index}`} className="mb-5 break-inside-avoid group">
                <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[3/2] bg-gray-100 dark:bg-gray-800">
                  {!isLoaded && renderSkeleton()}
                  
                  <div className={`absolute inset-0 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Position indicator top left */}
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
                      {originalIndex + 1}/{media.length}
                    </div>

                    {/* Download button top right */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDownload(data.url, originalIndex);
                      }}
                      className="absolute top-2 right-2 p-2 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <Link
                      href={{
                        pathname: `/p/${originalIndex}`,
                        query: { eventId, mediaType, photoId: originalIndex },
                      }}
                      shallow
                      ref={originalIndex === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                      className="block w-full h-full"
                    >
                      {mediaType === "photo" ? (
                        <Image
                          src={data.url}
                          alt={data.caption || `${mediaType} ${originalIndex + 1}`}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-full h-full object-cover rounded-xl"
                          onLoad={() => handleImageLoad(originalIndex)}
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
                          onLoadedData={() => handleImageLoad(originalIndex)}
                        />
                      )}
                    </Link>

                    {data.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-sm text-white font-medium line-clamp-2">{data.caption}</p>
                      </div>
                    )}
                  </div>
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