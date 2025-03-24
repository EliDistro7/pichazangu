

const EventCoverPhoto = ({ coverPhoto, title, children }) => (
    <div className="relative h-48">
      <img src={coverPhoto} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      {children}
    </div>
  );
  
  export default EventCoverPhoto;