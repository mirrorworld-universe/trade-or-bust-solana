import { _decorator, Component, error, find, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('solana_bridge')
export class solana_bridge  extends Component{

    private game:any = {};
    private GameState:any = {};
    private GameMap:any = {};
    private players:Map<string,any> = new Map<string,any>();
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
    public queryFromChain(table_name:string,id:string | string[]){
        if (typeof id === 'string') {
            //Query one component's info which is attached to 'id'
        } else if (Array.isArray(id)) {
            //Query multiple components' info
        }else{
            throw new error("Unexception param:id->",id);
        }
    }
    
    private _pharse:number = 0;
    private _queryInterval:number = 3;
    Update(dt:number){
        //update all components per unit time
        this._pharse += dt;
        if(this._pharse >= this._queryInterval){
            this._pharse = 0;
            this.queryAll();
        }
    }

    private queryAll(){
        this.queryFromChain("Game","gameidxxx");
        this.queryFromChain("Player","player_id_xxx1");
        this.queryFromChain("Player","player_id_xxx2");
        this.queryFromChain("Player","player_id_xxx3");
        this.queryFromChain("IsPlayer","player_id_xxx1");
        this.queryFromChain("IsPlayer","player_id_xxx2");
        this.queryFromChain("IsPlayer","player_id_xxx3");
        //todo:...
    }
    
    public move_player(game_id:string, player_id:string, x:number, y:number){
        //todo: send move to chain
        //todo: query Player of player_id
    }

    public accept_trade(game_id:string, player_id:string, trade_id:string){
        //todo: send accept_trade to chain
        //todo: query PassiveTransaction of player_id
        //todo: query TradeList of player_id
    }

    public cancel_trade(){
        //Have no idea
    }

    public create_trade(game_id:string, player_id:string, target_player:string, money:number, asset_id:number){
        //todo: send create_trade to chain
        //todo: query TradeList of player_id
    }

    public initialize_game_config(game_id:string){
        //have no idea how to use this function
    }

    public join_game(game_id:string, player_id:string){
        //todo: send join_game
        //todo: query IsPlayer of player_id
    }

    public pick_asset(game_id:string, player_id:string, asset_id:string){
        //todo: send pick
        //todo: query cold down
        //todo: query AssetList of player_id
    }

    public pick_fund(game_id:string, player_id:string, fund_id:string){
        //todo: send pick
        //todo: query Player of player_id
    }

    public reject_trade(){
        //todo: send reject_trade
        //todo: query TradeList of player_id
    }
}

