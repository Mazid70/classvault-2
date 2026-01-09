const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ['note', 'announcement', 'approval', 'react', 'comment'],
    },

    // null = for all users
    receiverStudentId: {
      type: String,
      default: null,
    },

    // who already read
    readBy: {
      type: [String],
      default: [],
    },

    // ✅ NEW: who deleted this notification
    deletedBy: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// auto delete after 60 days
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 24 * 60 * 60 }
);

module.exports = notificationSchema;
