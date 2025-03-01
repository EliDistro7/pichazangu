

// components/EventList.js
import React from "react";
import EventCard from "./EventCard";

const EventList = ({ events, loading, onDelete }) => {
  if (loading) return <p>Loading events...</p>;
  if (events.length === 0) return <p>No events available.</p>;

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard key={event._id} event={event} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default EventList;