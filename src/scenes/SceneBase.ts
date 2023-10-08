import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export default class SceneBase extends THREE.Scene {
    protected readonly mtlLoader = new MTLLoader();
    protected readonly objLoader = new OBJLoader();

    protected async createModel(mtl: MTLLoader.MaterialCreator, path: string) {
        this.objLoader.setMaterials(mtl);
        const modelRoot = await this.objLoader.loadAsync(path);
        modelRoot.rotateY(Math.PI * 0.5);
        modelRoot.traverse(function(node) {
            node.castShadow = true;
            node.receiveShadow = true;
        });
        return modelRoot;
    }

    protected async createMtl (path: string) {
        const newMtl = await this.mtlLoader.loadAsync(path);
        newMtl.preload();
        return newMtl;
    }

    
}