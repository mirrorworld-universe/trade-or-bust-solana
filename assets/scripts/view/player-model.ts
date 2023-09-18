import { _decorator, Component, Node } from 'cc';
import { string_utils } from '../utils/string_utils';
const { ccclass, property } = _decorator;

@ccclass('player_model')
export class player_model extends Component {

    @property({type:Node})
    private sprite:Node;

    @property({type:Node})
    private spriteEnemy:Node;

    //Hash
    private playerHash:string;

    start() {
        
    }

    update(deltaTime: number) {
        
    }


    public init(hash:string){
        this.playerHash = hash;
        let curPlayerEntity = globalThis.ponzi.currentPlayer;
        if(hash == string_utils.getHashFromSymbol(curPlayerEntity)){
            this.sprite.active = true;
            this.spriteEnemy.active = false;
        }else{
            this.sprite.active = false;
            this.spriteEnemy.active = true;
        }
    }
}

