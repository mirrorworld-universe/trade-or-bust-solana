import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('trade_asset_item')
export class trade_asset_item extends Component {
    @property({type:Node})
    private normalImage:Node;
    @property({type:Node})
    private selectedImage:Node;

    start() {

    }

    update(deltaTime: number) {
        
    }

    public setSelected(isSelected:boolean){
        this.normalImage.active = !isSelected;
        this.selectedImage.active = isSelected;
    }
}

