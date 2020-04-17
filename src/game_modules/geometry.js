import * as THREE from "three";

/**
 *
 * @param {width} w
 * @param {height} h
 * @param {depth} d
 */
function getBoxMesh(w, h, d) {
	const material = new THREE.MeshPhongMaterial({
		color: 0xeeff33,
	});
	const geometry = new THREE.BoxGeometry(w, h, d);
	const boxMesh = new THREE.Mesh(geometry, material);
	boxMesh.castShadow = true;
	return boxMesh;
}

function getSphereMesh(material, radius, segments) {
	const geometry = new THREE.SphereGeometry(radius, segments, segments);
	const mesh = new THREE.Mesh(geometry, material);
	mesh.castShadow = true;
	return mesh;
}

function getPlane(material, size) {
	material.side = THREE.DoubleSide;
	const geometry = new THREE.PlaneGeometry(size, size);
	const plane = new THREE.Mesh(geometry, material);
	plane.receiveShadow = true;
	return plane;
}

function getBoxGrid(amount, separationMultiplier) {
	const group = new THREE.Group();

	for (let xValue = 0; xValue < amount; xValue++) {
		const obj = getBoxMesh(1, 1, 1);
		obj.position.x = xValue * separationMultiplier;
		obj.position.y = obj.geometry.parameters.height / 2;
		group.add(obj);
		for (let zValue = 1; zValue < amount; zValue++) {
			const obj = getBoxMesh(1, 1, 1);
			obj.position.x = xValue * separationMultiplier;
			obj.position.y = obj.geometry.parameters.height / 2;
			obj.position.z = zValue * separationMultiplier;
			group.add(obj);
		}
	}

	group.position.x = -(separationMultiplier * (amount - 1)) / 2;
	group.position.z = -(separationMultiplier * (amount - 1)) / 2;

	return group;
}

function getGeometry(type, size, material) {
	var geometry;
	var segmentMultiplier = 1;

	switch (type) {
		case "box":
			geometry = new THREE.BoxGeometry(size, size, size);
			break;
		case "cone":
			geometry = new THREE.ConeGeometry(size, size, 256 * segmentMultiplier);
			break;
		case "cylinder":
			geometry = new THREE.CylinderGeometry(
				size,
				size,
				size,
				32 * segmentMultiplier
			);
			break;
		case "octahedron":
			geometry = new THREE.OctahedronGeometry(size);
			break;
		case "sphere":
			geometry = new THREE.SphereGeometry(
				size,
				32 * segmentMultiplier,
				32 * segmentMultiplier
			);
			break;
		case "tetrahedron":
			geometry = new THREE.TetrahedronGeometry(size);
			break;
		case "torus":
			geometry = new THREE.TorusGeometry(
				size / 2,
				size / 4,
				16 * segmentMultiplier,
				100 * segmentMultiplier
			);
			break;
		case "torusKnot":
			geometry = new THREE.TorusKnotGeometry(
				size / 2,
				size / 6,
				256 * segmentMultiplier,
				100 * segmentMultiplier
			);
			break;
		default:
			break;
	}

	var obj = new THREE.Mesh(geometry, material);
	obj.castShadow = true;
	obj.name = type;

	return obj;
}

export default {
	getBoxMesh: getBoxMesh,
	getBoxGrid: getBoxGrid,
	getPlane: getPlane,
	getSphereMesh: getSphereMesh,
	getGeometry: getGeometry,
};
