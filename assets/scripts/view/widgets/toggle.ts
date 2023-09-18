import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('toggle')
export class toggle extends Component {
    @property({type:Node})
    private normal:Node;
    @property({type:Node})
    private select:Node;

    start() {

    }

    update(deltaTime: number) {
        
    }

    public setSelected(isSelected:boolean){
        this.normal.active = !isSelected;
        this.select.active = isSelected;
    }
}

