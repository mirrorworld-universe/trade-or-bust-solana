import { _decorator, Component, error, find, log, Node } from 'cc';
import { Connection, TransactionMessage, VersionedTransaction, SystemProgram, Transaction, clusterApiUrl } from "@solana/web3.js";
import { component_state } from './enums/component_state';
import { ponzi_controller } from './ponzi-controller';
import { ccc_msg } from './enums/ccc_msg';
import { RoleLocalObj } from './view/data/RoleLocalObj';
// import { aaa } from "./aaa";
const { ccclass, property } = _decorator;



@ccclass('solana_bridge')
export class solana_bridge  extends Component{

    //Get from url
    private game_id:string;
    public current_player:string;
    private players:string[];

    private game:any = {};
    private GameState:any = {};
    private GameMap:any = {};
    // private players:Map<string,any> = new Map<string,any>();
    private isPlayers:Map<string,any> = new Map<string,any>();
    private MapItems:Map<string,any> = new Map<string,any>();
    private TransactionLists:Map<string,any> = new Map<string,any>();
    private AssetsLists:Map<string,any> = new Map<string,any>();
    private RaiseColddowns:Map<string,any> = new Map<string,any>();
    private PassiveTransactions:Map<string,any> = new Map<string,any>();
    private TradeLists:Map<string,any> = new Map<string,any>();
    private PlayerGameResults:Map<string,any> = new Map<string,any>();

    private static _instance: solana_bridge;
    public static get instance(): solana_bridge {
        if (!solana_bridge._instance) {
            solana_bridge._instance = find("solana-bridge").getComponent(solana_bridge);
        }
        return solana_bridge._instance;
    }

    //Query from chain directely, not backend
    public queryFromChain(id:string[]){
        if (typeof id === 'string') {
            //Query one component's info which is attached to 'id'
        } else if (Array.isArray(id)) {
            //Query multiple components' info
        }else{
            throw new error("Unexception param:id->",id);
        }
    }

    async onLoad() {
        //Use 0:00 of today as game_id
        this.game_id = this.getParameterFromURL("gameid") || this.getTodayStartTimestamp().toString();
        this.current_player = this.getParameterFromURL("id");
        // this.players = [];
        // for(let i=1;i<11;i++){
        //     this.players.push(this.game_id + i);
        // }
        log("game_id:",this.game_id," current player:",this.current_player);

        //InitSDK
        log("start init sdk");
        await window?.initSDK(this.game_id, this.current_player);

        //update GameData
        this.updateGame();
    }

    public async updateGame(){
        log("start query game");
        let gameInfo;
        try {
            gameInfo = await window?.queryGame();
            log(" query game success");
            globalThis.ponzi.game = gameInfo;
            globalThis.ponzi.game_update?.(null, gameInfo);
            //Update gameState
            globalThis.ponzi.gameState = component_state.game_ingame;
            globalThis.ponzi.gamestate_update?.(null, component_state.game_ingame);

            await solana_bridge.instance.updateGameMap();
            
        } catch (error) {
            log(" query game failed",error);
            globalThis.ponzi.game = 1;
            //Update gameState
            globalThis.ponzi.gameState = component_state.game_waiting;
            globalThis.ponzi.gamestate_update?.(null, component_state.game_waiting);
        }
    }

    public async updateGameMap(){
        if(globalThis.ponzi.gameMap){
            log("GameMap is already seted");
            return;
        }

        globalThis.ponzi.gameMap = {
            width:20,
            height:20,
            mapArray:[]
        }
    }

    public async updatePlayers(){
        //Query all players
        log("start query all players' info");
        let playerIds = [1,2];
        let playersData = await window?.solanaQueryPlayers(playerIds);
        log("finish query all players' info:",playersData);
        await this.delay(4000);
        log("wait 4 seconds");

        globalThis.ponzi.players = playersData;
    }
     delay(ms: number): Promise<void> {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
    private _pharse:number = 0;
    private _queryInterval:number = 3;
    update(dt:number){
        if(!this.inited) {
            this.init();
            return;
        }
        //update all components per unit time
        this._pharse += dt;
        if(this._pharse >= this._queryInterval){
            this._pharse = 0;
            this.queryAll();
        }
    }

    public inited:boolean = false;
    private async init(){
        if(this.inited) return;

        if(this.game_id && this.current_player && this.players && this.players.length > 0){
            log("Game inited, game_id:",this.game_id,";current_player:",this.current_player,";player count:",this.players.length);
            this.inited = true;
        }
    }

    private queryAll(){
        this.queryFromChain([this.game_id]);
        this.queryFromChain(["player_id_xxx4","player_id_xxx5","player_id_xxx6"]);
        this.queryFromChain(["player_id_xxx1","player_id_xxx2","player_id_xxx3"]);
        //todo:...
    }

    public queryPlayer(playerKey:string){
        if(!globalThis.ponzi.players){
            console.error("game not inited!");
            return null;
        }
        let array = {};
        for (let key in globalThis.ponzi.players) {
            let map = globalThis.ponzi.players[key];
            let hash = map.player;

            if(playerKey == hash) return map;
        }
    }
    
    public async move_player(x:number, y:number){
        await window.solanaMovePlayer(x,y);
        await this.updatePlayerObj();
    }

    public async updatePlayerObj(){
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
        let old = array[globalThis.ponzi.currentPlayer]
        let oldObj = {x:old.row,y:old.col,money:old.money}
        await this.updatePlayers();


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
        let newa = array[globalThis.ponzi.currentPlayer]
        let newObj = {x:newa.row,y:newa.col,money:newa.money};

        ponzi_controller.instance.sendCCCMsg(ccc_msg.on_player_update,
            {entity:globalThis.ponzi.currentPlayer,oldObj,newObj});
    }

    public accept_trade(player_id:string, trade_id:string){
        //todo: send accept_trade to chain
        //todo: query PassiveTransaction of player_id
        //todo: query TradeList of player_id
    }

    public cancel_trade(){
        //Have no idea
    }

    public create_trade(player_id:string, target_player:string, money:number, asset_id:number){
        //todo: send create_trade to chain
        //todo: query TradeList of player_id
    }

    public initialize_game_config(game_id:string){
        //have no idea how to use this function
    }

    public join_game(player_id:string){
        //todo: send join_game
        //todo: query IsPlayer of player_id
    }

    public pick_asset(player_id:string, asset_id:string){
        //todo: send pick
        //todo: query cold down
        //todo: query AssetList of player_id
    }

    public pick_fund(player_id:string, fund_id:string){
        //todo: send pick
        //todo: query Player of player_id
    }

    public reject_trade(){
        //todo: send reject_trade
        //todo: query TradeList of player_id
    }


    //Convert big data object to components which like mud
    private divideToComponent(){

    }

    private getTodayStartTimestamp() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const timestamp = today.getTime();
      
        return timestamp;
    }

    private getParameterFromURL(parameterName: string): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parameterName);
    }
}

