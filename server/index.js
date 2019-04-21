require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const authCtrl = require("./controllers/authController");
const treasureCtrl = require("./controllers/treasureController");
const auth = require("./middleware/authMiddleware")


const {CONNECTION_STRING, SERVER_PORT, SESSION_SECRET} = process.env;

const app = express();

app.use(express.json())

massive(CONNECTION_STRING)
    .then(dbInstance => {
        app.set("db", dbInstance)
        
    })
    .catch(err => console.log(err));

app.use(session({
    secret:SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

app.post("/auth/register", authCtrl.register)
app.post("/auth/login", authCtrl.login)
app.get("/auth/logout", authCtrl.logout)

app.get( '/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)

app.post("/api/treasure/user", auth.usersOnly, treasureCtrl.addUserTreasure)
app.get("/api/treasure/all", auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)

app.listen(SERVER_PORT, () => {
    console.log(`I am listening on ${SERVER_PORT}`)
})