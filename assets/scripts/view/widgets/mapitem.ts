import { Tween } from 'cc';
import { tween } from 'cc';
import { v2 } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('mapitem')
export class mapitem extends Component {

    @property({type:Node})
    private lightNode:Node;
    @property({type:Node})
    private darkNode:Node;

    start() {

    }

    update(deltaTime: number) {
        
    }

    public init(showLight:boolean){
        this.lightNode.active = showLight;
        this.darkNode.active = !showLight;
    }

    public coinJumpAndFly(coin, target, callback) {
        // 获取金币的初始坐标
        let origin = coin.position;
        
        // 设置金币的动画序列，包括跳起、飞向、缩小、消失四个步骤
        tween(coin).sequence(
            // 跳起：让金币在0.5秒内向上移动100像素，并旋转180度
            tween().by(0.5, {position: v2(0, 100), angle: 180}),
            // 飞向：让金币在1秒内飞向目标坐标，并旋转360度
            tween().to(1, {position: target, angle: 360}),
            // 缩小：让金币在0.5秒内缩小到原来的一半
            tween().to(0.5, {scale: 0.5}),
            // 消失：让金币在0.5秒内透明度降为0，并恢复初始状态
            tween().to(0.5, {opacity: 0}).call(() => {
                // 恢复金币的初始位置、大小、角度和透明度
                coin.position = origin;
                coin.scale = 1;
                coin.angle = 0;
                coin.opacity = 255;
            }),
            tween.call(callback)
        ).start();
    }
}

