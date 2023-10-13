import * as THREE from 'three';
import { CropInfo } from "../data/CropInfo";
import SceneBase from "../scenes/SceneBase";
import PhysicsUtils from '../utils/Physics';
import FarmLand from '../objects/FarmLand';

export default class PlantFarmLandSystem {
    private scene: SceneBase;
    private selectedCrop?: CropInfo;

    constructor(scene: SceneBase) {
        this.scene = scene;
    }

    public togglePlanting (crop: CropInfo) {
        this.selectedCrop = this.selectedCrop ? undefined : crop;

        this.scene.orbitControls.enableRotate = !this.selectedCrop;
    }

    public plantAction (event: MouseEvent) {
        if (this.selectedCrop && this.scene.leftMouseButton) {
            const objects = PhysicsUtils.raycastFromMouse(new THREE.Vector2(event.clientX, event.clientY), this.scene.mainCamera, this.scene.children.filter(node => node instanceof FarmLand));
            objects.forEach(element => {
                element.object.traverseAncestors(node => {
                    if (node instanceof FarmLand && !(node as FarmLand).currentCrop) {
                        (node as FarmLand).plant(this.selectedCrop!);
                    }
                })
            })
        }
    }

    public stopPlanting (crop: CropInfo) {
        
    }
}