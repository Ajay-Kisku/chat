// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const users = {};
const chatHistory = []; // 🕘 Step 1: Chat history array

function getRandomColor() {
  const colors = ['#e6194b', '#3cb44b', '#ff4f19ff', '#4363d8', '#f58231', '#911eb4', '#f032e6'];
  return colors[Math.floor(Math.random() * colors.length)];
}

io.on('connection', (socket) => {

  

  // // Client IP address (if not behind proxy)
  // const ip = socket.handshake.address;
  // console.log('Client IP:', ip);

  // // Optional: Any query data (if sent by client)
  // console.log('Query:', socket.handshake.query);

  // // Optional: Custom headers (e.g., user-agent)
  // console.log('Headers:', socket.handshake.headers);

  // // Optional: If you're passing user info via `auth`
  // console.log('Auth data:', socket.handshake.auth);


  // 🕘 Step 2: Send chat history to new user
  socket.emit('chat history', chatHistory);

  socket.on('set username', (username) => {
    users[socket.id] = {
      name: username,
      color: getRandomColor(),
    };
    io.emit('info', `${username} has joined the chat.`);
  });

  socket.on('typing', (isTyping) => {
    const user = users[socket.id]?.name || "GuestZ";
    socket.broadcast.emit('typing', { user, isTyping });
  });

  socket.on('chat message', (msg) => {
    const user = users[socket.id];
    const messageData = {
      user: user?.name || 'Guest',
      color: user?.color || '#000',
      message: msg,
      timestamp: new Date().toISOString(),
    };

    // 🕘 Step 3: Save message in history
    chatHistory.push(messageData);
    if (chatHistory.length > 100) chatHistory.shift(); // Keep last 100 messages

    io.emit('chat message', messageData);
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      io.emit('info', `${user.name} has left the chat.`);
      delete users[socket.id];
    }
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
