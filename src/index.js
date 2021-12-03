require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const sockets = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = sockets(server);

const port = process.env.DEV_APPLICATION_PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {

    socket.broadcast.emit('USER_JOINED','A new user has joined!');

    socket.on('SEND_MESSAGE', (message, callback) => {

        const filter = new Filter();

        if(filter.isProfane(message)) {
            callback({timestamp: Date.now(),acknowledged: false});
        }

        callback({timestamp: Date.now(),acknowledged: true});
        socket.broadcast.emit('NEW_MESSAGE', message);

    });

    socket.on('disconnect', () => {
        io.emit('USER_LEFT','A user has disconnected!');
    })

    socket.on('SHARE_LOCATION', ({latitude, longitude}, callback) => {

        callback({timestamp: Date.now(),acknowledged: true});
        socket.broadcast.emit('SEND_LOCATION', ({latitude, longitude}));
    })
    
})

server.listen(port ,() => {    
    console.log(`Server is up and running at port ${port}`);
})

module.exports = app
