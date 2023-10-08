import * as THREE from 'three';
import SceneBase from './SceneBase';
import FarmLand from '../objects/FarmLand';
import Materials from '../Materials';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import PlaceFarmLandSystem from '../systems/PlaceFarmLandSystem';

export default class GameScene extends SceneBase {

    lightZPos: number;
    mainMaterial: THREE.Material;
    mainCamera: THREE.Camera;

    placingFarmland: boolean = false;
    placeFarmlandSystem: PlaceFarmLandSystem = new PlaceFarmLandSystem(this);

    constructor(camera: THREE.Camera) {
        super();
        this.lightZPos = 1;
        this.mainCamera = camera;
    }

    override async initialize() {
        await super.initialize();
        this.mainMaterial = await this.createTextureMaterial('assets/textures/PolygonFarm_Texture_01_A.png');

        const farmHouse = await this.createObjModel('assets/models/buildings/SM_Bld_Farmhouse_01.obj', this.mainMaterial);
        farmHouse.position.set(0, 0, 0);
        this.add(farmHouse);

        for (let i = -20; i < 20; i++) {
            const baseRoad = await this.createObjModel('assets/models/buildings/SM_Env_Road_Dirt_Straight_01.obj', this.mainMaterial);
            baseRoad.position.set(2.4, 0, i * 2.5);
            baseRoad.rotateY(Math.PI / 2);
            this.add(baseRoad);
        }

        const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x677D37 });
        const planeGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.rotateX(- Math.PI / 2);
        planeMesh.receiveShadow = true;
        this.add(planeMesh);

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
        this.placingFarmland = true;

        const dirtLand = await this.createObjModel('assets/models/environment/SM_Env_Dirt_Skirt_01.obj', this.mainMaterial);
        const haverstedDirtLand = await this.createObjModel('assets/models/environment/SM_Env_Dirt_Rows_Skirt_01.obj', this.mainMaterial);

        const farmLand = new FarmLand(dirtLand.clone(), haverstedDirtLand.clone());
        farmLand.initialize();
        this.add(farmLand);
        farmLand.position.set(-1, 0, 4)

    }

    override onMouseMove (event: MouseEvent) {
        const mousePos = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 + 1);
        this.placeFarmlandSystem.updatePlaceholder(mousePos);
    }

    override onMouseDown(event: MouseEvent) {
        super.onMouseDown(event);
        if (this.placingFarmland) {
            
            const mousePos = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 + 1);
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mousePos, this.mainCamera);

            this.placeFarmlandSystem.setPoint(mousePos);
        }
    }
}