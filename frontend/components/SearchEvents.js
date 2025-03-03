import React, { useState } from "react";
import { useRouter } from "next/router";
import { Search, Loader2 } from "lucide-react";
import { searchEvents } from "actions/event";

const SearchEvents = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false); // Tracks if a search has been made

  const handleSearch = async () => {
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true); // Mark that a search has been initiated

    try {
      const response = await searchEvents(username);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.response?.data?.error || "Failed to fetch events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      {/* Search Input */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter..."
          className="flex-1 p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {/* Before Search UI */}
      {!searched && (
        <p className="mt-6 text-gray-400 text-sm text-center">
          Search for events by entering a username or title of the event/album
        </p>
      )}

      {/* Events List */}
      {searched && events.length > 0 ? (
        <div className="mt-6 space-y-4">
          {events.map((event) => (
            <button
              key={event._id}
              onClick={() => router.push(`/evento/${event._id}`)}
              className="w-full text-left p-4 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition-all"
            >
              <h3 className="text-lg font-semibold text-white">{event.title}</h3>
              <p className="text-sm text-gray-400">{event.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Created by: <span className="text-blue-400">{event.author.username}</span>
              </p>
            </button>
          ))}
        </div>
      ) : (
        searched && !loading && <p className="mt-4 text-gray-400">No events found.</p>
      )}
    </div>
  );
};

export default SearchEvents;
