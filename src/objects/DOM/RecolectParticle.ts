import { CropInfo } from "../../data/CropInfo";
import * as THREE from 'three';
import MathUtils from "../../utils/MathUtils";

export default class RecolectParticle {
    private crop: CropInfo;
    private origin: THREE.Vector2;
    private current: THREE.Vector2;
    private destination: THREE.Vector2;
    private domElement: HTMLImageElement;

    constructor(crop: CropInfo, origin: THREE.Vector2, destination: THREE.Vector2) {
        this.crop = crop;
        this.origin = origin;
        this.destination = destination;
        this.domElement = document.createElement('img');
        this.domElement.classList.add('absolute');
        this.domElement.setAttribute('src', `/assets/images/plants/${crop.id}.png`);
        this.domElement.setAttribute('width', '20');
        this.current = origin.clone();
        this.domElement.style.left = `${this.current.x}px`;
        this.domElement.style.top = `${this.current.y}px`;

        document.getElementById('ui')!.append(this.domElement);
    }


    public tick () {

        const currentX = MathUtils.lerp(this.current.x, this.destination.x, 12);
        const currentY = MathUtils.lerp(this.current.y, this.destination.y, 12);

        this.domElement.style.left = `${this.current.x}px`;
        this.domElement.style.top = `${this.current.y}px`;
    }
}