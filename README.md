<!-- ### [Live Demo](https://anon-says-herokuapp.com) -->

# Multiplayer HTML5 webgl2

## Table of contents

- [Description](#description-)
- [To do](#to-do-)
- [Installing](#installing-)
- [Data Lifecycle Diagram](#data-lifecycle)
- [Packages & Services](#packages--services)
- [How it works](#how-it-works-)
- [Technologies Used](#technologies-used-)
  - [Websockets](#websockets)
  - [Express-ws](#express-ws)
- [Goals](#goals)
- [License](#license-)


## Description 📝
To experiment with real-time networking I wanted to create a multiplayer 3D game in the browser from scratch.
I do use the threeJS library to abstract the low-level webGL API.
Users can create a room and receive a room code which they can share with others to let them join.
Rooms can be rejoined or custom room codes can be created by using the URL at join/CODE

## To Do 📌

- [x] A basic webGL game where you can walk around
- [X] A websocket connection to the server to show other connected players
- [ ] Users can host their own games
- [X] Server hosted 'rooms
- [ ] Player models from external API
- [ ] A functional game-mode

In the end, the networking aspect of a WebGL game without the use of socket.io was too complicated to add more content to.
The flow including clients - Server - MongoDB database - Redis database cost a lot of time to work out.

## Installing 🔍
To install this application follow these steps:

- `git clone https://github.com/aaraar/real-time-web-1920`
- `cd real-time-web-1920`
- `yarn` / `npm install`
- `yarn start`
  - Run `yarn watch` & `yarn dev` concurrently for development
  
## Data lifecycle
![Data lifecycle](./docs/dlc2.png)
- The data in the database is stored without the position unless a player leaves.
- The current connected players is tracked on the server.
- The redis server saves session ID's so players can be recognized and will rejoin a room if it still exists

The data available to the server is as follows
```JSON
{
  "qP1BCB_bO": [
    {
      "playerId": 1,
      "name": "aaraar",
      "position": "(0, 0, 0)"
    },
    {
      "playerId": 2,
      "name": "razpudding",
      "position": "(4, 0, 6)"
    }
  ],
  "YZ4CNkD7b": [
    {
      "playerId": 3,
      "name": "bazottie",
      "position": "(0, 0, 0)"
    },
    {
      "playerId": 4,
      "name": "kooprey",
      "position": "(9, 0, 4)"
    }
  ]
}
```
- When a player moves the position data is updated.
- When a player leaves the array is filtered.


### Packages & Services

This project makes use of the following tech:

- [Node](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [express-ws](https://github.com/HenningM/express-ws)
- [Three.js](https://threejs.org/)

## How It Works 🛠️

1. Player creates a room
1. Player shares the room code with others
1. Others join a room by entering a code
    - The server adds all client ID's to the database
    - All active players are saved on the Node the server
    - Sessions/Cookie identification is saved on the redis server
1. Position data is shared exclusively with socket clients connected to a room
1. Chat data is shared exclusively with socket clients connected to a room
1. When a player leaves, his client will be removed from the active players array and his position is saved to the database
1. When a player rejoins he will continue on his previous credentials

## Technologies Used 🖲

### Websockets

- When creating a multiplayer browsergame, websockets is the first thing you should think of.
  This technology is perfect for these kind of applications where data should be send and displayed almost instantly to all users.
  The websockets in this app makes sure the server has a live connection with all connected users and makes it able for the users to talk to eachother in real-time.

### express-ws

- For this project I wanted to make use of websockets without the socket.io package since it does a lot of (great) things in the background,
  that I want to learn or do for myself for once. The `express-ws` is still an abstraction layer over the native node `ws` package,
  this abstraction however is very small. It handles the link between the websocket and the http server, sends a status code on connection and
  implements a router that accepts human-readable strings instead of regular expressions. These are not the functionalities I want to focus on
  learning. - `express-ws`

## Goals

- _Websockets in JS without socket.io_
- _Sending and handling abstract data (canvas content)_
- _Deal with real-time complexity_
- _Handle real-time client-server interaction_
- _Handle real-time data management_
- _Handle multi-user support_

## License 🔓

MIT © [Bas de Greeuw](https://github.com/aaraar)


<!-- Add a link to your live demo in Github Pages 🌐-->

<!-- ☝️ replace this description with a description of your own work -->

<!-- replace the code in the /docs folder with your own, so you can showcase your work with GitHub Pages 🌍 -->

<!-- Add a nice image here at the end of the week, showing off your shiny frontend 📸 -->

<!-- Maybe a table of contents here? 📚 -->

<!-- How about a section that describes how to install this project? 🤓 -->

<!-- ...but how does one use this project? What are its features 🤔 -->

<!-- What external data source is featured in your project and what are its properties 🌠 -->

<!-- This would be a good place for your data life cycle ♻️-->

<!-- Maybe a checklist of done stuff and stuff still on your wishlist? ✅ -->

<!-- How about a license here? 📜  -->

[rubric]: https://docs.google.com/spreadsheets/d/e/2PACX-1vSd1I4ma8R5mtVMyrbp6PA2qEInWiOialK9Fr2orD3afUBqOyvTg_JaQZ6-P4YGURI-eA7PoHT8TRge/pubhtml
