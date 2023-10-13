export class CropInfo {
    public id: string;
    public name: string;
    public growthDuration: number;
    public buyPrice: number;
    public sellPrice: number;
    public minRecolectAmount: number;
    public maxRecolectAmount: number;

    constructor(id: string, name: string, growthDuration: number, buyPrice: number, sellPrice: number, minRecolectAmount: number, maxRecolectAmount: number) {
        this.id = id;
        this.name = name;
        this.growthDuration =growthDuration;
        this.buyPrice = buyPrice;
        this.sellPrice = sellPrice;
        this.minRecolectAmount = minRecolectAmount;
        this.maxRecolectAmount = maxRecolectAmount;
    }
}

const CropsInfo: Map<string, CropInfo> = new Map<string, CropInfo>([
    ['carrot', new CropInfo("carrot", "Carrot", 0, 30,40, 10, 14)],
    ['wheat', new CropInfo("wheat", "Wheat", 15, 40,40,0,0)],
    ['lettuce', new CropInfo("lettuce", "Lettuce", 15, 40,40,0,0)],
    ['corn', new CropInfo("corn", "Corn", 30, 60,70,0,0)],
    ['onion', new CropInfo("onion", "Onion", 20, 50,80,0,0)],
])

export default CropsInfo;


