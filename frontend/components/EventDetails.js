
// components/EventDetails.js
const EventDetails = ({ title, description, author }) => {
    return (
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-transparent to-transparent">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{title}</h2>
        <p className="text-white text-sm line-clamp-2">{description}</p>
        <p className="text-xs text-gray-300 opacity-75 mb-1">by {author.username}</p>
      </div>
    );
  };
  
  export default EventDetails;