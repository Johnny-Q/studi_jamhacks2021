const { v4: uuidV4 } = require('uuid')
let users = [{
    "user_id": 69,
    "course": "asdf",
    "roomID": uuidV4()
},
{
    "user_id": 69,
    "course": "few",
    "roomID": uuidV4()
},
{
    "user_id": 69,
    "course": "cs150",
    "roomID": uuidV4()
},
{
    "user_id": 69,
    "course": "asdf",
    "roomID": uuidV4()
}];

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
            return users[i]
        }
    }
    return null;
    // let course_match = [];
    // for (let i = 0; i < users.length; i++) {
    //     if (users[i].course == course) {
    //         course_match.push(users[i].id);
    //         if (users[i].major == major) {
    //             return users[i].id;
    //         }
    //     }
    // }
}

function dumpUsers(){
    return users;
}

module.exports = {
    addUser,
    findUser,
    dumpUsers
}