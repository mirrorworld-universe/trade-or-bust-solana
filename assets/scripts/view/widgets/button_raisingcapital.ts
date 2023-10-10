import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { ponzi_controller } from '../../ponzi-controller';
import { ccc_msg } from '../../enums/ccc_msg';
import { sys } from 'cc';
import { Button } from 'cc';
import { time_utils } from '../../utils/time_utils';
import { component_state } from '../../enums/component_state';
import { log } from 'cc';
import { warn } from 'cc';
import { ponzi_config } from '../../enums/ponzi_config';
import { solana_bridge } from '../../solana-bridge';
import { RoleLocalObj } from '../data/RoleLocalObj';
const { ccclass, property } = _decorator;

@ccclass('button_raisingcapital')
export class button_raisingcapital extends Component {
    @property({type:Label})
    private label:Label;

    @property({type:Button})
    private button:Button;

    start() {

    }

    async update(deltaTime: number) {
        if(!this._inited) await this.init();
    }

    public async onBtnClicked(){
        ponzi_controller.instance.sendCCCMsg(ccc_msg.show_pick_asset,true);
    }

    private _inited:boolean = false;
    private async init(){
        let gameState = globalThis.ponzi.gameState;
        if(gameState != component_state.game_ingame) return;
        
        const playerEntity = globalThis.ponzi.currentPlayer;
        if(!playerEntity) return;

        if(!globalThis.ponzi.players) return;

        let player = null;
        try{
            let array = {};
            for (let key in globalThis.ponzi.players) {
                let map = globalThis.ponzi.players[key];
                let hash = map.player;

                if(!array[hash]){
                    array[hash] = new RoleLocalObj();
                }
                let obj:RoleLocalObj = array[hash];
                array[hash] = obj;
                    obj.row = map.y.toNumber();
                    obj.col = map.x.toNumber();
                    obj.money = map.money.toNumber();
            }
            player = array[playerEntity];
        }catch{
            log("Can not find RaiseColddown component on entity");
        }
        if(!player) return;

        this._inited = true;
        await this.updateUI();
        this._registerListeners();
    }

    private async updateUI(){
        console.error("raise updateUI");
        const playerEntity = globalThis.ponzi.currentPlayer;
        

        let player = null;
        try{
            let array = {};
            for (let key in globalThis.ponzi.players) {
                let map = globalThis.ponzi.players[key];
                let hash = map.player;

                if(!array[hash]){
                    array[hash] = map;
                }
            }
            player = array[playerEntity];
        }catch{
            log("Can not find RaiseColddown component on entity");
        }
        if(!player) return;


        let raiseCountdown = null;
        try{
            raiseCountdown = player;
        }catch{
            log("Can not get raisecolddown component on entity");
        }
        if(!raiseCountdown) return;
        
        let timeStamp:number = sys.now()/1000;
        let useableTime:number = Number(raiseCountdown.coolDownEndedAtTimestamp.toNumber());
        warn("btn_raise:",timeStamp,useableTime);
        if(useableTime < timeStamp){
            this.label.string = "Capital Raise";
            this.button.interactable = true;
        }else{
            this.label.node.active = true;
            this.button.interactable = false;
            this.leftTime = useableTime - timeStamp;
            this.startTime = Number(raiseCountdown.coolDownStartedAtTimestamp.toNumber());
            this.endTime = Number(raiseCountdown.coolDownEndedAtTimestamp.toNumber());

            this.startCountDownAnimation();
        }
    }

    private _registerListeners(){
        const self = this;
        ponzi_controller.instance.on(ccc_msg.on_raisecolddown_update,async (update:any)=>{
            await self.updateUI();
        })
    }

    //seconds
    private leftTime:number;
    private endTime:number;
    private startTime:number;
    private timer;
    
    private startCountDownAnimation(){
        const self = this;
        // 计算重复次数，等于结束时间减一
        let repeat: number = this.endTime - 1;
        // 调用schedule方法，传入回调函数，间隔时间为1秒，重复次数为repeat，延迟时间为0
        this.unschedule(this.minuesTimeLabel);
        this.schedule(this.minuesTimeLabel, 1, repeat, 0);

        clearTimeout(this.timer);
        log("Start a timer within",this.leftTime);
        this.timer = setTimeout(async ()=>{
            await self.updateUI();
            self.unschedule(self.minuesTimeLabel);
        },this.leftTime*1000);
    }

    private minuesTimeLabel(){
        let nowTime: number = sys.now()/1000;
        let endTime: number = this.endTime;
        let startTime: number = this.startTime;
        this.label.string = time_utils.calculateRemainingTimeOnlyMinutes(nowTime, endTime, startTime, ponzi_config.fakeBlockTime);
    }
}

