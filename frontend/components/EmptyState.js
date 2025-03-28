

const EmptyState = ({ mediaType }) => {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No {mediaType === "photo" ? "images" : "videos"} available.
        </p>
      </div>
    );
  };
  
  export default EmptyState;