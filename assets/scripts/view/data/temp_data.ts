
export class temp_data {
    private static _instance: temp_data;
    public static get instance(): temp_data {
        if (!temp_data._instance) {
            temp_data._instance = new temp_data();
        }
        return temp_data._instance;
    }

    private tradeAsset:number;
    private tradeTargetPlayer:string;
    public setTradeInfo(asset:number,targetPlayer:string){
        this.tradeAsset = asset;
        this.tradeTargetPlayer = targetPlayer;
    }

    public getTradeInfo(){
        return [this.tradeAsset,this.tradeTargetPlayer];
    }
}

