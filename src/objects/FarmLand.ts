import * as THREE from 'three';
import GameObject from './GameObject';

export default class FarmLand extends GameObject {

    dirtChild: THREE.Object3D<THREE.Object3DEventMap>
    harvestedChild: THREE.Object3D<THREE.Object3DEventMap>

    isHarvested: false

    constructor(dirtChild: THREE.Object3D<THREE.Object3DEventMap>, harvestedChild: THREE.Object3D<THREE.Object3DEventMap>) {
        super();
        this.dirtChild = dirtChild;
        this.harvestedChild = harvestedChild;
        dirtChild.position.set(0,0.1,0)
        dirtChild.scale.set(1,1,1)
        this.add(dirtChild);
        this.add(harvestedChild);
    }

    override async initialize () {
        super.initialize();
        this.harvestedChild.visible = this.isHarvested;
        this.dirtChild.visible = !this.isHarvested;
    }
}