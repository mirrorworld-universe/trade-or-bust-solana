import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { PlayerData } from '../../models/PlayerData';
import { ponzi_controller } from '../../ponzi-controller';
import { ccc_msg } from '../../enums/ccc_msg';
import { solana_bridge } from '../../solana-bridge';
const { ccclass, property } = _decorator;

@ccclass('title_money')
export class title_money extends Component {

    @property({type:Label})
    private moneyLabel:Label;
    
    start() {

    }

    update(deltaTime: number) {
        if(!this._inited) this.init();
    }
    
    private _inited:boolean = false;
    public async init(){
        const playerEntity = globalThis.ponzi.currentPlayer;
        if(!playerEntity) return;

        this._inited = true;
        let currentPlayer = null;
        try{
            currentPlayer = solana_bridge.instance.queryPlayer(playerEntity);
            this.moneyLabel.string = this.getBalanceString(currentPlayer.money.toNumber());
        }catch{
            currentPlayer = null;
        }

        this.registerListeners();
    }

    private registerListeners(){
        const self = this;
        const playerEntity = globalThis.ponzi.currentPlayer;
        ponzi_controller.instance.on(ccc_msg.on_player_update,(obj)=>{
            let entity = obj.entity;
            let oldObj = obj.oldObj;
            let newObj = obj.newObj;

            if(playerEntity == entity){
                self.moneyLabel.string = self.getBalanceString(newObj);
            }
        })
    }

    private getBalanceString(newObj:any){
        return "BALANCE $" + newObj.money;;
    }
}

