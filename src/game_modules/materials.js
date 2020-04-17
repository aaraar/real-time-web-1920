import * as THREE from "three";

function getMaterial(type, color) {
	let selectedMaterial;
	const materialOptions = {
		color: color === undefined ? "rgb(255, 255, 255)" : color,
	};

	switch (type) {
		case "basic":
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case "lambert":
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case "phong":
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
		case "standard":
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		default:
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}

	return selectedMaterial;
}

export default {
	getMaterial: getMaterial,
};
