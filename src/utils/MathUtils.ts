import * as THREE from 'three';

export default class MathUtils {
    public static toScreenPosition(obj: THREE.Object3D, camera: THREE.Camera) : THREE.Vector2 {
        var vector = new THREE.Vector3();

        var widthHalf = 0.5 * window.innerWidth;//renderer.getContext().canvas.width;
        var heightHalf = 0.5 * window.innerHeight;//renderer.getContext().canvas.height;

        obj.updateMatrixWorld();
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(camera);

        vector.x = (vector.x * widthHalf) + widthHalf;
        vector.y = - (vector.y * heightHalf) + heightHalf;

        return new THREE.Vector2(vector.x, vector.y);

    };

    public static lerp = (a: number, b: number, t: number) => a + t * (b - a);
}