//TODO: Implement support for userList

require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const sockets = require('socket.io');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = sockets(server);

const port = process.env.DEV_APPLICATION_PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {

    socket.on('MESSAGE', (message, callback) => {

        const {user, error} = getUser(socket.id);

        if(error) {
            return callback(Date.now(), error );
        } 
        
        callback(Date.now(), undefined );
        socket.broadcast.to(user.room).emit('MESSAGE_SYNC', message);

    });

    socket.on('JOIN', ({username, room}, callback) => {

        const {error, user} = addUser({ id: socket.id, username: username, room: room });

        socket.join(room);
        
        if(error) {
            return callback(Date.now(), error);
        } 

        callback(Date.now(), undefined);
        socket.broadcast.to(user.room).emit('USER_SYNC', {username: user.username});
        
    });

    socket.on('LOCATION', ({latitude, longitude}, callback) => {

        const { user, error} = getUser(socket.id);

        if(error) {
            return callback(Date.now(), error);
        }

        callback(Date.now(), undefined);
        socket.broadcast.to(user.room).emit('LOCATION_SYNC', ({username: user.username, latitude, longitude}));
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('LEAVE',(user.username));
        }
    })
    
})

server.listen(port ,() => {    
    console.log(`Server is up and running at port ${port}`);
})

module.exports = app
