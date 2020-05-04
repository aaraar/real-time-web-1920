import * as THREE from "three";
import materials from "./materials";
import lights from "./lights";
import geometry from "./geometry";
import { WEBGL } from "three/examples/jsm/WebGL.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

export default function Core(scene, player, gui) {
	const loadingScreen = {
		scene: new THREE.Scene(),
		camera: new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100),
		box: new THREE.Mesh(
			new THREE.BoxGeometry(0.5, 0.5, 0.5),
			new THREE.MeshBasicMaterial({ color: 0x4444ff })
		),
	};
	this.RESOURCES_LOADED = false;
	loadingScreen.box.position.set(0, 0, 5);
	loadingScreen.camera.lookAt(loadingScreen.box.position);
	loadingScreen.scene.add(loadingScreen.box);
	this.resourcesLoaded = () => {
		loadingScreen.box.position.x -= 0.05;
		if (loadingScreen.box.position.x < -10) loadingScreen.box.position.x = 10;
		loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);

		this.renderer.render(loadingScreen.scene, loadingScreen.camera);
		return this.RESOURCES_LOADED;
	};

	this.loadingManager = new THREE.LoadingManager();
	this.loadingManager.onProgress = (item, loaded, total) => {
		console.log(item, loaded, total);
	};

	this.objLoader = new OBJLoader(this.loadingManager);
	this.mtlLoader = new MTLLoader(this.loadingManager);
	this.fbxLoader = new FBXLoader(this.loadingManager);
	// this.textureLoader = new THREE.TextureLoader(loadingManager);
	this.models = {
		house: {
			type: "fbx",
			fbx: "/models/House1.fbx",
			mesh: null,
		},
		townBuilding: {
			type: "obj",
			obj: "/models/townbuilding/town_building.obj",
			mtl: "/models/townbuilding/town_building.mtl",
			mesh: null,
		},
	};
	for (var _key in this.models) {
		((key) => {
			if (this.models[key].type === "obj") {
				this.mtlLoader.load(this.models[key].mtl, (materials) => {
					materials.preload();

					this.objLoader.setMaterials(materials);
					this.objLoader.load(this.models[key].obj, (mesh) => {
						mesh.traverse((node) => {
							if (node instanceof THREE.Mesh) {
								node.castShadow = true;
								node.receiveShadow = true;
							}
						});
						this.models[key].mesh = mesh;
					});
				});
			} else if (this.models[key].type === "fbx") {
				this.fbxLoader.load(this.models[key].fbx, (mesh) => {
					mesh.traverse((node) => {
						if (node instanceof THREE.Mesh) {
							node.castShadow = true;
							node.receiveShadow = true;
						}
					});
					this.models[key].mesh = mesh;
				});
			}
		})(_key);
	}
	this.webglVersion = WEBGL.isWebGL2Available() ? "webgl2" : "webgl";
	this.canvas = document.createElement("canvas");
	this.context = this.canvas.getContext(this.webglVersion, { alpha: false });
	this.floor = geometry.getPlane(
		materials.getMaterial("standard", "rgb(255, 255, 255)"),
		300
	);
	// this.sun = lights.getDirectionalLight(1.5);
	this.lightLeft = lights.getSpotLight(1, "rgb(255, 220, 180)");
	this.lightRight = lights.getSpotLight(1, "rgb(255, 220, 180)");

	// this.sun.position.set(30, 50, 50);
	// this.sun.lookAt(0, 0, 0);
	this.lightLeft.position.x = -40;
	this.lightLeft.position.y = 2;
	this.lightLeft.position.z = 20;
	this.lightLeft.lookAt(0, 0, 0,);

	this.lightRight.position.x = 40;
	this.lightRight.position.y = 20;
	this.lightRight.position.z = -20;
	this.lightRight.lookAt(0, 0, 0);

	const leftGui = gui.addFolder("Light Left");
	const rightGui = gui.addFolder("Light right");
	leftGui.add(this.lightLeft.position, 'x', -40, 40);
	leftGui.add(this.lightLeft.position, 'y', -20, 20);
	leftGui.add(this.lightLeft.position, 'z', -20, 20);
	rightGui.add(this.lightRight.position, 'x', -40, 40);
	rightGui.add(this.lightRight.position, 'y', -20, 20);
	rightGui.add(this.lightRight.position, 'z', -20, 20);

	this.fogEnabled = false;
	if (this.fogEnabled) {
		scene.fog = new THREE.FogExp2(0x99ffff, 0.05);
	}

	this.renderer = new THREE.WebGLRenderer({
		canvas: this.canvas,
		context: this.context,
		antialias: true,
	});
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	this.renderer.setClearColor(0x99ffff);
	this.renderer.shadowMap.enabled = true;
	document.getElementById("webgl").appendChild(this.renderer.domElement);

	this.camera = new THREE.PerspectiveCamera(
		90, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);
	this.camera.position.set(0, player.height, -5);
	this.camera.lookAt(new THREE.Vector3(0, player.height, 0));
	window.addEventListener('resize', () => {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	})

	// manipulate objects
	this.floor.rotation.x = Math.PI / 2;
	this.camera.add(player.mesh);
	scene.add(this.lightLeft, this.lightRight, this.floor);
}
