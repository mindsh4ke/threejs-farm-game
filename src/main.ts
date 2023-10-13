import * as THREE from 'three';
import GameScene from './scenes/GameScene';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader.js';

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
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure =1.4;

const composer = new EffectComposer(renderer);


const mainCamera = new THREE.PerspectiveCamera(45, width / height, 0.01, 100);
mainCamera.position.z = 5;

const scene = new GameScene(mainCamera, renderer);
await scene.initialize();

const renderPass = new RenderPass(scene, mainCamera);
composer.addPass(renderPass);

const ssaoPass = new SSAOPass(scene, mainCamera, width, height);
ssaoPass.kernelRadius = 1;
ssaoPass.minDistance = 0.005;
ssaoPass.maxDistance = 0.1;
composer.addPass(ssaoPass);

/*
const fxaaPass = new ShaderPass(FXAAShader);

composer.addPass(renderPass);

const pixelRatio = renderer.getPixelRatio();

fxaaPass.material.uniforms['resolution'].value.x = 1 / (document.getElementById('app')!.offsetWidth * pixelRatio);
fxaaPass.material.uniforms['resolution'].value.y = 1 / (document.getElementById('app')!.offsetHeight * pixelRatio);

composer.addPass(renderPass);
composer.addPass(fxaaPass);
*/

const outputPass = new OutputPass();
composer.addPass(outputPass);

function tick() {
  requestAnimationFrame(tick);
  renderer.render(scene, mainCamera);
  composer.render();
  scene.tick();
}

tick();



