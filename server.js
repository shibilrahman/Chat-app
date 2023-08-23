const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.static(__dirname + '/public'));

const users = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new user', (username) => {
    socket.username = username;

    if (!users.includes(username)) {
      users.push(username);
    }

    io.emit('user list', users);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      const index = users.indexOf(socket.username);
      if (index !== -1) {
        users.splice(index, 1);
        io.emit('user list', users);
      }
    }
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
