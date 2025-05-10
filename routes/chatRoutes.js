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


module.exports = router;
