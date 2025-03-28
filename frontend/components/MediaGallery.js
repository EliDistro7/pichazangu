import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import MediaItem from "./MediaItem";
import PaginationControls from "./PaginationControls";
import EmptyState from "./EmptyState";
import ElaborateDescription from 'components/ElaborateDescriptions';

const MediaGallery = ({ media, mediaType, eventId, lastViewedPhoto, lastViewedPhotoRef, event }) => {
  const router = useRouter();
  const ITEMS_PER_PAGE = 30;
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedImages, setLoadedImages] = useState({});
  const [jumpToPage, setJumpToPage] = useState('');
  const totalPages = Math.ceil(media?.length / ITEMS_PER_PAGE) || 1;

  const visibleItems = useMemo(() => 
    media?.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    ) || [], 
    [media, currentPage]
  );

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

  return (
    <div className="pb-12">
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        jumpToPage={jumpToPage}
        onJumpToPageChange={(e) => setJumpToPage(e.target.value)}
        onJumpSubmit={handleJumpToPage}
      />

      {event.elaborateDescription && (
        <div className="mb-8">
          <ElaborateDescription content={event.elaborateDescription} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {visibleItems.length > 0 ? (
          visibleItems.map((item, index) => {
            const absoluteIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
            return (
              <MediaItem
                key={`${absoluteIndex}`}
                item={item}
                index={absoluteIndex}
                mediaType={mediaType}
                eventId={eventId}
                lastViewedPhoto={lastViewedPhoto}
                lastViewedPhotoRef={lastViewedPhotoRef}
                totalItems={media.length}
                isLoaded={loadedImages[absoluteIndex]}
                onLoad={handleImageLoad}
                onDownload={handleDownload}
              />
            );
          })
        ) : (
          <EmptyState mediaType={mediaType} />
        )}
      </div>
    </div>
  );
};

export default MediaGallery;