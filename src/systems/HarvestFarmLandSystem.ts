import * as THREE from 'three'
import SceneBase from '../scenes/SceneBase'
import PhysicsUtils from '../utils/Physics';
import FarmLand from '../objects/FarmLand';

export default class HarvestFarmLandSystem {
    private scene: SceneBase;
    public isHarvesting: boolean = false;

    constructor (scene: SceneBase) {
        this.scene = scene;
    }

    public toggleHarvesting () {
        this.isHarvesting = !this.isHarvesting;

        this.scene.orbitControls.enableRotate = !this.isHarvesting;
    }

    public harvestAction (event: MouseEvent) {
        if (this.isHarvesting && this.scene.leftMouseButton) {
            const objects = PhysicsUtils.raycastFromMouse(new THREE.Vector2(event.clientX, event.clientY), this.scene.mainCamera, this.scene.children.filter(node => node instanceof FarmLand));
            objects.forEach(element => {
                element.object.traverseAncestors(node => {
                    if (node instanceof FarmLand) {
                        (node as FarmLand).harvest(this.scene.mainCamera);
                    }
                })
            })
        }
    }

}