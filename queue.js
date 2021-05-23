const { v4: uuidV4 } = require('uuid')
let users = [];

//only add user to queue if no users were found
function addUser(user_id, course, roomID) {
    users.push({ user_id, course, roomID });
    //have to open a socket connection with them until they find a user
    //when user is added, go through rest of list

    //if no user is found, create a room and attach it to that user object
}
function findUser(course) {
    for(let i = 0;i < users.length; i++){
        if(users[i].course == course){
            let {user_id, course, roomID} = users[i];
            users.splice(i, 1);
            return {user_id, course, roomID};
        }
    }
    return null;
}

function dumpUsers(){
    return users;
}

module.exports = {
    addUser,
    findUser,
    dumpUsers
}