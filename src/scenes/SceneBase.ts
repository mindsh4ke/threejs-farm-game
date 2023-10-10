import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import PhysicsUtils from '../utils/Physics';
import GameObject from '../objects/GameObject';
import Layers from '../core/Layers';

export default class SceneBase extends THREE.Scene {
    protected readonly mtlLoader = new MTLLoader();
    protected readonly objLoader = new OBJLoader();
    protected readonly fbxLoader = new FBXLoader();
    protected readonly textureLoader = new THREE.TextureLoader();
    protected mainCamera: THREE.Camera;

    constructor(camera: THREE.Camera) {
        super();
        this.mainCamera = camera;
    }

    public onMouseMove (event: MouseEvent) {
        
    }

    public onMouseDown (event: MouseEvent) {
        const objects = PhysicsUtils.raycastFromMouse(new THREE.Vector2(event.clientX, event.clientY), this.mainCamera, this.children);
        objects.forEach(element => {
            element.object.traverseAncestors(node => {
                if (node instanceof GameObject) {
                    (node as GameObject).onClick()
                }
            })
        })
    }

    public onMouseUp (event: MouseEvent) {

    }

    protected async initialize () {
        document.addEventListener("mousemove", (event) => this.onMouseMove(event), false);
        document.addEventListener("mousedown", (event) => this.onMouseDown(event), false);
        document.addEventListener("mouseup", (event) => this.onMouseUp(event), false);
    }

    

    public tick () {
        
    }
    
}