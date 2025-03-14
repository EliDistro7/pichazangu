import React, { useState } from "react";
import CollaborationRequests from "./CollaborationRequests";

const CollaborationRequestsSection = ({ events, user, socket }) => {
  const [activeTab, setActiveTab] = useState("collaborators"); // Default tab

  // Calculate the total number of collaborators and pending requests across all events
  const totalCollaborators = events.reduce(
    (acc, event) => acc + (event.invited?.length || 0),
    0
  );
  const totalPendingRequests = events.reduce(
    (acc, event) => acc + (event.pendingRequests?.length || 0),
    0
  );

  return (
    <div className="mb-6 w-full">
      <h2 className="text-xl font-thin mb-4">Collaboration Requests</h2>
  
      {/* Tabs */}
      <div className="flex space-x-4 mb-4 border-b border-gray-700 w-full">
        <button
          onClick={() => setActiveTab("collaborators")}
          className={`pb-2 text-sm font-semibold ${
            activeTab === "collaborators"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Collaborators ({totalCollaborators})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-2 text-sm font-semibold ${
            activeTab === "pending"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
        Requests ({totalPendingRequests})
        </button>
      </div>
  
      {/* Tab Content */}
      <div className="w-full">
        {events.map((event) => (
          <div key={event._id} className="w-full">
            <CollaborationRequests
              event={event}
              user={user}
              socket={socket}
              activeTab={activeTab}
            />
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default CollaborationRequestsSection;