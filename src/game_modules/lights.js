import * as THREE from "three";

function getPointLight(intensity) {
	const light = new THREE.PointLight(0xffffff, intensity);
	light.castShadow = true;
	return light;
}

function getSpotLight(intensity, color) {
	color = color === undefined ? "rgb(255, 255, 255)" : color;
	const light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.penumbra = 0.5;
	light.shadow.mapSize.width = 1024 * 8;
	light.shadow.mapSize.height = 1024 * 8;
	light.shadow.bias = 0.001;
	return light;
}

function getDirectionalLight(intensity) {
	const light = new THREE.DirectionalLight(0xffffff, intensity);
	light.castShadow = true;
	light.shadow.mapSize.width = 1024 * 4;
	light.shadow.mapSize.height = 1024 * 4;
	light.shadow.camera.left = -100;
	light.shadow.camera.right = 100;
	light.shadow.camera.bottom = -100;
	light.shadow.camera.top = 100;
	light.shadow.bias = 0.001;
	return light;
}

function getRectLight(intensity, width, height) {
	return new THREE.RectAreaLight(0xffffff, intensity, width, height);
}

function getAmbientLight(intensity) {
	return new THREE.AmbientLight(0x99ffff, intensity);
}

export default {
	getPointLight: getPointLight,
	getSpotLight: getSpotLight,
	getDirectionalLight: getDirectionalLight,
	getRectLight: getRectLight,
	getAmbientLight: getAmbientLight,
};
