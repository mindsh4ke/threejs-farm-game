import * as THREE from 'three';
import Layers from '../core/Layers';

export default class GameObject extends THREE.Object3D<THREE.Object3DEventMap> {


    constructor() {
        super();
    }

    public async initialize () {
        this.scale.set(0.25,0.25,0.25);
    }

    public async tick () {

    }

    public onClick () {
        
    }

    public setLayer (layer: number) {
        this.traverse(node => {
            node.layers.set(layer);
        })
    }

    public setTag (tag: string) {
        this.traverse(node => {
            node.userData.tag = tag;
        })
    }
}