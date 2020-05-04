const express = require("express");
const dotenv = require("dotenv");
const app = express();
const shortid = require('shortid');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const bodyParser = require("body-parser");
require("express-ws")(app);
dotenv.config();

let redisClient;
if (process.env.REDISCLOUD_URL) {
    redisClient = redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});
} else {
    redisClient = redis.createClient();
}

const port = process.env.PORT || 3000;
let userCounter = -1;
let msgCounter = -1;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_SERVER}/rtw1920?retryWrites=true&w=majority`;
const mongodClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const sess = {
    secret: process.env.SESSION_SECRET,
    store: new redisStore({host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, client: redisClient, ttl: 260}),
    saveUninitialized: false,
    resave: false,
    cookie: {},
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))

mongodClient.connect().then(err => {
    const rooms = {};
    const users = mongodClient.db("rtw1920").collection("users");

    app.set("view engine", "pug");
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(express.static("static"));

    app.ws("/join/:id", (ws, req) => {
        ws.on("message", function (msg) {
            const message = JSON.parse(msg);
            if (message.type === "MOVEMENT") {
                ws.position = message.player.position;
                rooms[req.params.roomId].forEach((wsClient) => {
                    if (wsClient.uuid !== ws.uuid) {
                        message.user = ws.uuid;
                        wsClient.send(JSON.stringify(message));
                    }
                });
            } else if (message.type === "LOGIN") {
                if (!rooms[req.params.id]){
                    rooms[req.params.id] = [];
                }
                ws.uuid = userCounter;
                ws.name = message.player.user;
                ws.roomId = req.params.id
                req.session.gameId = req.params.id
                message.user = ws.uuid;
                ws.position = message.player.position;
                rooms[req.params.id].push(ws);
                rooms[req.params.id].forEach((roomClient) => {
                    if (roomClient.uuid === ws.uuid) {
                        message.own = true;
                        message.players = rooms[req.params.id].map(wsClient => {
                            if (wsClient.uuid !== ws.uuid) {
                                return {
                                    name: wsClient.name,
                                    user: wsClient.uuid,
                                    position: wsClient.position
                                }
                            } else {
                                return {
                                    me: true
                                }
                            }
                        })
                    }
                    roomClient.send(JSON.stringify(message));
                });
            } else if (message.type === 'MESSAGE') {
                msgCounter++;
                rooms[req.params.id].forEach((wsClient) => {
                    message.source = ws.uuid === wsClient.uuid? 'me' : 'other';
                    message.user = ws.name;
                    message.id = msgCounter;
                  wsClient.send(JSON.stringify(message));
                })
            }
            else {
                ws.send(
                    JSON.stringify({
                        type: "PINGPONG",
                        content: "PONG",
                    })
                );
            }
        });

        ws.on("close", () => {
            console.log("WebSocket was closed");
            rooms[req.params.id] = rooms[req.params.id].filter((wsClient) => {
                if (wsClient.uuid !== ws.uuid) {
                    wsClient.send(
                        JSON.stringify({
                            type: "LOGOUT",
                            user: ws.uuid,
                            name: ws.name
                        })
                    );
                }
                return wsClient.uuid !== ws.uuid;
            });
        });
    });

    app.post("/host", (req, res) => {
        const gameId = shortid.generate();
        let playerId;
        const playerName = req.body.name
        if (!req.session.playerId && !req.session.name) {
            userCounter++;
            playerId = userCounter;
            req.session.gameId = gameId;
            req.session.playerId = playerId;
            req.session.name = playerName;
            users.updateOne(
                {room: gameId},
                {
                    $push: {
                        players: {
                            id: playerId,
                            name: playerName
                        }
                    }
                },
                {upsert: true}
            )
        } else {
            playerId = req.session.playerId
            req.session.gameId = gameId;
            users.updateOne(
                {room: gameId},
                {
                    $push: {
                        players: {
                            id: playerId,
                            name: playerName
                        }
                    }
                },
                {upsert: true}
            )
        }
        res.render("game", {
            gameId,
            name: playerName,
            title: "Realtime Web",
            pageTitle: "Game",
        });
    });
    app.post("/join", (req, res) => {
        let playerId;
        let playerName;
        if (req.session.name && req.session.playerId) {
            playerName = req.session.name;
            playerId = req.session.playerId;
        } else {
            userCounter++;
            playerName = req.body.name;
            playerId = userCounter;
        }
        const gameId = req.body.gameId
        req.session.gameId = req.body.gameId;
        req.session.name = req.body.name;
        users.updateOne(
            {room: gameId},
            {
                $push: {
                    players: {
                        id: playerId,
                        name: playerName
                    }
                }
            },
            {upsert: true})
            .then(() => {
                res.render("game", {
                    gameId: gameId,
                    name: playerName,
                    title: "Realtime Web",
                    pageTitle: "Game",
                });
            })
    });

    app.get("/join/:gameId", (req, res) => {
        if (req.session.name) {
            userCounter++;
            res.render("game", {
                gameId: req.params.gameId,
                name: req.session.name,
                title: "Realtime Web",
                pageTitle: "Game",
            });
        } else {
            res.render("index", {
                gameId: req.params.gameId,
                title: "Realtime Web",
                pageTitle: "WebGL Multiplayer",
            });
        }
    });

    app.get("/", (req, res) => {
        if (req.session.gameId) {
            res.redirect(`/join/${req.session.gameId}`)
        } else {
            res.render("index", {
                title: "Realtime Web",
                pageTitle: "WebGL Multiplayer",
            });
        }
    });

    app.use(function (req, res, next) {
        res.status(404).render("404", {
            title: "404",
        });
    });

    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
