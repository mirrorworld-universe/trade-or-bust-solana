import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('item_asset')
export class item_asset extends Component {
    @property({type:Label})
    public label:Label;

    start() {

    }

    update(deltaTime: number) {
        
    }
}

