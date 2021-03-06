document.querySelector("#match").addEventListener("click", async () => {
    document.querySelector("div.prelobby").style.display = "none";
    document.querySelector("div.grid").style.display = "grid";
    let course = document.querySelector("#course_input").value;

    let { roomID } = await match(course);
    joinRoom(roomID, "");
});

document.querySelector("#join_call").addEventListener("click", async () => {
    joinCall();
    document.querySelector("div.join_call").style.display = "none";
});

document.querySelector("#chat_send").addEventListener("click", async () => {
    let text = document.querySelector("#chat_textbox").value;
    if (text == "") return;
    document.querySelector("#chat_textbox").value = "";
    sendMessage(text, "asdf");
});

document.querySelector("#chat_textbox").addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
        let text = document.querySelector("#chat_textbox").value;
        if (text == "") return;
        document.querySelector("#chat_textbox").value = "";
        sendMessage(text, "asdf");
    }
});

//html element references
const videoGrid = document.getElementById("video-grid");
const chatbox = document.querySelector("#chatbox");
//initialize connections
const socket = io("/");
const myPeer = new Peer(undefined, { host: "/", port: "3001" });
const peers = {};

//store the peer id for self
let self_id = null;
myPeer.on("open", (id) => {
    self_id = id;
});

//socket handlers first
function joinRoom(roomID, name) {
    if (!self_id) {
        throw "peer_js not set up yet";
    }
    socket.emit("join-room", roomID, name, self_id);
}

socket.on("user-connected", (name) => {
    console.log("user connected", name);
});

socket.on("chat-message", (message, name) => {
    //add html elements for chat message
    console.log("chat message", message, name);
    addChatMessage(message, name);
});

socket.on("addTodo", (task) => {
    console.log(partnerList);
    console.log("adding todo", task);
    partnerList.addTodo(task);
});
socket.on("doneTodo", (todoId) => {
    partnerList.doneTodo(todoId);
});
socket.on("deleteItem", (x) => {
    partnerList.deleteItem(x);
});

socket.on("startTimer", (timer) => {
    console.log("startTimer", timer);
    startTimer(timer);
});
socket.on("stopTimer", () => {stop()});
socket.on("resetTimer", () => {reset()});

async function match(course) {
    let resp = await fetch("/user/queue", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            course,
        }),
    });
    return await resp.json();
}
function sendMessage(message, name) {
    addChatMessage(message, "You");
    socket.emit("chat-message", message, name);
}

//video stuff
const self_video = document.createElement("video");
function joinCall() {
    navigator.mediaDevices
        .getUserMedia({
            video: true,
            audio: true,
        })
        .then((self_stream) => {
            socket.emit("join-call");
            addVideoStream(self_video, self_stream);

            myPeer.on("call", (call) => {
                console.log("getting called");
                call.answer(self_stream);
                const video = document.createElement("video");
                call.on("stream", (userVideoStream) => {
                    addVideoStream(video, userVideoStream);
                });
            });

            socket.on("join-call", (peer_id) => {
                connectToNewUser(peer_id, self_stream);
            });

            var disableVideo = document.getElementById("disableVideo");
            disableVideo.addEventListener("click", function (event) {
                self_stream.getVideoTracks()[0].enabled = !self_stream.getVideoTracks()[0].enabled;
                disableVideo.innerText = self_stream.getVideoTracks()[0].enabled ? "Disable Video" : "Enable Video";
            });

            var muteAudio = document.getElementById("muteAudio");
            muteAudio.addEventListener("click", function (event) {
                self_stream.getAudioTracks()[0].enabled = !self_stream.getAudioTracks()[0].enabled;
                muteAudio.innerText = self_stream.getAudioTracks()[0].enabled ? "Mute" : "Unmute";
            });
        });
}

self_video.muted = true;
socket.on("user-disconnected", (peer_id) => {
    if (peers[peer_id]) peers[peer_id].close();
});

function connectToNewUser(peer_id, self_stream) {
    console.log("connecting to new user");
    const call = myPeer.call(peer_id, self_stream);
    const video = document.createElement("video");
    call.on("stream", (peer_stream) => {
        addVideoStream(video, peer_stream);
    });

    call.on("close", () => {
        console.log("call closed");
        video.remove();
    });

    peers[peer_id] = call;
}

function addVideoStream(video_element, stream_obj) {
    video_element.srcObject = stream_obj;
    video_element.addEventListener("loadedmetadata", () => {
        video_element.play();
    });
    videoGrid.append(video_element);
}

function addChatMessage(message, name) {
    let message_div = document.createElement("div");
    message_div.classList.add("message");

    let username_p = document.createElement("p");
    username_p.classList.add("username");
    username_p.innerText = name;

    let userChat_p = document.createElement("p");
    userChat_p.classList.add("userChat");
    userChat_p.innerText = message;

    message_div.append(username_p, userChat_p);

    chatbox.append(message_div);
}
