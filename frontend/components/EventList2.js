

import React from "react";
import EventCard from "components/EventCard2";

const EventList = ({ events, handleViewEvent, handleEditEvent, handleDeleteEvent }) => {
  if (events.length === 0) {
    return <p>No events found. Create one to get started!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          handleViewEvent={handleViewEvent}
          handleEditEvent={handleEditEvent}
          handleDeleteEvent={handleDeleteEvent}
        />
      ))}
    </div>
  );
};

export default EventList;