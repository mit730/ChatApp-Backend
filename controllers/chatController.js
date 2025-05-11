const Chat = require('../modals/chats'); // Import the Chat model

const saveChatsMessage = async (data) => {
  try {
    const room = await Chat.findOneAndUpdate(
      { roomId: data.roomId },
      {
        $push: {
          messages: {
            text: data.text || '',
            name: data.name,
            id: data.id,
            socketID: data.socketID,
            timestamp: data.timestamp || new Date(),
            isMedia: data.isMedia || false,
            mediaUrl: data.mediaUrl || '',
          },
        },
      },
      { new: true, upsert: true }
    );
    return room.messages[room.messages.length - 1];
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

module.exports = { saveChatsMessage };

module.exports = { saveChatsMessage };
