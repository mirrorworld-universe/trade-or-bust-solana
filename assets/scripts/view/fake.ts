import { Vec3 } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { tween } from 'cc';
import { account } from './pop/account';
import { string_utils } from '../utils/string_utils';
const { ccclass, property } = _decorator;

@ccclass('fake')
export class fake extends Component {
    @property({type:Node}) 
    private fakeWindowParent:Node;

    start() {

    }

    update(deltaTime: number) {
        
    }

    public hideAllWidnows(){
        let children:Node[] = this.fakeWindowParent.children;
        children.forEach((ele:Node)=>{
            ele.active = false;
        });
    }

    public onCloseClicked(){
        this.hideWindow();
    }

    public showFakeWindow(targetButton:Node,windowIdx:number){
        this.node.active = true;

        let targetWorldPos:Vec3 = targetButton.worldPosition;

        let children:Node[] = this.fakeWindowParent.children;
        children.forEach((ele:Node)=>{
            ele.active = false;
        });
        let window:Node = children[windowIdx];
        window.worldPosition = new Vec3(targetWorldPos.x + 30,targetWorldPos.y - 40, 0);

        children.forEach((ele:Node)=>{
            ele.active = ele === window;
        })

        this.showWindow(window);

        if(windowIdx == 0){
            let script:account = window.getComponent(account);
            let playerEntity = globalThis.ponzi.currentPlayer;
            script.init(string_utils.truncateString(playerEntity));
        }
    }

    private _currentWindow:Node = null;
    private showWindow(node:Node){
        this._currentWindow = node;

        this._currentWindow.scale = new Vec3(0.96,0.96,1);
        tween(this._currentWindow)
            .to(0.02,{scale:Vec3.ONE})
            .start();
    }

    private hideWindow(){
        const self = this;
        this._currentWindow.scale = new Vec3(1,1,1);
        tween(this._currentWindow)
            .to(0.02,{scale:new Vec3(0.94,0.94,1)})
            .call(() => { self.node.active = false; })
            .start();
    }
}

