import * as THREE from 'three';

export default class GameObject extends THREE.Object3D<THREE.Object3DEventMap> {


    constructor() {
        super();
    }

    public async initialize () {
        this.scale.set(0.25,0.25,0.25);
    }

    public async tick () {

    }
}