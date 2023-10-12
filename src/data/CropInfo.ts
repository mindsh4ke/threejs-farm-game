class CropInfo {
    public name: string;
    public growthDuration: number;
    public buyPrice: number;
    public sellPrice: number;

    constructor(name: string, growthDuration: number, buyPrice: number, sellPrice: number) {
        this.name = name;
        this.growthDuration =growthDuration;
        this.buyPrice = buyPrice;
        this.sellPrice = sellPrice;
    }
}

const CropsInfo: Map<string, CropInfo> = new Map<string, CropInfo>([
    ['carrot', new CropInfo("Carrot", 10, 30,40)],
    ['wheat', new CropInfo("Carrot", 15, 40,40)],
    ['lettuce', new CropInfo("Carrot", 15, 40,40)],
    ['corn', new CropInfo("Carrot", 30, 60,70)],
    ['onion', new CropInfo("Carrot", 20, 50,80)],
])

export default CropsInfo;


