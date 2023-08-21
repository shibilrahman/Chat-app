const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
//app.get('/', (req, res) => {res.sendFile(__dirname + '/index.html');});

app.use(express.static(__dirname + '/Public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });