const users = [];

// addUser
const addUser = ({ username, room, id }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (!room || !username) {
        return {
            error: 'username and room are required'
        }
    }

    const existingUser = users.find((user) => (user.username === username && user.room === room));
    if (existingUser) {
        return {
            error: 'username is in use!'
        };
    }

    const user = {
        username,
        id,
        room
    }
    users.push(user);
    return { user };
}


// removeUser
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }

}

//getUser
const getUser = (id) => {
    return users.find((user) => user.id === id);
}


//getUsersInRoom
getUsersInRoom = (roomName) => {
    return users.filter((user) => user.room === roomName)
}


module.exports = {
    addUser,
    getUser,
    removeUser,
    getUsersInRoom
}




