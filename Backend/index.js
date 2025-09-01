//external imports
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require('cors');

// internal imports
const loginRouter = require("./routers/loginRouter");
const usersRouter = require("./routers/usersRouter");
const inboxRouter = require("./routers/inboxRouter");
const app = express();
const server = http.createServer(app);
dotenv.config();

const allowedOrigins = process.env.NODE_ENV === 'production'
      ? ["http://localhost:5000", "https://my-chat-6blp.onrender.com"]
      : process.env.APP_URL;

// cross-platform access 
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// database connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("database connection successful!"))
  .catch((err) => console.log(err));

// request parsers
app.use(express.json());

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// Socket.IO setup with CORS
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
global.io = io;

// Store user socket mappings
const userSockets = new Map();

io.on('connection', (socket) => {

  // Handle user joining their personal room
  socket.on('join_user', (userId) => {
    // Store the socket for this user
    userSockets.set(userId, socket.id);

    // Join personal room
    socket.join(`user_${userId}`);
    socket.userId = userId; // Store userId on socket for reference

    // Emit confirmation back to user
    socket.emit('joined_user_room', { userId, socketId: socket.id });
  });

  // Handle joining conversation rooms
  socket.on('join_conversation', (data) => {
    const { conversationId, userId } = data;
    socket.join(`conversation_${conversationId}`);

    // Emit confirmation
    socket.emit('joined_conversation', { conversationId });
  });

  // Handle leaving conversation rooms
  socket.on('leave_conversation', (data) => {
    const { conversationId, userId } = data;
    socket.leave(`conversation_${conversationId}`);
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    // Broadcast to conversation room AND both user rooms
    socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
      userId: data.userId,
      userName: data.userName,
      isTyping: data.isTyping,
      conversationId: data.conversationId
    });
  });

  socket.on('disconnect', () => {
    // Remove from user socket mapping
    if (socket.userId) {
      userSockets.delete(socket.userId);
    }
  });
});

// REST route (for testing)
app.use("/api/login", loginRouter);
app.use("/api/logout", loginRouter);
app.use("/api/auth/check", loginRouter);
app.use("/api/signup", usersRouter);
app.use("/api/users", usersRouter);
app.use("/api/inbox", inboxRouter);
app.use("/api/verify-reset-token", usersRouter);

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../Frontend/dist')));

  // Handle React routing, return all requests to React app
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/dist', 'index.html'));
  });
} else {
  //Backend Check
  app.get("/", (req, res) => {
    return res.status(200).send("Server is running");
  });
}

server.listen(process.env.PORT, () => {
  console.log(`app listening to port  http://localhost:${process.env.PORT}/`);
});