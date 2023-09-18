import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { toggle } from './toggle';
import { trade_asset_item } from './trade-asset-item';
import { item_asset } from './item_asset';
const { ccclass, property } = _decorator;

@ccclass('trade_parter_item')
export class trade_parter_item extends Component {
    @property({type:Label})
    private labelName:Label;
    @property({type:Node})
    private assetParent:Node;
    @property({type:toggle})
    private toggle:toggle;
    
    start() {

    }

    update(deltaTime: number) {
        
    }

    public setSelected(isSelected:boolean){
        this.toggle.setSelected(isSelected);
    }

    public entity;

    public init(name,c1,c2,c3,c4,c5,c6){
        this.labelName.string = name;
        this.setAssetCountByIndex(0,c1);
        this.setAssetCountByIndex(1,c2);
        this.setAssetCountByIndex(2,c3);
        this.setAssetCountByIndex(3,c4);
        this.setAssetCountByIndex(4,c5);
        this.setAssetCountByIndex(5,c6);
    }

    private setAssetCountByIndex(index:number,count:number){
        let children:Node[] = this.assetParent.children;
        
        let script:item_asset = children[index].getComponent(item_asset);
        script.label.string = count.toString();
    }
}

