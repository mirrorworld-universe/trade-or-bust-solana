import { Label, log } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { GameData } from '../../models/GameData';
import { time_utils } from '../../utils/time_utils';
import { sys } from 'cc';
import { ponzi_config } from '../../enums/ponzi_config';
import { component_state } from '../../enums/component_state';
import { ponzi_controller } from '../../ponzi-controller';
import { ccc_msg } from '../../enums/ccc_msg';
const { ccclass, property } = _decorator;

@ccclass('game_countdown')
export class game_countdown extends Component {
    @property({type:Label})
    private label:Label;

    start() {

    }

    update(deltaTime: number) {
        if(!this._inited) this.init();
    }

    private _inited:boolean = false;
    private init(){
        const gameObj:GameData = globalThis.ponzi.game;
        if(!gameObj) return;

        this._inited = true;
        this._updateUI();
        this._registerListeners();
    }

    private _registerListeners(){
        let self = this;
        ponzi_controller.instance.on(ccc_msg.on_gamestate_update,(obj)=>{
            // const {oldObj,newObj} = obj;
            self._updateUI();
        });
    }

    private _updateUI(){
        const gameState = globalThis.ponzi.gameState;
        if(gameState != component_state.game_ingame) return;

        this.unschedule(this._updateLabel);
        this.schedule(this._updateLabel);
    }

    private _updateLabel(){
        const gameObj:any = globalThis.ponzi.game;
        if(!gameObj) return;

        let startTime:number = Number(gameObj.gameStartedAtTimestamp.toNumber());
        let endTime:number = Number(gameObj.gameEndedAtTimestamp.toNumber());
        log("startTime:",startTime," endTime",endTime);
        let nowTime:number = sys.now()/1000;

        let str:string = time_utils.calculateRemainingTime(nowTime,endTime,startTime,ponzi_config.fakeBlockTime);
        this.label.string = str;
    }
}

