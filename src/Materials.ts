import * as THREE from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

export default class Materials {
    static PLACEHOLDER_MATERIAL : THREE.Material = new THREE.MeshBasicMaterial({
        wireframe: true
    });

    static LINE_MATERIAL = new LineMaterial( {
        color: 0xffffff,
        linewidth: 0.05,
    } );
}