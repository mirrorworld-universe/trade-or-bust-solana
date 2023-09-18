import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('pick_asset_item')
export class pick_asset_item extends Component {
    
    @property({type:Node})
    private chosenBoarder:Node;
    
    start() {

    }

    update(deltaTime: number) {
        
    }

    public chosen(isChosen:boolean){
        this.chosenBoarder.active = isChosen;
    }
}

