import * as THREE from 'three';
import SceneBase from './SceneBase';
import FarmLand from '../objects/FarmLand';
import Materials from '../core/Materials';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import PlaceFarmLandSystem from '../systems/PlaceFarmLandSystem';
import PhysicsUtils from '../utils/Physics';
import ModelUtils from '../utils/ModelUtils';

export default class GameScene extends SceneBase {

    lightZPos: number;
    mainMaterial: THREE.Material;

    mainPlane: THREE.Mesh;

    placeFarmlandSystem: PlaceFarmLandSystem = new PlaceFarmLandSystem(this);

    constructor(camera: THREE.Camera) {
        super(camera);
        this.lightZPos = 1;
    }

    override async initialize() {
        await super.initialize();
        await Materials.initialize();
        await this.placeFarmlandSystem.initialize();

        const farmHouse = await ModelUtils.createObjModel('assets/models/buildings/SM_Bld_Farmhouse_01.obj', Materials.data.get('main_material'));
        farmHouse.position.set(0, 0, 0);
        this.add(farmHouse);

        for (let i = -20; i < 20; i++) {
            const baseRoad = await ModelUtils.createObjModel('assets/models/buildings/SM_Env_Road_Dirt_Straight_01.obj', Materials.data.get('main_material'));
            baseRoad.position.set(2.4, 0, i * 2.5);
            baseRoad.rotateY(Math.PI / 2);
            this.add(baseRoad);
        }

        const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x677D37 });
        const planeGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
        this.mainPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.mainPlane.rotateX(- Math.PI / 2);
        this.mainPlane.receiveShadow = true;
        this.add(this.mainPlane);

        const light = new THREE.DirectionalLight(0xFFFFFF, 1.2);
        light.castShadow = true;
        light.shadow.mapSize = new THREE.Vector2(1024 * 2, 1024 * 2);
        light.position.set(0, 8, 4);
        const targetObject = new THREE.Object3D();
        targetObject.position.set(-2, 2, 0);
        light.target = targetObject;
        this.add(targetObject);

        const ambientLight = new THREE.AmbientLight(0xFFF6E8, .55);

        this.add(light);
        this.add(ambientLight);

        this.setUI();
    }

    override tick() {

    }

    setUI() {
        const setFarmButton = document.getElementById('set-farm-button');

        setFarmButton!.onclick = () => this.setFarmLand();
    }

    async setFarmLand() {
        this.placeFarmlandSystem.start();
    }

    cancelSetFarmLand () {
        this.placeFarmlandSystem.cancel();
    }

    override onMouseMove (event: MouseEvent) {
        const point = PhysicsUtils.singleRaycastFromMouse(new THREE.Vector2(event.clientX, event.clientY), this.mainCamera, this.mainPlane).point;
        const fixedPoint = new THREE.Vector2(Math.round(point.x),Math.round(point.z));
        this.placeFarmlandSystem.updatePlaceholder(fixedPoint);
    }

    override onMouseDown(event: MouseEvent) {
        super.onMouseDown(event);
        if (event.button === 0) {
            if (this.placeFarmlandSystem.isPlacing) {
                const point = PhysicsUtils.singleRaycastFromMouse(new THREE.Vector2(event.clientX, event.clientY), this.mainCamera, this.mainPlane).point;
                const fixedPoint = new THREE.Vector2(Math.round(point.x),Math.round(point.z));
                this.placeFarmlandSystem.setPoint(fixedPoint);
            }
        } else if (event.button === 2) {
            if (this.placeFarmlandSystem.isPlacing) {
                this.cancelSetFarmLand();
            }
        }
    }
}