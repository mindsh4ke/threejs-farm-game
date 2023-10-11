import * as THREE from 'three';
import GameObject from './GameObject';

export default class FarmLand extends GameObject {

    dirtChild: THREE.Object3D<THREE.Object3DEventMap>
    harvestedChild: THREE.Object3D<THREE.Object3DEventMap>

    isHarvested: boolean = false;

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
        this.harvestedChild.visible = this.isHarvested;
        this.dirtChild.visible = !this.isHarvested;
    }

    override onClick(event: MouseEvent): void {
        if (event.button === 0) {
            
        }
    }

    public plow () {
        this.isHarvested = true;
            this.harvestedChild.visible = this.isHarvested;
            this.dirtChild.visible = !this.isHarvested;
    }
}