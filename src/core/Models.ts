import ModelUtils from "../utils/ModelUtils";
import Materials from "./Materials";

export default class Models {

    static carrotCrops: Array<THREE.Object3D<THREE.Object3DEventMap>> = [];

    static async initialize () {
        const cropMaterialGroup : THREE.Material[] = [
            Materials.data.get('main_material')!,
            Materials.data.get('leaves_diff_material')!,
        ]

        const cropMaterialGroup2 : THREE.Material[] = [
            Materials.data.get('leaves_diff_material')!,
            Materials.data.get('main_material')!,
        ]
        this.carrotCrops.push(await ModelUtils.createObjModel('assets/models/crops/Carrot_Crop_0.obj', cropMaterialGroup));
        this.carrotCrops.push(await ModelUtils.createObjModel('assets/models/crops/Carrot_Crop_1.obj', cropMaterialGroup2));
        this.carrotCrops.push(await ModelUtils.createObjModel('assets/models/crops/Carrot_Crop_2.obj', cropMaterialGroup2));
    }
}