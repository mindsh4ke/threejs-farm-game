import * as THREE from 'three';
import SceneBase from './SceneBase';

export default class GameScene extends SceneBase {

    async initialize() {

        const mainMaterial = await this.createTextureMaterial('assets/textures/PolygonFarm_Texture_01_A.png');

        const farmHouse = await this.createObjModel('assets/models/SM_Bld_Farmhouse_01.obj', mainMaterial);
        farmHouse.position.set(0,0,0);
        this.add(farmHouse);

        for (let i = -20; i < 20; i++) {
            const baseRoad = await this.createObjModel('assets/models/SM_Env_Road_Dirt_Straight_01.obj', mainMaterial);
            baseRoad.position.set(2.4,0,i * 2.5);
            baseRoad.rotateY(Math.PI/2);
            this.add(baseRoad);
        }

        const planeMaterial = new THREE.MeshLambertMaterial({color: 0x677D37});
        const planeGeometry = new THREE.PlaneGeometry(100,100,1,1);
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.rotateX( - Math.PI / 2);
        planeMesh.receiveShadow = true;
        this.add(planeMesh);

        const light = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.castShadow = true;
        light.shadow.mapSize = new THREE.Vector2(1024 * 2, 1024 * 2);
        light.position.set(0, 8, 4);


        const ambientLight = new THREE.AmbientLight(0xFFF6E8, .33);

        this.add(light);
        this.add(ambientLight);
        
    }
}