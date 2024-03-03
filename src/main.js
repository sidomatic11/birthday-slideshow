import * as THREE from "three";
import Stats from "stats.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
const baseUrl = new URL(import.meta.env.BASE_URL, import.meta.url);

/* SECTION: Performance Monitoring */
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom);

/* SECTION: Scene Setup */

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
scene.fog = new THREE.Fog(0xffffff, 100, 300);

const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	1,
	1000
);
camera.position.y = 25;
camera.position.z = 90;

/* Lighting */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const color = 0xffffff;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0, 100, 100);
scene.add(light);

/* Renderer */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //makes edges smoother, max 2 to avoid performance issues

/* Handle Responsiveness and Full Screen */
window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //repeated here to account for monitor change
});

window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		console.log("go full");
		canvas.requestFullscreen();
	} else {
		console.log("leave full");
		document.exitFullscreen();
	}
});

// /* Audio */

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);
const sound2 = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
const audioURL = `${baseUrl.href}audio/hbd.mp3`;
const audio2URL = `${baseUrl.href}audio/chill.mp3`;
let isSound2Loaded = false;
audioLoader.load(audioURL, function (buffer) {
	sound.setBuffer(buffer);
	// sound.setLoop(true);
	sound.setVolume(1);
	sound.onEnded = () => {
		console.log("sound 1 has ended");
		if (isSound2Loaded) {
			sound2.play();
		}
	};
});
audioLoader.load(audio2URL, function (buffer) {
	sound2.setBuffer(buffer);
	sound2.setLoop(true);
	sound2.setVolume(1);
	console.log("audio 2 loaded");
	isSound2Loaded = true;
});

/* SECTION: Scene Objects */

/* Fonts */

const fontLoader = new FontLoader();
const typefaceURL = `${baseUrl.href}fonts/helvetiker_regular.typeface.json`;
fontLoader.load(typefaceURL, (font) => {
	console.log("font loaded");
	const textGeometry = new TextGeometry("Haaappy Birthdaaaaay, Pikachu!", {
		font: font,
		size: 5,
		height: 0.2,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 5,
	});
	const textMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 });
	const text = new THREE.Mesh(textGeometry, textMaterial);
	text.position.y = 25;
	scene.add(text);

	const size = 500;
	const divisions = 50;

	const gridColor = 0xdcaeb7;
	const gridHelper = new THREE.GridHelper(
		size,
		divisions,
		gridColor,
		gridColor
	);
	// gridHelper.position.y = -25;
	scene.add(gridHelper);
});

/* Shoji */

const loader = new THREE.TextureLoader();

const planeGeometry = new THREE.PlaneGeometry(97, 50); //97.5 is precise, adjusted to avoid glitching
const planeMaterial = new THREE.MeshPhongMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide,
	transparent: true,
	opacity: 0.8,
});

const barGeometry = new THREE.BoxGeometry(1, 1, 1);
const barMaterial = new THREE.MeshPhongMaterial({
	color: 0x2e2e2e,
});

function addShoji() {
	const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
	planeMesh.position.y = 25;
	scene.add(planeMesh);

	const bar1 = new THREE.Mesh(barGeometry, barMaterial);
	bar1.scale.set(2.5, 50, 2.5);
	bar1.position.x = -47.5;

	const bar2 = new THREE.Mesh(barGeometry, barMaterial);
	bar2.scale.set(2.5, 50, 2.5);
	bar2.position.x = -33.5;

	const bar3 = new THREE.Mesh(barGeometry, barMaterial);
	bar3.scale.set(2.5, 50, 2.5);
	bar3.position.x = 33.5;

	const bar4 = new THREE.Mesh(barGeometry, barMaterial);
	bar4.scale.set(2.5, 50, 2.5);
	bar4.position.x = 47.5;

	const bar5 = new THREE.Mesh(barGeometry, barMaterial);
	bar5.scale.set(100, 2.5, 5);
	bar5.position.y = 23.75;

	const bar6 = new THREE.Mesh(barGeometry, barMaterial);
	bar6.scale.set(100, 2.5, 5);
	bar6.position.y = -23.75;

	planeMesh.add(bar1);
	planeMesh.add(bar2);
	planeMesh.add(bar3);
	planeMesh.add(bar4);
	planeMesh.add(bar5);
	planeMesh.add(bar6);

	/* Grid Helper */
	const size = 500;
	const divisions = 50;

	const gridColor = 0xdcaeb7;
	const gridHelper = new THREE.GridHelper(
		size,
		divisions,
		gridColor,
		gridColor
	);
	gridHelper.position.y = -25;
	planeMesh.add(gridHelper);

	return planeMesh;
}

function addShapes(shojiMesh) {
	const coneGeometry = new THREE.ConeGeometry(1, 1, 3);
	const coneMaterial = new THREE.MeshPhongMaterial({ color: 0xffb7c5 });
	for (let i = 0; i < 40; i++) {
		let x = Math.random() * 150 - 75;
		let y = Math.random() * 100 - 20;
		let z = Math.random() * 100 - 110;
		let scaleFactor = 1 + Math.random();
		const cone = new THREE.Mesh(coneGeometry, coneMaterial);
		cone.position.x = x;
		cone.position.y = y;
		cone.position.z = z;
		cone.scale.set(scaleFactor, scaleFactor, scaleFactor);
		cone.rotation.x = Math.random() * Math.PI;
		cone.rotation.y = Math.random() * Math.PI;
		cone.rotation.z = Math.random() * Math.PI;
		shojiMesh.add(cone);
	}
}

/* Array of numbers is shuffled so as to get unique random sequence */
const randomImageNumbers = Array(12)
	.fill()
	.map((_, index) => index + 1);
randomImageNumbers.sort(() => Math.random() - 0.5);
let imageIndex = 0;
let cubeIndex = 0;
let cubeObjects = [];

let currentCubePositionX = 0;

async function addCube() {
	let shojiMesh = addShoji();
	shojiMesh.position.x = currentCubePositionX + 300;
	currentCubePositionX = shojiMesh.position.x - 150;

	// addLines(shojiMesh);
	addShapes(shojiMesh);
	let texture = await loader.loadAsync(
		`${baseUrl.href}images/img-${randomImageNumbers[imageIndex++]}.jpg`
	); //backticks used to insert variable in string

	if (imageIndex == randomImageNumbers.length) {
		//repeat sequence after completion
		imageIndex = 0;
	}
	texture.colorSpace = THREE.SRGBColorSpace;

	// const cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
	// let cubeMaterial = new THREE.MeshBasicMaterial({ map: texture });
	// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	let imageAspectRatio = texture.image.width / texture.image.height;
	let planeGeometry;
	const frame = new THREE.Mesh(barGeometry, barMaterial);
	let imageMaxDimension = 37;
	let imageWidth = 0;
	let imageHeight = 0;
	if (imageAspectRatio > 1) {
		imageWidth = imageMaxDimension;
		imageHeight = imageMaxDimension / imageAspectRatio;
	} else {
		imageWidth = imageMaxDimension * imageAspectRatio;
		imageHeight = imageMaxDimension;
	}
	planeGeometry = new THREE.PlaneGeometry(imageWidth, imageHeight);
	frame.scale.set(imageWidth + 2, imageHeight + 2, 1);

	const planeMaterial = new THREE.MeshBasicMaterial({ map: texture });
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);

	frame.position.z = 0.5;

	// plane.position.y = 50;
	// plane.position.x = currentCubePositionX + 400;
	plane.position.z = 1;

	shojiMesh.add(frame);
	shojiMesh.add(plane);
	// scene.add(plane);
	cubeObjects.push(shojiMesh);
	console.log(cubeObjects);

	/* show scenegraph */
	// scene.traverse(function (obj) {
	// 	var s = "|___";
	// 	var obj2 = obj;
	// 	while (obj2 !== scene) {
	// 		s = "\t" + s;
	// 		obj2 = obj2.parent;
	// 	}
	// 	console.log(s + obj.name + " <" + obj.type + ">");
	// });

	if (cubeObjects[cubeIndex - 4]) {
		// console.log("disposed");
		scene.remove(cubeObjects[cubeIndex - 4]);
		cubeObjects[cubeIndex - 4].geometry.dispose();
		cubeObjects[cubeIndex - 4].material.dispose();
		cubeObjects[cubeIndex - 4] = null;
	}
	cubeIndex++;
}

/* SECTION: Animate */

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

function animate() {
	stats.begin();

	camera.position.x += 0.2;
	if (camera.position.x >= currentCubePositionX) {
		addCube();
	}
	// controls.update();
	renderer.render(scene, camera);

	requestAnimationFrame(animate);

	stats.end();
}

document.getElementById("start-button").addEventListener("click", () => {
	document.getElementById("loader-screen").remove();
	animate();
	sound.play();
});

/* SECTION: Spotify Embed */

// window.onSpotifyIframeApiReady = (IFrameAPI) => {
// 	const element = document.getElementById("embed-iframe");
// 	const options = {
// 		width: 400,
// 		height: 80,
// 		uri: "spotify:playlist:2eYGQYSGxAO9GboA7sr6zB",
// 	};
// 	const callback = (EmbedController) => {
// 		EmbedController.play();
// 		console.log("MUSIC should be playing");
// 	};
// 	IFrameAPI.createController(element, options, callback);
// };
