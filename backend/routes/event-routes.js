const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event-controller");

// CRUD Routes
router.post("/events/create", eventController.createEvent);
router.get("/get-events", eventController.getAllEvents);
router.post("/event/:eventId", eventController.getEventById);
router.put("/:eventId", eventController.updateEvent);
router.delete("/events/:eventId", eventController.deleteEvent);
router.get("/events", eventController.getAllEvents);


// Route to get followers of an event
router.get("/event/:eventId/followers", eventController.getEventFollowers);

// New route for retrieving event media
// e.g., GET /event-media?eventId=123&mediaType=photo
router.get("/event-media", eventController.getEventMedia);

// Follow/Unfollow Routes
router.post("/:eventId/follow", eventController.followEvent);
router.post("/:eventId/unfollow", eventController.unfollowEvent);

// Message Routes
router.post("/events/:eventId/messages", eventController.addMessage); // Add a message
router.patch("/events/:eventId/messages/:messageId/read", eventController.markMessageAsRead); // Mark message as read
router.delete("/events/:eventId/messages/:messageId", eventController.deleteMessage); // Delete a message


// Follow/Unfollow Route
router.post("/:eventId/toggle-follow", eventController.toggleFollowEvent);

router.post("/events/:eventId/authenticate", eventController.authenticateEvent);

router.get("/events/user/:userId", eventController.getAllEventsByUser);

router.patch("/:eventId/update-password", eventController.updateEventPassword);

router.patch("/events/updateMedia", eventController.updateEventMedia);

router.get("/:eventId/qrcode", eventController.generateEventQRCode2);

router.post("/validate-token", eventController.validateToken);
// ✅ Route to remove a user from the invited list
router.delete("/events/:eventId/invited/:userId", eventController.removeInvitedUser);

router.post("/events/:eventId/requestCollaboration", eventController.requestToCollaborate);

router.post("/events/:eventId/acceptUser", eventController.acceptUserToEvent);

router.delete("/events/:eventId/pendingRequests/:requestId", eventController.rejectCollaborationRequest);


router.patch("/events/updateCoverPhoto", eventController.updateEventCoverPhoto);

// 🔍 New Route: Get  by Author Name (Supports Fuzzy Search)
router.post("/events/add-view", eventController.viewEvent)
router.get("/events/author", eventController.getEventsByAuthor)

router.get("/search-events", eventController.searchEvents);

module.exports = router;
