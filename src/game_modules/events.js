export default function Events(player) {
	this.keyboard = {};

	this.keyUp = (e) => {
		this.keyboard[e.keyCode] = false;
	};

	this.keyDown = (e) => {
		this.keyboard[e.keyCode] = true;
	};
	window.addEventListener("keyup", this.keyUp);
	window.addEventListener("keydown", this.keyDown);
	this.updatePlayer = (camera) => {
		if (this.keyboard[87]) {
			// W
			camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
			camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
		}
		if (this.keyboard[83]) {
			// S
			camera.position.x += Math.sin(camera.rotation.y) * player.speed;
			camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
		}
		if (this.keyboard[65]) {
			// A
			// Redirect motion by 90 degrees
			camera.position.x +=
				Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
			camera.position.z +=
				-Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
		}
		if (this.keyboard[68]) {
			// D
			camera.position.x +=
				Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
			camera.position.z +=
				-Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
		}
		// if (events.keyboard[38]) {
		// 	camera.rotation.x -= Math.PI * 0.01;
		// }
		if (this.keyboard[37]) {
			// Left
			camera.rotation.y -= player.turnSpeed;
		}
		if (this.keyboard[39]) {
			// Right
			camera.rotation.y += player.turnSpeed;
		}
		// if (events.keyboard[40]) {
		// 	camera.rotation.x += Math.PI * 0.01;
		// }
	};
}
