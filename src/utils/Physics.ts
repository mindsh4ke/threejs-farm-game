import * as THREE from 'three';

export default class PhysicsUtils {

    static raycastFromMouse(mousePos: THREE.Vector2, camera: THREE.Camera, objects: THREE.Object3D[], layer?: number) {
        const screenMousePos = new THREE.Vector2((mousePos.x / window.innerWidth) * 2 - 1, -(mousePos.y / window.innerHeight) * 2 + 1);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(screenMousePos, camera);
        if (layer != undefined) {
            raycaster.layers.set(layer);
        }

        return raycaster.intersectObjects(objects, true);
    }

    static singleRaycastFromMouse (mousePos: THREE.Vector2, camera: THREE.Camera, object: THREE.Object3D, layer?: number) {
        return PhysicsUtils.raycastFromMouse(mousePos, camera, [object], layer)[0];
    }

}