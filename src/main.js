import * as THREE from "three";
import * as dat from "dat.gui";
import geometry from "./game_modules/geometry";
import Core from "./game_modules/core";
import Events from "./game_modules/events";
import Connection from "./Connection";

window.onload = connect();
function connect() {
	const connection = new Connection();
	connection.socket.onopen = () => {
		const mesh = geometry.getBoxMesh(1, 1.8, 1);
		mesh.position.y += mesh.geometry.parameters.height / 2 + 0.5;
		connection.send({type: "LOGIN", player: {user: name, position: mesh.position}});
		connection.ping(connection.socket);
		connection.socket.onmessage = (e) => {
			const message = JSON.parse(e.data);
			if (message.type === "LOGIN") {
				console.log(message);
				if (message.own) {
					connection.players = message.players;
					init(connection)
				}
			}
		}
	}
}

function init(connection) {
	const gui = new dat.GUI();
	const scene = new THREE.Scene();
	connection.players.forEach(player => {
		if (!player.me) {
			const playerMesh = geometry.getBoxMesh(1, 1.8, 1);
			playerMesh.name = `player${player.user}`;
			playerMesh.position.set(player.position.x, player.position.y, player.position.z);
			scene.add(playerMesh);
		}
	})
	const player = {
		height: 1.8,
		speed: 0.2,
		turnSpeed: Math.PI * 0.02,
		mesh: geometry.getBoxMesh(1, 1.8, 1),
	};
	player.mesh.position.y += player.mesh.geometry.parameters.height / 2 + 0.5;

	const core = new Core(scene, player);
	const events = new Events(player);
	const meshes = {};

	core.loadingManager.onLoad = () => {
		console.log("loaded all resources");
		core.RESOURCES_LOADED = true;
		onResourcesLoaded();
	};

	const box = geometry.getBoxMesh(1, 1, 1);
	box.position.y += box.geometry.parameters.height / 2 + 0.5;
	box.name = "box";

	function onResourcesLoaded() {
		const meshes = {
			house1: core.models.house.mesh.clone(),
			townBuilding1: core.models.townBuilding.mesh.clone(),
		};
		meshes.house1.scale.set(0.1, 0.1, 0.1);
		meshes.house1.position.x += 25;

		scene.add(meshes.house1);
	}
	scene.add(box);

	connection.socket.onmessage = (e) => {
		const message = JSON.parse(e.data);
		if (message.type === "MOVEMENT") {
			const movedPlayer = scene.getObjectByName(`player${message.user}`);
			movedPlayer.position.set(message.player.position.x, message.player.position.y, message.player.position.z);
			// movedPlayer.rotation.set(message.player.rotation.x, message.player.rotation.y, message.player.rotation.z);
			// movedPlayer.object.position = message.mesh.object.position;
		} else if (message.type === "LOGIN") {
			console.log(message);
			if (!message.own) {
				const playerMesh = geometry.getBoxMesh(1,1.8,1);
				playerMesh.position.y += playerMesh.geometry.parameters.height / 2 + 0.5;
				playerMesh.name = `player${message.user}`;
				connection.players.push({uuid: message.user, mesh: playerMesh});
				scene.add(playerMesh);
			}
		} else if (message.type === "LOGOUT") {
			connection.players.filter((player) => message.user !== player.user);
			const loggedOutUser = scene.getObjectByName(`player${message.user}`);
			scene.remove(loggedOutUser);
		} else if (message.type === "PINGPONG") {
			connection.ping(connection.socket);
		}
	};

	update(core, scene, events, player, connection);

	return scene;
}

function update(core, scene, events, player, connection) {
	connection.echoPosition(core.camera);
	requestAnimationFrame(() => {
		update(core, scene, events, player, connection);
	});
	if (!core.resourcesLoaded()) {
		return;
	}
	const box = scene.getObjectByName("box");
	box.rotation.y += Math.PI * 0.005;
	box.rotation.x += Math.PI * 0.005;
	events.updatePlayer(core.camera);

	core.renderer.render(scene, core.camera);
}
