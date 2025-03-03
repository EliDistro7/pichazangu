// components/EventList.js
import React from "react";
import EventCard from "./EventCard";
import RandomAd from "./RandomAd";
import FeaturedEvent from "./FeaturedEvent";
import PricingBanner from "./PricingBanner";
import SearchEvents from "components/SearchEvents";

const EventList = ({ events, loading, onDelete }) => {
  if (loading) return <p>Loading events...</p>;
  if (events.length === 0) return <p>No events available.</p>;

  // Function to generate a random number between min and max
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Function to decide whether to render a random component
  const shouldRenderRandomComponent = () => {
    const randomNumber = getRandomNumber(1, 10); // Adjust probability as needed
    return randomNumber <= 3; // 30% chance to render a random component
  };

  // Function to pick a random component
  const getRandomComponent = () => {
    const components = [RandomAd, PricingBanner];
    const randomIndex = getRandomNumber(0, components.length - 1);
    const RandomComponent = components[randomIndex];
    return <RandomComponent />;
  };

  return (
    <div className="space-y-4">
      <SearchEvents />
      {events.map((event, index) => {
        // Render a random component at random intervals
        if (shouldRenderRandomComponent()) {
          return (
            <React.Fragment key={`random-${index}`}>
              {getRandomComponent()}
              <EventCard key={event._id} event={event} onDelete={onDelete} />
            </React.Fragment>
          );
        }
        // Otherwise, just render the event card
        return <EventCard key={event._id} event={event} onDelete={onDelete} />;
      })}
    </div>
  );
};

export default EventList;