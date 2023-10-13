import * as THREE from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import ModelUtils from '../utils/ModelUtils';

export default class Materials {
    static data: Map<string, THREE.Material> = new Map<string, THREE.Material>([
        [
            'line_material', new LineMaterial( {
                color: 0xffffff,
                linewidth: 0.025,
            })
        ],
        [
            "placeholder_material", new THREE.MeshBasicMaterial({
                wireframe: true
            })
        ]
    ])

    static async initialize () {
        this.data.set('main_material', await ModelUtils.createTextureMaterial('assets/textures/PolygonFarm_Texture_01_A.png'));
        this.data.set('leaves_diff_material', await ModelUtils.createTextureMaterial('assets/textures/Leaves_Diff.png'));
        this.data.get('leaves_diff_material')!.transparent = true;
    }
}