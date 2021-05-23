const { Router } = require("express");
const bcrypt = require("bcrypt");
const db = require("../dbWrapper");

const accountRoutes = new Router();

accountRoutes.use((req, res, next)=>{
    if(req.session.user_id){
        return res.redirect("/user/lobby");
    }
    next();
});

accountRoutes.get("/login", (req, res) => {
    console.log("get login");
    res.render("login");
});

accountRoutes.post("/login", async (req, res) => {
    console.log("post login");
    let { email, password } = req.body;

    try {
        let account = await db(`Accounts`).select().where("email", email);
        if (account.length == 0) {
            res.status(400);
            return res.send("Invalid email");
        }

        if(!bcrypt.compareSync(password, account[0].hash)){
            res.status(400);
            return res.send("Invalid password");
        }
        req.session.user_id = account[0].id;
        console.log(req.sessionID)

        // let websocket_token = generateString(50);
        // await db(`Accounts`).where("email", email).update({websocket_token});
        res.redirect("/user/lobby");
        // res.send(websocket_token);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

accountRoutes.get("/register", (req, res) => {
    console.log("get register");
    res.render("register");
});

accountRoutes.post("/register", async (req, res) => {
    console.log("post register");
    console.log(req.body);
    try {
        let { name, email, password, major } = req.body;

        //check if email exsits

        //do passowrd hashing
        let hash = await bcrypt.hash(password, 12);

        //add to db
        let id = await db("Accounts").insert({ name, email, hash, major });

        req.session.user_id = id;
        res.redirect("/user/lobby");
    } catch (err) {
        res.sendStatus(500);
    }
});

function generateString(length) {
    let alpha = "abcdefghijklmnopqrstuvwxyz";
    let string = "";
    for (let i = 0; i < length; i++) {
        string += alpha[parseInt(Math.random() * alpha.length)];
    }
    return string;
}

module.exports = accountRoutes;
