import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export default class SceneBase extends THREE.Scene {
    protected readonly mtlLoader = new MTLLoader();
    protected readonly objLoader = new OBJLoader();
    protected readonly fbxLoader = new FBXLoader();
    protected readonly textureLoader = new THREE.TextureLoader();

    protected async createObjModelWithMTL(path: string, mtl?: MTLLoader.MaterialCreator) : Promise<THREE.Group<THREE.Object3DEventMap>> {
        if (mtl != null) {
            this.objLoader.setMaterials(mtl);
        }
        const modelRoot = await this.objLoader.loadAsync(path);
        modelRoot.rotateY(Math.PI * 0.5);
        modelRoot.traverse(function(node) {
            node.castShadow = true;
            node.receiveShadow = true;
        });
        return modelRoot;
    }

    protected async createMtl (path: string) : Promise<MTLLoader.MaterialCreator> {
        const newMtl = await this.mtlLoader.loadAsync(path);
        newMtl.preload();
        return newMtl;
    }

    protected async createObjModel(path: string, material?: THREE.Material) : Promise<THREE.Group<THREE.Object3DEventMap>> {
        const modelRoot = await this.objLoader.loadAsync(path);
        modelRoot.rotateY(Math.PI * 0.5);
        modelRoot.traverse(function(node) {
            if (material != null) {
                (node as THREE.Mesh).material = material!;
            }
            node.castShadow = true;
            node.receiveShadow = true;
        });
        modelRoot.scale.set(0.25,0.25,0.25);
        return modelRoot;
    }

    protected async createFbxModel (path: string, material?: THREE.Material) : Promise<THREE.Group<THREE.Object3DEventMap>> {
        const modelRoot = await this.fbxLoader.loadAsync(path);
        modelRoot.rotateY(Math.PI * 0.5);
        modelRoot.traverse((node) => {
            if (material != null) {
                (node as THREE.Mesh).material = material!;
            }
            node.castShadow = true;
            node.receiveShadow = true;
        });
        return modelRoot;
    }

    protected async createTextureMaterial (path: string) : Promise<THREE.Material> {
        const tex = await this.textureLoader.loadAsync(path);
        return new THREE.MeshStandardMaterial({
            map: tex,
        });
    }

    public tick () {
        
    }
    
}