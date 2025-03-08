import React from "react";
import EventCard from "./EventCard";
import RandomAd from "./RandomAd";
import PricingBanner from "./PricingBanner";
import SearchEvents from "components/SearchEvents";

const EventList = ({ events, loading, onDelete }) => {
  if (loading) return <p>Loading events...</p>;
  if (events.length === 0) return <p>No events available.</p>;

  // Function to shuffle the events array using the Fisher-Yates algorithm
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  // Shuffle the events array
  const shuffledEvents = shuffleArray([...events]);

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
    <div className="space-y-4 p-4">
      <SearchEvents />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {shuffledEvents.map((event, index) => {
          // Render a random component at random intervals
          if (shouldRenderRandomComponent()) {
            return (
              <React.Fragment key={`random-${index}`}>
                <div className="col-span-full"> {/* Full-width for random components */}
                  {getRandomComponent()}
                </div>
                <EventCard key={event._id} event={event} onDelete={onDelete} />
              </React.Fragment>
            );
          }
          // Otherwise, just render the event card
          return <EventCard key={event._id} event={event} onDelete={onDelete} />;
        })}
      </div>
    </div>
  );
};

export default EventList;