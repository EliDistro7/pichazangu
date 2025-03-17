
// components/EventDetails.js
const EventDetails = ({ title, description }) => {
    return (
      <div className="absolute bottom-3 left-0 right-0 p-4 ">
       
      
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{title}</h2>
        <p className="text-white text-sm line-clamp-2">{description}</p>
       
        
      </div>
    );
  };
  
  export default EventDetails;