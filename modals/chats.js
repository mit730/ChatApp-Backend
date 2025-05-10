// const mongoose  = require("mongoose");

// const messageSchema = new mongoose.Schema({
//     sender: String,
//     receiver: String,
//     text: String,
//     roomId: String,
//     timestamp: { type: Date, default: Date.now }
// })

// const Message = mongoose.model("Message", messageSchema)

// module.exports = Message;

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    messages: [
        {
            text: { type: String, required: true },
            name: { type: String, required: true },
            id: { type: String, required: true },
            socketID: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Room', roomSchema);

