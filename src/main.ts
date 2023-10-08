import * as THREE from 'three';
import GameScene from './scenes/GameScene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('app') as HTMLCanvasElement,
  antialias: true
});

renderer.shadowMap.enabled = true;
renderer.setSize(width, height);

const mainCamera = new THREE.PerspectiveCamera(45, width / height, 0.01, 100);
mainCamera.position.z = 5;
var controls = new OrbitControls( mainCamera, renderer.domElement );

controls.screenSpacePanning = true;
controls.minZoom = 2;
controls.maxZoom = 2;
controls.minPolarAngle = 0.5; // radians
controls.maxPolarAngle = 1; // radians


const scene = new GameScene();
await scene.initialize();


function tick () {
  requestAnimationFrame(tick);
  renderer.render(scene, mainCamera);
  
}

tick();



