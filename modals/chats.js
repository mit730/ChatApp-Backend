const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: String,
  name: String,
  id: String,
  socketID: String,
  timestamp: { type: Date, default: Date.now },
  isMedia: { type: Boolean, default: false },
  mediaUrl: String, // URL to the uploaded image
});

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  messages: [messageSchema],
});

module.exports = mongoose.model('Room', roomSchema);

