import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getAllEvents, createEvent, deleteEvent } from "../actions/event";
import EventForm from "../components/EventForm";
import EventList from "../components/EventList";
import { getLoggedInUserId, getLoggedInUsername } from "../hooks/useUser";
import { Plus } from "lucide-react";
import SearchEvents from "components/SearchEvents";

const Events = () => {
  const router = useRouter();
  const { tab } = router.query;

  const loggedInUserId = getLoggedInUserId();
  const loggedInUsername = getLoggedInUsername();

  const [activeTab, setActiveTab] = useState(tab || "recent");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventToCreate) => {
    try {
      console.log('Creating event', eventToCreate);
      const result = await createEvent(eventToCreate);
      setEvents((prevEvents) => [result.event, ...prevEvents]);
      setActiveTab("recent");
      router.push("/events?tab=recent"); // Update URL
    } catch (err) {
      setError("Error creating event.");
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      setEvents((prevEvents) => prevEvents.filter((ev) => ev._id !== id));
    } catch (err) {
      setError("Error deleting event.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <SearchEvents />
      <div className="max-w-4xl mx-auto">
        <div className="flex border-b border-gray-700 mb-4">
          <button
            onClick={() => router.push("/events?tab=recent")}
            className={`px-4 py-2 focus:outline-none ${
              activeTab === "recent" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
            }`}
          >
            Albums
          </button>
          <button
            onClick={() => router.push("/events?tab=create")}
            className={`px-4 py-2 focus:outline-none ${
              activeTab === "create" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
            }`}
          >
            Create
          </button>
        </div>

        {activeTab === "create" ? (
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Plus size={24} className="mr-2" /> Create New Album
            </h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <EventForm onSubmit={handleCreateEvent} loggedInUsername={loggedInUsername} loggedInUserId={loggedInUserId} />
          </section>
        ) : (
          <section>
            <EventList events={events} loading={loading} onDelete={handleDeleteEvent} />
          </section>
        )}
      </div>
    </div>
  );
};

export default Events;
