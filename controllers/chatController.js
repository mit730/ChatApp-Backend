const Chat = require('../modals/chats'); // Import the Chat model

const saveChatsMessage = async (data) => {
    try {
      // Find the room by roomId, if it doesn't exist, create a new one
      let room = await Chat.findOneAndUpdate(
        { roomId: data.roomId },
        { 
          $push: { messages: { 
            text: data.text, 
            name: data.name, 
            id: data.id, 
            socketID: data.socketID,
            timestamp: new Date()
          } }
        },
        { new: true, upsert: true }
      );
  
      console.log("Updated room document:", room);
      return room;
    } catch (error) {
      console.error("Error saving message to database:", error);
      throw error;
    }
  };

module.exports = { saveChatsMessage };
