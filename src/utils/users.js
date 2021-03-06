const users = [];

const addUser = ({id, username, room}) => {

    // Clean the data

    username = username.trim();
    room = room.trim().toLowerCase();

    if(!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });


    if(existingUser) {
        return {
            error: 'Username is in use'
        }
    }

    const user = { id, username, room};

    users.push(user);
    return { user }
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) {
        return users.splice(index,1);
    }
};

const getUser = (id) => {
    const user = users.find((user) => {
        return user.id === id;
    })

    if(!user) {
        return {
            error: 'User not found'
        }
    }

    return { user }
};

const getUsersInRoom = (room) => {

    room = room.trim().toLowerCase();

    return users.filter((user) => user.room === room);
};


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}