const mongoose = require('mongoose');
const commentSchema = require('./commentsSchemas');

const notesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    reacts: {
      type: [String],default: []
    },
    comments: [commentSchema], 
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",  
      required:true,
    },
  },
  { timestamps: true }
);

module.exports = notesSchema;
