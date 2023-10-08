import * as THREE from 'three';
import SceneBase from './SceneBase';

export default class GameScene extends SceneBase {

    async initialize() {

        const appleMtl = await this.createMtl('assets/models/apple.mtl');

        const apple = await this.createModel(appleMtl, 'assets/models/apple.obj');
        apple.position.x = 0;
        apple.position.y = 0;
        apple.position.z = 0;

        this.add(apple);

        const planeMaterial = new THREE.MeshLambertMaterial({color: 0x516737});
        const planeGeometry = new THREE.PlaneGeometry(100,100,1,1);
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.rotateX( - Math.PI / 2);
        planeMesh.receiveShadow = true;
        this.add(planeMesh);


        const light = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.castShadow = true;
        light.shadow.mapSize = new THREE.Vector2(1024 * 2, 1024 * 2);
        light.position.set(0, 4, 2);


        const ambientLight = new THREE.AmbientLight(0xFFFFFF, .33);

        this.add(light);
        this.add(ambientLight);
    }
}