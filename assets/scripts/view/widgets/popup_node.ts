import { Vec3 } from "cc";
import { tween } from "cc";
import { Component } from "cc";
import { _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass('popup_node')
export class popup_node extends Component {

    @property({type:Node})
    private popupNode: Node;

    start() {
        
    }

    public show() {
        // const duration = 0.3; // 动画持续时间

        // 创建并配置缩放动画
        // const scaleAnim = tween(this.popupNode)
        //     .to(duration, { scale: 1 }, { easing: 'backOut' })
        //     .start();

        // // 创建并配置淡入动画
        // const fadeInAnim = tween(this.popupNode)
        //     .to(duration, { opacity: 255 })
        //     .start();
        this.popupNode.setScale(0.9);
        tween(this.popupNode).
            to(0.2,{scale:new Vec3(1.1,1.1,1)})
            .to(0.1,{scale:Vec3.ONE})
            .start();
    }
}
