import { _decorator, Component, error, find, log, Node } from 'cc';
// 引入Phantom钱包的JavaScript库
import { PhantomWallet } from '@solana/wallet-adapter-phantom';
const { ccclass, property } = _decorator;

@ccclass('solana_bridge')
export class solana_bridge  extends Component{

    //Get from url
    private game_id:string;
    private current_player:string;
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
            solana_bridge._instance = find("solana_bridge").getComponent(solana_bridge);
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

    async start() {
        //Use 0:00 of today as game_id
        this.game_id = this.getTodayStartTimestamp().toString();
        this.current_player = this.game_id + this.getParameterFromURL("id");
        this.players = [];
        for(let i=1;i<11;i++){
            this.players.push(this.game_id + i);
        }
        // 创建Phantom钱包实例
        const wallet = new PhantomWallet();

        // 连接到钱包
        await wallet.connect();

        // 获取钱包地址
        const address = wallet.publicKey.toBase58();
        console.log('钱包地址:', address);

        // 获取各种密钥
        const publicKey = wallet.publicKey;
        const privateKey = wallet.signer.secretKey;
        const seed = wallet.signer.seed;
        console.log('公钥:', publicKey);
        console.log('私钥:', privateKey);
        console.log('种子:', seed);
    }
    
    private _pharse:number = 0;
    private _queryInterval:number = 3;
    update(dt:number){
        if(!this._inited) {
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

    private _inited:boolean = false;
    private async init(){
        if(this._inited) return;

        if(this.game_id && this.current_player && this.players && this.players.length > 0){
            log("Game inited, game_id:",this.game_id,";current_player:",this.current_player,";player count:",this.players.length);
            this._inited = true;
        }
    }

    private queryAll(){
        this.queryFromChain([this.game_id]);
        this.queryFromChain(["player_id_xxx4","player_id_xxx5","player_id_xxx6"]);
        this.queryFromChain(["player_id_xxx1","player_id_xxx2","player_id_xxx3"]);
        //todo:...
    }
    
    public move_player(player_id:string, x:number, y:number){
        //todo: send move to chain
        //todo: query Player of player_id
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
