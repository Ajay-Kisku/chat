// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Store usernames and their colors
const users = {};

function getRandomColor() {
  const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6'];
  return colors[Math.floor(Math.random() * colors.length)];
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('set username', (username) => {
    users[socket.id] = {
      name: username,
      color: getRandomColor()
    };
    console.log(`${username} has joined with color ${users[socket.id].color}`);
  });

  socket.on('chat message', (msg) => {
    const user = users[socket.id];
    io.emit('chat message', {
      user: user?.name || 'Anonymous',
      color: user?.color || '#000',
      message: msg
    });
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
