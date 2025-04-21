import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticateEvent, requestCollaboration, likeEvent } from "../actions/event"; // Import likeEvent
import { getLoggedInUserId } from "hooks/useUser";
import { getUserById } from "actions/users";
import axios from "axios";
import socket from "hooks/socket";
import { toast } from "react-toastify";



import CoverPhoto from "./CoverPhotoBanner1";
import EventDetails from "./EventDetails";
import DropdownMenu from "./DropdownMenu";
import PasswordModal from "./PasswordModal";
import SharePopup from "./SharePopup";
import LoginPrompt from "./LoginPrompt";
import LoadingSpinner from "./LoadingSpinner";

const EventCard = ({ event }) => {
  const router = useRouter();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loadingView, setLoadingView] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [isRequestingCollaboration, setIsRequestingCollaboration] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [collaborationStatus, setCollaborationStatus] = useState("default");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = getLoggedInUserId();
    setIsLoggedIn(!!userId);
    setUser(userId);

    if (userId && event.followers.includes(userId)) {
      setIsFollowing(true);
    }

    if (userId) {
      const isCollaborating = event.invited.some((inv) => inv.invitedId.toString() === userId);
      const isPending = event.pendingRequests.some((req) => req.userId.toString() === userId);

      if (isCollaborating) {
        setCollaborationStatus("collaborating");
      } else if (isPending) {
        setCollaborationStatus("pending");
      } else {
        setCollaborationStatus("default");
      }
    }
  }, [event.followers, event.invited, event.pendingRequests]);

  // Define handleViewClick function
  const handleViewClick = async () => {
    setLoadingView(true);
    if (!event.private) {
      await router.push(`/evento/${event._id}`);
    } else {
      setShowPasswordInput(true);
    }
    setLoadingView(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await authenticateEvent({ eventId: event._id, password });
      await router.push(`/evento/${event._id}`);
    } catch (err) {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleFollowClick = async () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }

    setLoadingFollow(true);
    const userId = getLoggedInUserId();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/${event._id}/toggle-follow`,
        { userId }
      );
      const data = response.data;
      setIsFollowing(data.isFollowing);

      if (data.isFollowing) {
        socket.emit("follow_event", {
          userId,
          eventId: event._id,
          eventOwnerId: event.ownerId,
        });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }

    setLoadingFollow(false);
  };

  const toggleSharePopup = () => {
    setIsSharePopupOpen(!isSharePopupOpen);
  };

  const handleRequestCollaboration = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }

    setIsRequestingCollaboration(true);
    const userId = getLoggedInUserId();
    const user = await getUserById(userId);
    const username = user.username;

    try {
      await requestCollaboration({
        eventId: event._id,
        userId,
        username,
        socket,
      });
      setCollaborationStatus("pending");
      toast.success("Collaboration request sent successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to send collaboration request.");
    } finally {
      setIsRequestingCollaboration(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Define handleLike function
  const handleLike = async () => {
    if (!isLoggedIn) return; // Ensure user is logged in
    try {
      console.log('event', event);
   
      if (updatedLikes !== null) {
        console.log("Event liked successfully! Total likes:", updatedLikes);
      }
    } catch (error) {
      console.error("Error liking event:", error);
    }
  };

  return (
    <div
      id={event._id}
      className="font-sans relative group overflow-hidden rounded-xl shadow-2xl transform transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={(e) => {
        if (!e.target.closest("button")) {
          handleViewClick();
        }
      }}
    >
      <CoverPhoto
        coverPhoto={event.coverPhoto}
        title={event.title}
        totalImages={event.imageUrls.length}
        totalVideos={event.videoUrls.length}
        onDropdownToggle={toggleDropdown}
        author={event.author}
        event={event}
      />

      <EventDetails
        title={event.title}
        description={event.description}
        
      />

      {/* Always render DropdownMenu, but control visibility with isDropdownOpen */}
      <DropdownMenu
        isDropdownOpen={isDropdownOpen}
        event={event}
        userId={getLoggedInUserId()}
        onViewClick={() => {
          handleViewClick();
          setIsDropdownOpen(false);
        }}
        onFollowClick={() => {
          handleFollowClick();
          setIsDropdownOpen(false);
        }}
        onShareClick={() => {
          toggleSharePopup();
          setIsDropdownOpen(false);
        }}
        onCollaborateClick={(e) => {
          handleRequestCollaboration(e);
          setIsDropdownOpen(false);
        }}
        onLikeClick={handleLike} // Pass handleLike as a prop
        loadingView={loadingView}
        loadingFollow={loadingFollow}
        isFollowing={isFollowing}
        isLoggedIn={isLoggedIn}
        collaborationStatus={collaborationStatus}
        isRequestingCollaboration={isRequestingCollaboration}
        eventId={event._id}
        socket={socket}
        user={user}
      />

      {showPasswordInput && (
        <PasswordModal
          showPassword={showPassword}
          password={password}
          error={error}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onToggleShowPassword={() => setShowPassword(!showPassword)}
          onSubmit={handlePasswordSubmit}
          onClose={() => setShowPasswordInput(false)}
        />
      )}

      {isSharePopupOpen && (
        <SharePopup
          eventId={event._id}
          title={event.title}
          onClose={toggleSharePopup}
        />
      )}

      {loadingView && <LoadingSpinner isVisible={loadingView} />}

      {showLoginPrompt && <LoginPrompt onClose={() => setShowLoginPrompt(false)} />}
     
    </div>
  );
};

export default EventCard;