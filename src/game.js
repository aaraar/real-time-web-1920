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
		connection.send({ type: "LOGIN", user: name });
		connection.ping(connection.socket);
		init(connection);
	};
}

function init(connection) {
	connection.socket.onmessage = (e) => {
		const message = JSON.parse(e.data);
		if (message.type === "MOVEMENT") {
			console.log(message);
		} else if (message.type === "LOGIN") {
			console.log(message);
		} else if (message.type === "LOGOUT") {
			console.log(message);
		} else if (message.type === "PINGPONG") {
			connection.ping(connection.socket);
		}
	};
	const gui = new dat.GUI();
	const scene = new THREE.Scene();
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

	const path = "/cube/Park3Med/";
	const format = ".jpg";
	const urls = [
		path + "px" + format,
		path + "nx" + format,
		path + "py" + format,
		path + "ny" + format,
		path + "pz" + format,
		path + "nz" + format,
	];
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

	update(core, scene, events, player, connection);

	return scene;
}

function update(core, scene, events, player, connection) {
	connection.echoPosition(player);
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
