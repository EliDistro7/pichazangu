import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import MediaItem from "./MediaItem";
import PaginationControls from "./PaginationControls";
import EmptyState from "./EmptyState";
import ElaborateDescription from 'components/ElaborateDescriptions';
import { updateEventTags, getEventTags } from 'actions/event'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MediaGallery = ({ media, mediaType, eventId, lastViewedPhoto, lastViewedPhotoRef, event, canUpload }) => {
  const router = useRouter();
  const ITEMS_PER_PAGE = 25;
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedImages, setLoadedImages] = useState({});
  const [jumpToPage, setJumpToPage] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [integersInput, setIntegersInput] = useState('');
  const [isAddingTags, setIsAddingTags] = useState(false);
  const [currentTags, setCurrentTags] = useState(event.tags || {});
  const [activeTag, setActiveTag] = useState(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const totalPages = Math.ceil(media?.length / ITEMS_PER_PAGE) || 1;

  // Filter media based on active tag
  const filteredMedia = useMemo(() => {
    if (!activeTag || !currentTags[activeTag]) return media;
    return currentTags[activeTag].map(index => media[index]).filter(Boolean);
  }, [media, activeTag, currentTags]);

  const visibleItems = useMemo(() => 
    filteredMedia?.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    ) || [], 
    [filteredMedia, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
    setLoadedImages({});
  }, [media, activeTag]);

  useEffect(() => {
    refreshTags();
  }, [eventId]);

  const handleAddTags = async () => {
    if (!tagInput.trim() || !integersInput.trim()) {
      toast.error('Please enter both tag name and integers');
      return;
    }

    setIsAddingTags(true);
    try {
      const integersArray = integersInput.split(',')
        .map(num => parseInt(num.trim(), 10))
        .filter(num => !isNaN(num));

      if (integersArray.length === 0) {
        toast.error('Please enter valid integers');
        return;
      }

      const updatedEvent = await updateEventTags(eventId, tagInput.trim(), integersArray);
      
      toast.success('Tags added successfully!');
      setCurrentTags(updatedEvent.tags || {});
      setTagInput('');
      setIntegersInput('');
    } catch (error) {
      console.error('Error adding tags:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to add tags');
    } finally {
      setIsAddingTags(false);
    }
  };

  const refreshTags = async () => {
    try {
      const tags = await getEventTags(eventId);
      setCurrentTags(tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to load tags');
    }
  };

  const handleAddToTag = async (tagName, mediaIndex) => {
    try {
      const updatedEvent = await updateEventTags(eventId, tagName, [mediaIndex]);
      setCurrentTags(updatedEvent.tags || {});
      toast.success(`Added to ${tagName} tag`);
      setShowTagSelector(false);
    } catch (error) {
      console.error('Error adding to tag:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to add to tag');
    }
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
    <div className="pb-12 dark:bg-gray-900 dark:text-gray-100">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

   {/* Tag Filter Section - Black Theme */}
<div className="mb-6 p-4 bg-black bg-opacity-80 rounded-lg border border-gray-800 shadow-lg">

  <div className="flex flex-wrap gap-2">
    <button
      onClick={() => setActiveTag(null)}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        !activeTag
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-700'
      }`}
    >
      All Media
    </button>
    {Object.keys(currentTags).map(tagName => (
      <button
        key={tagName}
        onClick={() => setActiveTag(tagName)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          activeTag === tagName
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-700'
        }`}
      >
        {tagName} <span className="text-blue-400">({currentTags[tagName].length})</span>
      </button>
    ))}
  </div>
</div>
    {/* Tag Management Section (only for creators) - Black Theme */}
{canUpload && (
  <div className="mb-6 p-4 bg-black bg-opacity-80 rounded-lg border border-gray-800 shadow-lg">
    <h3 className="text-lg font-medium mb-3 text-white">Manage Tags</h3>
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <input
        type="text"
        placeholder="Tag name"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        className="flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                   bg-gray-900 text-white placeholder-gray-500 border border-gray-700"
      />
      <input
        type="text"
        placeholder="Comma-separated indexes (e.g., 1, 2, 3)"
        value={integersInput}
        onChange={(e) => setIntegersInput(e.target.value)}
        className="flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                   bg-gray-900 text-white placeholder-gray-500 border border-gray-700"
      />
      <button
        onClick={handleAddTags}
        disabled={isAddingTags}
        className="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                   bg-blue-700 hover:bg-blue-600 text-white font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isAddingTags ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </span>
        ) : 'Add Tags'}
      </button>
    </div>
  
  </div>
)}

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
            const originalIndex = filteredMedia === media ? absoluteIndex : media.indexOf(item);
            
            return (
              <div key={`${absoluteIndex}`} className="relative group">
                <MediaItem
                  item={item}
                  index={originalIndex}
                  mediaType={mediaType}
                  eventId={eventId}
                  lastViewedPhoto={lastViewedPhoto}
                  lastViewedPhotoRef={lastViewedPhotoRef}
                  totalItems={media.length}
                  isLoaded={loadedImages[originalIndex]}
                  onLoad={() => handleImageLoad(originalIndex)}
                  onDownload={handleDownload}
                />
                {canUpload ==true && (
                  <button
                    onClick={() => {
                      setSelectedMediaIndex(originalIndex);
                      setShowTagSelector(true);
                    }}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Add to Tag
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <EmptyState mediaType={mediaType} />
        )}
      </div>

      {/* Tag Selector Modal */}
      {showTagSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Add to Tag</h3>
            <p className="mb-4">Select a tag to add media #{selectedMediaIndex}</p>
            <div className="space-y-2">
              {Object.keys(currentTags).map(tagName => (
                <button
                  key={tagName}
                  onClick={() => handleAddToTag(tagName, selectedMediaIndex)}
                  className="w-full text-left px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  {tagName}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowTagSelector(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;