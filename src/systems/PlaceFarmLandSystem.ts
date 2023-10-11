import * as THREE from 'three';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import Materials from '../core/Materials';
import ModelUtils from '../utils/ModelUtils';
import FarmLand from '../objects/FarmLand';
import Layers from '../core/Layers';
import GameObject from '../objects/GameObject';

export default class PlaceFarmLandSystem {

    public isPlacing: boolean;
    private firstPoint?: THREE.Vector2;
    private secondPoint?: THREE.Vector2;
    private scene: THREE.Scene;
    private points: Array<number>;
    private lineGeometry: LineGeometry;
    private farmlandPlaceholder: THREE.Object3D;
    private dirtFarmLand: THREE.Object3D;
    private harvestedFarmland: THREE.Object3D;
    private mainGrid: THREE.GridHelper;

    public farmlands: Array<GameObject> = [];

    constructor(scene: THREE.Scene) {
        this.scene = scene;

        this.lineGeometry = new LineGeometry();

        this.farmlandPlaceholder = new Line2(this.lineGeometry, Materials.data.get('line_material') as LineMaterial);
        this.farmlandPlaceholder.visible = false;
        scene.add(this.farmlandPlaceholder);
    }

    async initialize() {
        this.dirtFarmLand = await ModelUtils.createObjModel('assets/models/environment/SM_Env_Dirt_Skirt_01.obj', Materials.data.get('main_material'));
        this.harvestedFarmland = await ModelUtils.createObjModel('assets/models/environment/SM_Env_Dirt_Rows_Skirt_01.obj', Materials.data.get('main_material'));
        this.mainGrid = new THREE.GridHelper(50,50, 0xb5b5b5, 0xb5b5b5);
        this.mainGrid.visible = false;
        this.mainGrid.position.set(0,0.05,0);
        this.scene.add(this.mainGrid);
    }

    public start () {
        this.mainGrid.visible = true;
        this.isPlacing = true;
    }

    public setPoint(position: THREE.Vector2) {
        if (this.firstPoint == undefined) {
            this.farmlandPlaceholder.visible = true;
            this.firstPoint = position;
        } else {
            this.secondPoint = position;
            this.place();
            this.cancel();
        }
    }

    public place() {
        let initX = this.firstPoint!.x > this.secondPoint!.x ? this.secondPoint!.x : this.firstPoint!.x;
        let finalX = this.firstPoint!.x > this.secondPoint!.x ? this.firstPoint!.x : this.secondPoint!.x;
        let initY = this.firstPoint!.y > this.secondPoint!.y ? this.secondPoint!.y : this.firstPoint!.y;
        let finalY = this.firstPoint!.y > this.secondPoint!.y ? this.firstPoint!.y : this.secondPoint!.y;

        for (let x = initX; x < finalX; x++) {
            for (let z = initY; z < finalY; z++) {
                const farmLand = new FarmLand(this.dirtFarmLand.clone(), this.harvestedFarmland.clone());
                farmLand.position.set(x,0.1,z + 1);
                farmLand.initialize();
                this.scene.add(farmLand);
                this.farmlands.push(farmLand);
            }
        }
    }

    public updatePlaceholder(position: THREE.Vector2) {
        if (this.isPlacing) {
            this.points = [
                this.firstPoint!.x, 0.1, this.firstPoint!.y,
                position.x, 0.1, this.firstPoint!.y,
                position.x, 0.1, position.y,
                this.firstPoint!.x, 0.1, position.y,
                this.firstPoint!.x, 0.1, this.firstPoint!.y
            ]
            this.lineGeometry.setPositions(this.points);
        }
    }

    public cancel() {
        this.isPlacing = false;
        this.farmlandPlaceholder.visible = false;
        this.firstPoint = undefined;
        this.secondPoint = undefined;
        this.mainGrid.visible = false;
    }

}