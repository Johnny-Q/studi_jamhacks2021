require("dotenv").config();
const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const session = require("express-session");
const bodyparser = require("body-parser");
const SQLiteStore = require("connect-sqlite3")(session);
let session_store = new SQLiteStore();
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.session_secret,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, //1 hour -> extended to one week upon client request, no sensitive information can be accessed anyways, and all orders are human verified
            httpOnly: false,
        },
        // resave: true,
        store: session_store,
        saveUninitialized: false,
        unset: "destroy",
    })
);
/*
CREATE TABLE "Accounts"{
	"id" INTEGER NOT NULL UNIQUE,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"hash" TEXT NOT NULL,
	"major" TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
};
CREATE TABLE "AccountCourseConnect"(
	"id" INTEGER NOT NULL UNIQUE,
	"account_id" INTEGER NOT NULL UNIQUE,
	"course" TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("account_id") REFERENCES "Accounts" (id) ON UPDATE CASCADE ON DELETE CASCADE
);
*/

// app.get('/', (req, res) => {
//     res.redirect(`/${uuidV4()}`);
// });

// app.get('/:room', (req, res) => {
//     res.render('room', {roomId: req.params.room })
// });

app.get("/", (req, res)=>{
    if(req.session.user_id){
        return res.redirect("/user/lobby");
    }
    res.render("index");
});

app.use("/account", require("./routes/account"));
app.use("/user", require("./routes/user"));

//implement socket authentication somehow
//set javascript cookie?, intercept HTTP request for upgrading protocols and look at HTTP only cookies there?
io.on('connection', socket => {
    console.log("established socket connection with client");


    socket.on('join-room', (roomID, name, peerjs_id) => {
        console.log("join-room", roomID, name, peerjs_id);
        socket.join(roomID);
        socket.to(roomID).emit('user-connected', name);

        socket.on("join-call", ()=>{
            socket.to(roomID).emit("join-call", peerjs_id);
        });

        socket.on('disconnect', () => {
            socket.to(roomID).emit('user-disconnected', peerjs_id);
        });

        socket.on("chat-message", (message, name)=>{
            console.log("message", message, name);
            socket.to(roomID).emit("chat-message", message, name);
        });
    });
});
server.listen(process.env.port);