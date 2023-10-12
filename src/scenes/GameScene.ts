import * as THREE from 'three';
import SceneBase from './SceneBase';
import FarmLand from '../objects/FarmLand';
import Materials from '../core/Materials';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import PlaceFarmLandSystem from '../systems/PlaceFarmLandSystem';
import PhysicsUtils from '../utils/Physics';
import ModelUtils from '../utils/ModelUtils';
import PlowFarmLandSystem from '../systems/PlowFarmLandSystem';
import CropInfo from '../data/CropInfo';
import CropsInfo from '../data/CropInfo';

export default class GameScene extends SceneBase {

    lightZPos: number;
    mainMaterial: THREE.Material;

    mainPlane: THREE.Mesh;

    placeFarmlandSystem: PlaceFarmLandSystem = new PlaceFarmLandSystem(this);
    plowFarmlandSystem: PlowFarmLandSystem = new PlowFarmLandSystem(this);

    constructor(camera: THREE.Camera, renderer: THREE.Renderer) {
        super(camera, renderer);
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

        const light = new THREE.DirectionalLight(0xffe6d4, 1.8);
        light.castShadow = true;
        light.shadow.mapSize = new THREE.Vector2(1024 * 2, 1024 * 2);
        light.position.set(0, 8, 4);
        const targetObject = new THREE.Object3D();
        targetObject.position.set(-2, 2, 0);
        light.target = targetObject;
        this.add(targetObject);

        const ambientLight = new THREE.AmbientLight(0xFFFFFF, .6);

        this.add(light);
        this.add(ambientLight);

        this.setUI();
    }

    override tick() {

    }

    setUI() {
        const setFarmButton = document.getElementById('set-farm-button');
        const plowButton = document.getElementById('plow-button');

        //Set plant buttons functionality
        const plantButtons = document.getElementsByClassName('crop-button');
        for (let i = 0; i < plantButtons.length; i++) {
            plantButtons.item(i)?.classList.add('w-16', 'h-16', 'rounded-full', 'text-white', 'flex', 'items-center', 'justify-center', 'cursor-pointer', 'hover:ring-2', 'hover:shadow-lg', 'hover:ring-gray-400', 'hover:bg-gray-600', 'hover:-translate-y-1', 'active:translate-y-0', 'transition-all', 'duration-100');
        }

        //Generate plant tooltips content
        const plantTooltips = document.querySelectorAll('.crop-button .tooltip')
        plantTooltips.forEach(tooltip => {
            tooltip.classList.add('absolute', '-top-28', 'w-[200px]', 'bg-slate-700', 'rounded-lg', 'shadow-xl', 'pointer-events-none', 'p-4');
            const cropInfo = CropsInfo.get(tooltip.id.split('-')[0])!;
            
            const tooltipContent = (): HTMLDivElement => {
                const parent = document.createElement('div') as HTMLDivElement;

                const title = document.createElement('h4') as HTMLHRElement;
                title.classList.add('font-bold');
                title.innerText = cropInfo.name;

                const timeContainer = document.createElement('div') as HTMLDivElement;
                timeContainer.classList.add('flex','flex-row','gap-x-2');

                const growthDurationIcon = document.createElement('span') as HTMLSpanElement;
                growthDurationIcon.classList.add('material-symbols-rounded');
                growthDurationIcon.innerText = 'timelapse';

                const growthDurationText = document.createElement('span') as HTMLSpanElement;
                growthDurationText.innerText = cropInfo.growthDuration.toString();

                timeContainer.append(growthDurationIcon, growthDurationText);

                const moneyContainer = document.createElement('div') as HTMLDivElement;
                moneyContainer.classList.add('flex','flex-row','gap-x-4');

                const priceContainer = document.createElement('div') as HTMLDivElement;
                priceContainer.classList.add('flex','flex-row','gap-x-1');

                const priceIcon = document.createElement('span') as HTMLSpanElement;
                priceIcon.classList.add('material-symbols-rounded');
                priceIcon.innerText = 'shopping_cart';

                const priceText = document.createElement('span') as HTMLSpanElement;
                priceText.innerText = cropInfo.buyPrice.toString();
                priceContainer.append(priceIcon, priceText);

                const sellContainer = document.createElement('div') as HTMLDivElement;
                sellContainer.classList.add('flex','flex-row','gap-x-1');

                const sellIcon = document.createElement('span') as HTMLSpanElement;
                sellIcon.classList.add('material-symbols-rounded');
                sellIcon.innerText = 'storefront';

                const sellText = document.createElement('span') as HTMLSpanElement;
                sellText.innerText = cropInfo.sellPrice.toString();
                sellContainer.append(sellIcon, sellText);

                moneyContainer.append(priceContainer, sellContainer);

                parent.append(title, timeContainer, moneyContainer);
                return parent;
            }

            tooltip.append(tooltipContent());
        })

        setFarmButton!.onclick = () => this.setFarmLand();
        plowButton!.onclick = () => {
            if (this.plowFarmlandSystem.isPlowing) {
                this.plowFarmlandSystem.endPlowMode();
                plowButton!.classList.remove('-translate-y-1', 'shadow-lg', 'bg-slate-700')
            } else {
                this.plowFarmlandSystem.startPlowMode();
                plowButton!.classList.add('-translate-y-1', 'shadow-lg', 'bg-slate-700')
            }
            
        }
    }

    async setFarmLand() {
        this.placeFarmlandSystem.start();
    }

    cancelSetFarmLand () {
        this.placeFarmlandSystem.cancel();
    }

    override onMouseMove (event: MouseEvent) {
        if (this.placeFarmlandSystem.isPlacing) {
            const point = PhysicsUtils.singleRaycastFromMouse(new THREE.Vector2(event.clientX, event.clientY), this.mainCamera, this.mainPlane).point;
            const fixedPoint = new THREE.Vector2(Math.round(point.x),Math.round(point.z));
            this.placeFarmlandSystem.updatePlaceholder(fixedPoint);
        }

        else if (this.plowFarmlandSystem.isPlowing) {
            this.plowFarmlandSystem.actionPlow(event, this.mainPlane);
        }
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