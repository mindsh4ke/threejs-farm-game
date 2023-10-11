import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import SceneBase from '../scenes/SceneBase';
import PhysicsUtils from '../utils/Physics';
import FarmLand from '../objects/FarmLand';

export default class PlowFarmLandSystem {

    private scene: SceneBase;
    public isPlowing: boolean = false;

    constructor(scene: SceneBase) {
        this.scene = scene;
    }

    public startPlowMode () {
        this.isPlowing = true;
        this.scene.orbitControls.enableRotate = false;
    }

    public actionPlow (event: MouseEvent, plane: THREE.Mesh) {
        if (this.isPlowing && this.scene.leftMouseButton) {
            const objects = PhysicsUtils.raycastFromMouse(new THREE.Vector2(event.clientX, event.clientY), this.scene.mainCamera, this.scene.children.filter(node => node instanceof FarmLand));
            objects.forEach(element => {
                element.object.traverseAncestors(node => {
                    if (node instanceof FarmLand) {
                        (node as FarmLand).plow();
                    }
                })
            })
        }
    }

    public endPlowMode () {
        this.isPlowing = false;
        this.scene.orbitControls.enableRotate = true;
    }
}