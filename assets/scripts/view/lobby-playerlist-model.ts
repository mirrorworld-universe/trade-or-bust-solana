import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('lobby_playerlist_model')
export class lobby_playerlist_model extends Component {
    @property({type:Label})
    private labelName:Label;

    start() {

    }

    update(deltaTime: number) {
        
    }

    public init(name:string){
        this.labelName.string = name;
    }
}

