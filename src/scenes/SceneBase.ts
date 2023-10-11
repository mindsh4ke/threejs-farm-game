import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import PhysicsUtils from '../utils/Physics';
import GameObject from '../objects/GameObject';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Layers from '../core/Layers';

export default class SceneBase extends THREE.Scene {
    protected readonly mtlLoader = new MTLLoader();
    protected readonly objLoader = new OBJLoader();
    protected readonly fbxLoader = new FBXLoader();
    protected readonly textureLoader = new THREE.TextureLoader();
    public mainCamera: THREE.Camera;
    public renderer: THREE.Renderer;
    public orbitControls: OrbitControls;

    public leftMouseButton: boolean = false;
    public rightMouseButton: boolean = false;
    public middleMouseButton: boolean = false;

    constructor(camera: THREE.Camera, renderer: THREE.Renderer) {
        super();
        this.mainCamera = camera;
        this.renderer = renderer;
        this.orbitControls = new OrbitControls(this.mainCamera, this.renderer.domElement);
        this.orbitControls.screenSpacePanning = true;
        this.orbitControls.minZoom = 2;
        this.orbitControls.maxZoom = 2;
        this.orbitControls.target.set(0, 0.5, 0);
        this.orbitControls.update();

        document.body.onmousedown = (event) => {
            this.leftMouseButton = event.button === 0;
            this.rightMouseButton = event.button === 2;
            this.middleMouseButton = event.button === 1;
        }
        document.body.onmouseup = (event) => {
            if (event.button === 0)
                this.leftMouseButton = false;
            if (event.button === 2)
                this.rightMouseButton = false;
            if (event.button === 1)
                this.middleMouseButton = false;
        }
    }

    public onMouseMove(event: MouseEvent) {

    }

    public onMouseDown(event: MouseEvent) {
        const objects = PhysicsUtils.raycastFromMouse(new THREE.Vector2(event.clientX, event.clientY), this.mainCamera, this.children);
        objects.forEach(element => {
            element.object.traverseAncestors(node => {
                if (node instanceof GameObject) {
                    (node as GameObject).onClick(event)
                }
            })
        })
    }

    public onMouseUp(event: MouseEvent) {

    }

    protected async initialize() {
        document.addEventListener("mousemove", (event) => this.onMouseMove(event), false);
        document.addEventListener("mousedown", (event) => this.onMouseDown(event), false);
        document.addEventListener("mouseup", (event) => this.onMouseUp(event), false);
    }



    public tick() {

    }

}