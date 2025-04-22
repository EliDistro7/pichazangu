import React, { useState, useEffect } from "react";
import { getAllEvents, createEvent, deleteEvent } from "../actions/event";
import EventForm from "../components/EventForm";
import EventList from "../components/EventList";

import { getLoggedInUserId, getLoggedInUsername } from "../hooks/useUser";
import { Plus } from "lucide-react";
import Link from "next/link";
import Modal from "../components/SimpleModal"; // Import the Modal component

const Events = () => {
  const loggedInUserId = getLoggedInUserId();
  const loggedInUsername = getLoggedInUsername();

  const [activeTab, setActiveTab] = useState("recent");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
    if (!loggedInUserId) {
      setShowLoginModal(true); // Show the modal if the user is not logged in
      return;
    }

    try {
      const result = await createEvent(eventToCreate);
      setEvents((prevEvents) => [result.event, ...prevEvents]);
      setActiveTab("recent");
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
    <div className="min-h-screen bg-black text-white p-4 px-0">
      <div className="w-full mx-0">
     
       

        {activeTab === "create" ? (
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Plus size={24} className="mr-2" /> Create New Event
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

      {/* Modal for Login Prompt */}
      {showLoginModal && (
        <Modal onClose={() => setShowLoginModal(false)}>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Please Log In</h2>
            <p className="mb-4">You need to log in first before you can submit your created event.</p>
            <Link href="/login">
              <a className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Go to Login
              </a>
            </Link>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Events;