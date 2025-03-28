

import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  jumpToPage,
  onJumpToPageChange,
  onJumpSubmit
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 p-3 bg-gray-800/90 backdrop-blur-sm rounded-full shadow-xl border border-gray-700">
        <button
          onClick={() => onPageChange(currentPage - 1)}
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
          onClick={() => onPageChange(currentPage + 1)}
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
            onChange={onJumpToPageChange}
            placeholder="Page"
            className="w-16 px-3 py-1 text-sm bg-gray-700 border border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 placeholder-gray-400 text-center"
          />
          <button
            onClick={onJumpSubmit}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
            title="Go to Page"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;