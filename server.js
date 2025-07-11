// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));




const users = {};

function getRandomColor() {
  const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6'];
  return colors[Math.floor(Math.random() * colors.length)];
}

io.on('connection', (socket) => {
  socket.on('set username', (username) => {
    users[socket.id] = {
      name: username,
      color: getRandomColor(),
    };
    io.emit('info', `${username} has joined the chat.`);
  });

  socket.on('chat message', (msg) => {
    const user = users[socket.id];
    io.emit('chat message', {
      user: user?.name || 'Guest',
      color: user?.color || '#000',
      message: msg,
    });
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
