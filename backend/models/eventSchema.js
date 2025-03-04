const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverPhoto: {
      type: String, // URL to the cover photo
    },
    imageUrls: {
      type: [String], // Array of image URLs
      default: [],
    },
    videoUrls: {
      type: [String], // Array of video URLs
      default: [],
    },
    author: {
      username: {
        type: String,
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Reference to the User model
      },
    },
    private: {
      type: Boolean,
      default: false, // By default, events are public
    },
    password: {
      type: String, // Password for private event (hashed)
      required: function () {
        return this.private; // Password is required only if the event is private
      },
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId], // Array of user IDs who follow this event
      ref: 'User',
      default: [],
    },
    views: {
      type: [mongoose.Schema.Types.Mixed], // Accepts both ObjectId and string
      default: [],
    },
    
  },
  { timestamps: true } // Automatically handles `createdAt` and `updatedAt`
);

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
