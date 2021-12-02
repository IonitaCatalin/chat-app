require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const sockets = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = sockets(server);

const port = process.env.DEV_APPLICATION_PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

let count = 0;

io.on('connection', (socket) => {

    const newMessage = '';

    socket.on('sendMessage', (message) => {
        newMessage = message;
    });
    io.emit('newMessage', (newMessage));
})

server.listen(port ,() => {    
    console.log(`Server is up and running at port ${port}`);
})

module.exports = app
