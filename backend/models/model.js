const mongoose = require('mongoose')
const userSchemas = require('../schemas/userSchemas')
const notesSchema = require('../schemas/notesSchemas');
const notificationSchema = require("../schemas/notificationSchemas");
const User = new mongoose.model("User", userSchemas)
const Note = new mongoose.model("Note", notesSchema)
const Notification = new mongoose.model("Notification", notificationSchema)
module.exports={User,Note,Notification}