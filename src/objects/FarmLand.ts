import * as THREE from 'three';
import GameObject from './GameObject';
import { CropInfo } from '../data/CropInfo';
import { addMinutes } from 'date-fns';
import Models from '../core/Models';
import RecolectParticle from './DOM/RecolectParticle';
import MathUtils from '../utils/MathUtils';

export default class FarmLand extends GameObject {

    dirtChild: THREE.Object3D<THREE.Object3DEventMap>
    harvestedChild: THREE.Object3D<THREE.Object3DEventMap>
    cropChild: THREE.Object3D<THREE.Object3DEventMap>

    isPlown: boolean = false;
    isGrown: boolean = false;
    growStatus: number = 0;
    currentCrop?: CropInfo;
    plantDateTime: Date;



    constructor(dirtChild: THREE.Object3D<THREE.Object3DEventMap>, harvestedChild: THREE.Object3D<THREE.Object3DEventMap>) {
        super();
        this.dirtChild = dirtChild;
        this.harvestedChild = harvestedChild;
        this.dirtChild.position.set(0, -0.05, 0);
        this.harvestedChild.position.set(0, -0.05, 0);
        this.add(dirtChild);
        this.add(harvestedChild);
    }

    override async initialize() {
        super.initialize();
        this.harvestedChild.visible = this.isPlown;
        this.dirtChild.visible = !this.isPlown;
    }

    override onClick(event: MouseEvent): void {
        if (event.button === 0) {

        }
    }

    public plow() {
        this.isPlown = true;
        this.harvestedChild.visible = this.isPlown;
        this.dirtChild.visible = !this.isPlown;
    }

    public plant(crop: CropInfo) {
        if (this.isPlown) {
            this.currentCrop = crop;
            this.plantDateTime = new Date();

            this.cropChild = Models.carrotCrops[0].clone(true);
            this.add(this.cropChild);
        }
    }

    public harvest(camera: THREE.Camera) {
        if (this.isGrown) {
            for (let i = 0; i < this.currentCrop!.minRecolectAmount; i++) {
                const particle = new RecolectParticle(this.currentCrop!, MathUtils.toScreenPosition(this, camera), MathUtils.toScreenPosition(this, camera));
            }
            this.isGrown = false;
            this.growStatus = 0;
            this.currentCrop = undefined;
            this.remove(this.cropChild);
        }
    }

    /**
     * Event called every realtime second
     */
    public onTimeSecond() {
        if (this.currentCrop) {
            const midGrowDateTime = addMinutes(this.plantDateTime, this.currentCrop!.growthDuration / 2);
            const finishGrowDateTime = addMinutes(this.plantDateTime, this.currentCrop!.growthDuration);

            if (new Date() >= finishGrowDateTime && this.growStatus == 1) {
                this.remove(this.cropChild);
                this.cropChild = Models.carrotCrops[2].clone(true);
                this.add(this.cropChild);
                this.isGrown = true;
                this.growStatus = 2;
            } else if (new Date() >= midGrowDateTime && this.growStatus == 0) {
                this.remove(this.cropChild);
                this.cropChild = Models.carrotCrops[1].clone(true);
                this.add(this.cropChild);
                this.growStatus = 1;
            }
        }
    }
}