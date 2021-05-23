const io = require('socket.io')(4000, {
    cors: {
        origin: "*",
    },
}); //creates server on port 4000

const users = {}

io.on('connection', socket => { //everytime user loads website, calls function and gives each user their own socket
    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.emit('user-connected', name);
    });
    socket.on('send-chat-message', message => {
        socket.emit('chat-message', {message: message, name: users[socket.id]});
    });
    socket.on('disconnect', () => {
        socket.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
        
    });
});

