import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { acceptUserToEvent, rejectCollaborationRequest } from "../actions/event";

const CollaborationRequests = ({ event, user, socket, activeTab }) => {
  const [loadingId, setLoadingId] = useState(null);

  const handleAccept = async (eventId, userId, username) => {
    setLoadingId(userId);
    try {
      await acceptUserToEvent({
        eventId,
        userId,
        username,
        authorId: user, // Ensure only event owner can accept
        socket,
        senderName: user.username,
      });

      toast.success(`${username} has been accepted to the event!`, { theme: "dark" });
    } catch (error) {
      toast.error(error.message || "Failed to accept request", { theme: "dark" });
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (eventId, requestId) => {
    setLoadingId(requestId);
    try {
      await rejectCollaborationRequest({ eventId, requestId, socket });

      toast.success("Request rejected successfully", { theme: "dark" });
    } catch (error) {
      toast.error(error.message || "Failed to reject request", { theme: "dark" });
    } finally {
      setLoadingId(null);
    }
  };

  if (
    (activeTab === "collaborators" && (!event.invited || event.invited.length === 0)) ||
    (activeTab === "pending" && (!event.pendingRequests || event.pendingRequests.length === 0))
  ) {
    return null;
  }

  return (
    <div className="mb-4 w-full">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar theme="dark" />
      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
  
      {/* Collaborators Tab */}
      {activeTab === "collaborators" && (
        <div className="w-full">
          <h4 className="text-sm font-semibold mb-2">Invited Users</h4>
          {event.invited.map((invite) => (
            <div
              key={invite.invitedId}
              className="flex items-center justify-between mb-2 p-2 bg-gray-800 rounded-lg w-full"
            >
              <p className="text-sm truncate">{invite.username}</p>
              <button
                onClick={() => handleReject(event._id, invite.invitedId)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md"
                disabled={loadingId === invite.invitedId}
              >
                {loadingId === invite.invitedId ? "Removing..." : "Remove"}
              </button>
            </div>
          ))}
        </div>
      )}
  
      {/* Pending Requests Tab */}
      {activeTab === "pending" && (
        <div className="w-full">
          <h4 className="text-sm font-semibold mb-2">Requests</h4>
          {event.pendingRequests.map((request) => (
            <div
              key={request.userId}
              className="flex items-center justify-between mb-2 p-2 bg-gray-800 rounded-lg w-full"
            >
              <div className="flex-1 overflow-hidden">
                <p className="text-sm truncate">{request.username}</p>
                <p className="text-xs text-gray-400 truncate">
                  {new Date(request.requestedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAccept(event._id, request.userId, request.username)}
                  className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md"
                  disabled={loadingId === request.userId}
                >
                  {loadingId === request.userId ? "Accepting..." : "Accept"}
                </button>
                <button
                  onClick={() => handleReject(event._id, request.userId)}
                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md"
                  disabled={loadingId === request.userId}
                >
                  {loadingId === request.userId ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default CollaborationRequests;
