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

io.on('connection', (socket) => {

    socket.on('MESSAGE', (message, callback) => {
        
        callback({timestamp: Date.now(),acknowledged: true});
        socket.broadcast.emit('MESSAGE_SYNC', message);

    });

    socket.on('JOIN', ({username, room}) => {

        socket.join(room);
        socket.broadcast.to(room).emit('USER_SYNC', {username});
    });

    socket.on('LOCATION', ({latitude, longitude}, callback) => {

        callback({timestamp: Date.now(),acknowledged: true});
        socket.broadcast.emit('LOCATION_SYNC', ({latitude, longitude}));
    });
    
})

server.listen(port ,() => {    
    console.log(`Server is up and running at port ${port}`);
})

module.exports = app
