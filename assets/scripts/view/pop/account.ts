import { log } from 'cc';
import { sys } from 'cc';
import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { string_utils } from '../../utils/string_utils';
const { ccclass, property } = _decorator;

@ccclass('account')
export class account extends Component {
    @property({type:Label})
    private labelName:Label;

    start() {

    }

    update(deltaTime: number) {
        
    }

    public init(name:string){
        this.labelName.string = name;
    }

    public onLogoutClicked(){

    }

    public onExploreClicked(){
        let playerEntity = string_utils.removeLeadingZeros(globalThis.ponzi.currentPlayer);
        let urlPre = "https://solscan.io/account/" + globalThis.ponzi.currentPlayer;
        sys.openURL(urlPre);
    }
}

