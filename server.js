const express = require("express");
const app = express();
require("express-ws")(app);
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT || 3000;
let userCounter = -1;
let msgCounter = -1;
// const MongoClient = require ( 'mongodb' ).MongoClient;
// const uri = `mongodb+srv://${ process.env.MONGODB_USER }:${ process.env.MONGODB_PASSWORD }@${ process.env.MONGODB_SERVER }/rtw1920?retryWrites=true&w=majority`;
// const client = new MongoClient ( uri, { useNewUrlParser: true, useUnifiedTopology: true } );
//
// client.connect ( err => {
//     const collection = client.db ( "rtw1920" ).collection ( "users" );
let wsClients = [];
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("static"));

app.ws("/join", (ws, req) => {
	++userCounter;
	ws.on("message", function (msg) {
		const message = JSON.parse(msg);
		if (message.type === "MOVEMENT") {
			wsClients.forEach((wsClient) => {
				if (wsClient.uuid !== ws.uuid) {
					message.user = wsClient.uuid;
					wsClient.send(JSON.stringify(message));
				}
			});
		} else if (message.type === "LOGIN") {
			ws.uuid = userCounter;
			message.user = ws.uuid;
			wsClients.push(ws);
			wsClients.forEach((wsClient) => {
				wsClient.send(JSON.stringify(message));
			});
			// } else if (message.type === "DRAW") {
			// 	wsClients.forEach((wsClient) => {
			// 		if (wsClient.uuid !== ws.uuid) {
			// 			wsClient.send(JSON.stringify(message));
			// 		}
			// 	});
		} else {
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
		wsClients = wsClients.filter((wsClient) => {
			if (wsClient.uuid !== ws.uuid) {
				wsClient.send(
					JSON.stringify({
						type: "LOGOUT",
						user: ws.user,
						uuid: ws.uuid,
					})
				);
			}
			return wsClient.uuid !== ws.uuid;
		});
	});
});

app.post("/join", (req, res) => {
	res.render("game", {
		active: true,
		name: req.body.name,
		title: "Realtime Web",
		pageTitle: "Game",
	});
});

// app.get('/404', (req, res) => {
//     res.render ( '404', {
//         pageTitle: '404',
//         title: '404'
// });
//     } );
app.get("/game", (req, res) => {
	res.render("game");
});

//
app.get("/", (req, res) => {
	res.render("index", {
		title: "Realtime Web",
		pageTitle: "Login",
	});
});

app.use(function (req, res, next) {
	res.status(404).render("404", {
		title: "404",
	});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
// } );
