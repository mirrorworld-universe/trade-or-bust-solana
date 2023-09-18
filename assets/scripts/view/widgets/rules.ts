import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('rules')
export class rules extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    public onCloseClicked(){
        this.node.active = false
    }
}

