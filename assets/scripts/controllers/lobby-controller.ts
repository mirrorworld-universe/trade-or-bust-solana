import { game } from 'cc';
import { log } from 'cc';
import { sys } from 'cc';
import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { component_state } from '../enums/component_state';
import { ponzi_controller } from '../ponzi-controller';
import { GameData } from '../models/GameData';
import { ccc_msg } from '../enums/ccc_msg';
import { string_utils } from '../utils/string_utils';
import { warn } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('lobby_controller')
export class lobby_controller extends Component {
    @property({ type: Label })
    private countDownLabel:Label;

    @property({ type:Label })
    private contentLabel:Label;

    @property({type:Node})
    private btnJoinGame:Node;

    @property({type:Node})
    private btnTriggerGame:Node;

    @property({ type: Label })
    private welcomeLabel:Label;

    @property({type:Node})
    private lobbyNode:Node;

    @property({type:Node})
    private gameNode:Node;

    private IsPlayerButGameNotStart:string = "The Round Has Not Started Yet";
    private NotPlayerButGameIsStart:string = "Game is started, just waiting for entering game!";
    private IsPlayerGameReachTimeButNotStart:string = "The Game Has Already Started, Please Click \"Play\" To Begin.";
    private NotPlayerAndGameNotReachTime:string = "Game is not start, just join us!";

    start() {

    }

    async update(deltaTime: number) {
        if(!this.inited) await this.initLobby();
        if(!this.welcomeInited) await this.initWelcome();
    }

    public onRulesClicked(){
        ponzi_controller.instance.sendCCCMsg(ccc_msg.show_rules,true);
    }

    public async onJoinGameClicked(){
        ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,true);
        await window.solanaJoinGame?.();
        ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,false);
    }

    public async onTriggerGameClicked(){
        await this.triggerGame();
    }

    private welcomeInited:boolean = false;
    private async initWelcome(){
        const playerEntity = globalThis.ponzi.currentPlayer;
        if(!playerEntity) return;

        this.welcomeInited = true;
        let hash = string_utils.getHashFromSymbol(playerEntity);
        this.welcomeLabel.string = "Welcome, " + string_utils.sliceLastN(hash,8) + "!";
    }

    private inited:boolean = false;
    private async initLobby(){
        const gameObj:GameData = globalThis.ponzi.game;
        if(gameObj){
            const gameState = globalThis.ponzi.gameState;
            this.inited = true;
            this.updateLobby();
            this.registerListeners();
        }
    }

    private async triggerGame(){
        ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,true);
        await window.askStart?.();
        ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,false);
    }

    private timer = null;
    private async startCountdownAnimator(leftSeconds:number){
        const self = this;
        this.startCountDownAnimation(leftSeconds);
        clearTimeout(this.timer);
        log("start timer:",leftSeconds * 1000);
        this.timer = setTimeout(async ()=>{
            self.updateLobby();
        }, leftSeconds * 1000);
    }

    private async updateLobby(){
        const gameState = globalThis.ponzi.gameState;
        const gameObj:GameData = globalThis.ponzi.game;
        if(!gameObj){
            warn("No game obj when update lobby");
            return;
        }

        let isPlayer:boolean = false;
        try{
            // const playerEntity = globalThis.ponzi.currentPlayer;
            isPlayer = await window.solanaIsJoined?.();
        }catch{
            isPlayer = false;
        }

        if(gameState == component_state.game_ingame){
            if(isPlayer){
                log("ingame+isPlayer");
                this.showGameNode();
                this.btnJoinGame.active = false;
                this.btnTriggerGame.active = false;
            }else{
                this.showLobbyNode();
                log("ingame+notPlayer");
                this.contentLabel.string = this.NotPlayerButGameIsStart;
                this.btnJoinGame.active = true;
                this.btnTriggerGame.active = false;
            }
        }else if(gameState == component_state.game_waiting){
            this.showLobbyNode();

            let timeStamp:number = sys.now();
            timeStamp = Number(timeStamp)/1000;
            let gameStartTime:number = Number(gameObj.startTime);
            let leftSeconds = Math.floor(gameStartTime - timeStamp);

            if(isPlayer){
                this.contentLabel.string = "Game is started, just enter game!";
                this.btnJoinGame.active = false;
                this.btnTriggerGame.active = false;

                let timeStamp:number = sys.now();
                timeStamp = Number(timeStamp)/1000;
                let gameStartTime:number = Number(gameObj.startTime);
                let leftSeconds = Math.floor(gameStartTime - timeStamp);
                if(leftSeconds > 0){
                    log("gameWaiting+isPlayer+notStart");
                    this.contentLabel.string = this.IsPlayerButGameNotStart;
                    this.startCountdownAnimator(leftSeconds);
                }else{
                    log("gameWaiting+isPlayer+isStarted");
                    this.contentLabel.string = this.IsPlayerGameReachTimeButNotStart;
                    this.btnJoinGame.active = false;
                    this.btnTriggerGame.active = true;
                }
            }else{
                log("gameWaiting+notPlayer");
                if(leftSeconds > 0){
                    this.startCountdownAnimator(leftSeconds);
                }
                
                this.contentLabel.string = this.NotPlayerAndGameNotReachTime;
                this.btnJoinGame.active = true;
                this.btnTriggerGame.active = false;
            }
        }
    }

    private registerListeners(){
        const self = this;
        ponzi_controller.instance.on(ccc_msg.on_game_update,async (obj)=>{
            self.updateLobby();
        });
        ponzi_controller.instance.on(ccc_msg.on_gamestate_update,async (obj)=>{
            self.updateLobby();
        });
        ponzi_controller.instance.on(ccc_msg.on_isplayer_update,async (obj)=>{
            let entity = obj.entity;
            let newValue = obj.newValue;
            const playerEntity = globalThis.ponzi.currentPlayer;
            let hash = string_utils.getHashFromSymbol(playerEntity);
            if(hash == entity){
                self.updateLobby();
            }
        })
    }

    private showGameNode(){
        this.lobbyNode.active = false;
        this.gameNode.active = true;
    }

    private showLobbyNode(){
        this.lobbyNode.active = true;
        this.gameNode.active = false;
        // this.btnJoinGame = true;
    }

    private leftTime:number;
    private startCountDownAnimation(endTime){
        this.leftTime = endTime;
        this.countDownLabel.string = this.leftTime.toString();

        const self = this;
        // 计算重复次数，等于结束时间减一
        let repeat: number = endTime - 1;
        // 调用schedule方法，传入回调函数，间隔时间为1秒，重复次数为repeat，延迟时间为0
        this.unschedule(this.minuesTimeLabel);
        this.schedule(this.minuesTimeLabel, 1, repeat, 0);
    }

    private minuesTimeLabel(){
        this.leftTime --;
        this.countDownLabel.string = this.formatSeconds(this.leftTime);
    }
    // 定义一个函数，接受一个秒数作为参数，返回一个字符串表示转换后的结果
    private formatSeconds(seconds: number): string {
        let dayStr = " Day ";
        let hourStr = " Hour ";
        let minuteStr = " Minute ";
        let secondStr = " Second ";
        // 定义一个空字符串，用于存储结果
        let result = "";
        // 定义一天、一小时、一分钟的秒数
        const day = 24 * 60 * 60;
        const hour = 60 * 60;
        const minute = 60;
        // 计算天数，并添加到结果中，如果为零，则不显示
        let days = Math.floor(seconds / day);
        if (days > 0) {
        result += days + dayStr;
        }
        // 计算小时数，并添加到结果中，如果为零，则不显示
        let hours = Math.floor((seconds % day) / hour);
        if (hours > 0) {
        result += hours + hourStr;
        }
        // 计算分钟数，并添加到结果中，如果为零，则不显示
        let minutes = Math.floor((seconds % hour) / minute);
        if (minutes > 0) {
        result += minutes + minuteStr;
        }
        // 计算秒数，并添加到结果中，如果为零，则不显示
        let showSeconds = Math.floor(seconds % minute);
        if (showSeconds > 0) {
        result += showSeconds + secondStr;
        }
        // 返回结果字符串
        return result;
    }
  
}

