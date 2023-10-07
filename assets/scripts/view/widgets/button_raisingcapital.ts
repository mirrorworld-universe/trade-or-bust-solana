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

        let player = null;
        try{
            player = await window.solanaQueryPlayers?.([solana_bridge.instance.current_player]);
        }catch{
            log("Can not find RaiseColddown component on entity");
        }
        if(!player) return;

        this._inited = true;
        await this.updateUI();
        this._registerListeners();
    }

    private async updateUI(){
        const playerEntity = globalThis.ponzi.currentPlayer;
        let raiseCountdown = null;
        try{
            raiseCountdown = await window.solanaQueryPlayers?.([solana_bridge.instance.current_player]);
        }catch{
            log("Can not get raisecolddown component on entity");
        }
        if(!raiseCountdown) return;
        
        let timeStamp:number = sys.now()/1000;
        let useableTime:number = Number(raiseCountdown.end);
        warn("btn_raise:",timeStamp,useableTime);
        if(useableTime < timeStamp){
            this.label.string = "Capital Raise";
            this.button.interactable = true;
        }else{
            this.label.node.active = true;
            this.button.interactable = false;
            this.leftTime = useableTime - timeStamp;
            this.startTime = Number(raiseCountdown.start);
            this.endTime = Number(raiseCountdown.end);

            this.startCountDownAnimation();
        }
    }

    private _registerListeners(){
        const self = this;
        ponzi_controller.instance.on(ccc_msg.on_raisecolddown_update,(update:any)=>{
            self.updateUI();
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
        this.timer = setTimeout(()=>{
            self.updateUI();
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

