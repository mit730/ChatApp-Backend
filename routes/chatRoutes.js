const express = require('express');
const { saveChatsMessage } = require('../controllers/chatController'); // Adjust path if necessary
const Room = require('../modals/chats');
const verifyToken = require('../auth');

const router = express.Router();

// Route for user registration
router.post('/savechat', saveChatsMessage);


router.get('/history', verifyToken, async (req, res) => {
  try {
    const roomId = req.query.roomId;
    const room = await Room.findOne({ roomId });
    console.log(typeof room, "room");
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(200).json({ messages: [] });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chat history' });
  }
});

router.get('/search', verifyToken, async (req, res) => {
  const { roomId, query, type, date } = req.query;

  try {
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    let messages = room.messages || [];

    // Filter by query (case-insensitive search in text)
    if (query) {
      messages = messages.filter((msg) =>
        msg.text.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by message type (e.g., text, media)
    if (type) {
      messages = messages.filter((msg) => {
        if (type === 'text') return !msg.isMedia;
        if (type === 'media') return msg.isMedia;
        return true;
      });
    }

    // Filter by date (if provided)
    if (date) {
      const targetDate = new Date(date);
      messages = messages.filter((msg) => {
        const msgDate = new Date(msg.timestamp);
        return (
          msgDate.getFullYear() === targetDate.getFullYear() &&
          msgDate.getMonth() === targetDate.getMonth() &&
          msgDate.getDate() === targetDate.getDate()
        );
      });
    }

    res.json({ messages });
  } catch (error) {
    console.error('Error searching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
