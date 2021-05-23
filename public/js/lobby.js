const socket = io("/");
socket.on('user-connected', name => {
    console.log("user connected", name);
});

socket.on("chat-message", (message, name)=>{
    //add html elements for chat message
    console.log("chat message", message, name);
});

socket.on("join-call", ()=>{

});

async function match(course){
    let resp = await fetch("/user/queue",{
        "method":"post",
        "headers":{
            "Content-Type": "application/json"
        },
        "body":JSON.stringify({
            course
        })
    });
    return await resp.json();
}
function joinRoom(roomID, name){
    socket.emit("join-room", roomID, name);
}

function sendMessage(message, name){
    socket.emit("chat-message", message, name);
}

const videoGrid = document.getElementById('video-grid');

//video stuff
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
});

const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};
navigator.mediaDevices.getUserMedia({
    video:true, 
    audio:true
}).then(stream => {
    //stream has video and audio data
    addVideoStream(myVideo,stream);

    myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
    });

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream);
    });

    socket.on("chat-message", (author, message)=>{
        //add html elements for chat message
    });

    var disableVideo = document.getElementById("disableVideo");
    disableVideo.addEventListener("click", function (event) {
        stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
        disableVideo.innerText = stream.getVideoTracks()[0].enabled ? "Disable Video" : "Enable Video";
    });

    var muteAudio = document.getElementById("muteAudio");
    muteAudio.addEventListener("click", function(event) {
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
        muteAudio.innerText = stream.getAudioTracks()[0].enabled ? "Mute" : "Unmute";
    });
});

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close();
});

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });

    peers[userId] = call;
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video)
};