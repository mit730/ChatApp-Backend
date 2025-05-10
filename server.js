const express = require("express");
const mongoose = require('mongoose');
require('dotenv').config();
const http = require("http");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const { saveChatsMessage } = require("./controllers/chatController");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});

app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// Middleware for socket.io to verify JWT token
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided.'));
  }

  try {
    const decoded = jwt.verify(token, 'chatapp@123');
    socket.user = decoded; // Attach user info to socket
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token.'));
  }
});

// ==========================================================================================

io.on('connection', (socket) => {
  console.log(`${socket.user.username} (ID: ${socket.user.userId}) just connected`);

  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`${socket.user.username} joined room: ${roomId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      console.log("Received message data:", data);
      await io.to(data.roomId).emit('messageResponse', data);
      console.log(`Message broadcasted to room ${data.roomId}:`, data);
      
      const savedMessage = await saveChatsMessage(data);
      console.log("Message saved to database:", savedMessage);
    } catch (error) {
      console.error("Error handling send_message:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`${socket.user.username} disconnected`);
  });
});

// ============================================================================================

const url = process.env.MONGODB_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Database is connected');
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
};

connectDB();

const PORT = 5001;
server.listen(PORT, () => console.log(`Server is running on ${PORT}`));