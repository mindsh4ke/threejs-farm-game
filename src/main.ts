import * as THREE from 'three';
import GameScene from './scenes/GameScene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

THREE.ColorManagement.enabled = true;



const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('app') as HTMLCanvasElement,
  antialias: true
});
renderer.shadowMap.enabled = true;
renderer.setSize(width, height);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping

const composer = new EffectComposer(renderer);


const mainCamera = new THREE.PerspectiveCamera(45, width / height, 0.01, 100);
mainCamera.position.z = 5;


var controls = new OrbitControls(mainCamera, renderer.domElement);
controls.screenSpacePanning = true;
controls.minZoom = 2;
controls.maxZoom = 2;
//controls.minPolarAngle = 0.5;
//controls.maxPolarAngle = 1;
controls.target.set(0, 0.5, 0);
controls.update();


const scene = new GameScene(mainCamera);
await scene.initialize();

const renderPass = new RenderPass(scene, mainCamera);
composer.addPass(renderPass);

const ssaoPass = new SSAOPass(scene, mainCamera, width, height);
ssaoPass.kernelRadius = 1;
ssaoPass.minDistance = 0.005;
ssaoPass.maxDistance = 0.1;
composer.addPass(ssaoPass);

const outputPass = new OutputPass();
composer.addPass(outputPass);

function tick() {
  requestAnimationFrame(tick);
  renderer.render(scene, mainCamera);
  composer.render();
  scene.tick();
}

tick();



