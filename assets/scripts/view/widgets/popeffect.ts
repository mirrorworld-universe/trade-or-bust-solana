import { Vec3 } from 'cc';
import { tween } from 'cc';
import { Vec2 } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('popeffect')
export class popeffect extends Component {
    @property({type:Node})
    private popupNode:Node;
    
    start() {

    }

    update(deltaTime: number) {
        
    }

    public show() {
        this.popupNode.scale = new Vec3(0.96,0.96,1);
        tween(this.popupNode)
            //.to(0.1,{scale:new Vec3(1.04,1.04,1)})
            .to(0.02,{scale:Vec3.ONE})
            .start();
    }

    public hide(){
        const self = this;
        this.popupNode.scale = new Vec3(1,1,1);
        tween(this.popupNode)
            //.to(0.1,{scale:new Vec3(1.04,1.04,1)})
            .to(0.02,{scale:new Vec3(0.94,0.94,1)})
            .call(() => { self.node.active = false; })
            .start();
    }
}

