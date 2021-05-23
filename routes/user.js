const {Router} = require("express");
const q = require("../queue");
const { v4: uuidV4 } = require('uuid')
const userRouter =  new Router();

userRouter.use((req, res, next)=>{
    //check if user is signed in
    if(!req.session.user_id){
        return res.redirect("/");
    }
    next();
});
userRouter.get("/lobby", (req, res)=>{
    console.log("get lobby");
    res.render("lobby");
});

//need to do this with a socket
userRouter.post("/queue", async (req, res)=>{
    console.log("post q");
    let {course} = req.body;
    let {user_id} = req.session;
    let user = q.findUser(course);
    if(user != null){
        console.log("found room ");
        return res.json({"roomID": user.roomID});
    }else{
        let roomID = uuidV4();
        q.addUser(user_id, course, roomID);
        console.log("creating room");
        return res.json({roomID});
    }
});

userRouter.post("/logout", (req, res) => {
    console.log("post logout");
    req.session.destroy();
    res.redirect("/");
});
userRouter.get("/logout", (req, res) => {
    console.log("post logout");
    req.session.destroy();
    res.redirect("/");
});

module.exports = userRouter;