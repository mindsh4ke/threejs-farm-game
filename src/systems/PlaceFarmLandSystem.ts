import * as THREE from 'three';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import Materials from '../Materials';

export default class PlaceFarmLandSystem {

    private isPlacing: boolean;
    private firstPoint: THREE.Vector2;
    private secondPoint: THREE.Vector2;
    private scene: THREE.Scene;
    private points: Array<number>;
    private lineGeometry: LineGeometry;

    constructor (scene: THREE.Scene) {
        this.scene = scene;

        this.lineGeometry = new LineGeometry();
        
        const farmlandPlaceholder = new Line2(this.lineGeometry, Materials.LINE_MATERIAL);
        scene.add(farmlandPlaceholder);
    }

    public setPoint (position: THREE.Vector2) {
        if (!this.isPlacing) {
            this.isPlacing = true;
            this.firstPoint = position;
        } else {
            this.secondPoint = position;
        }
    }

    public updatePlaceholder (position: THREE.Vector2) {
        if (this.isPlacing) {
            this.points = [
                this.firstPoint.x, 0.1, this.firstPoint.y,
                position.x, 0.1,this.firstPoint.y,
                position.x, 0.1, position.y,
                this.firstPoint.x, 0.1, position.y,
                this.firstPoint.x, 0.1, this.firstPoint.y
            ]
            this.lineGeometry.setPositions(this.points);
        }
    }

}