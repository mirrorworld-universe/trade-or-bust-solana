import { Label } from 'cc';
import { find } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { ponzi_controller } from './ponzi-controller';
import { log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('counter_label')
export class counter_label extends Component {
    start() {
        
    }

    private inited:boolean = false;
    init(){
        if(globalThis.ponzi?.counter){
            this.inited = true;
            const label:Label = this.node.getComponent(Label);
            label.string = "New count is:" + globalThis.ponzi.counter.value;

            const self = this;
        ponzi_controller.instance.on("ccc_counter_value", function (msg) {
            const label:Label = self.node.getComponent(Label);
            label.string = "New count is:" + msg;
          });
        }else{
            log("counter is not prepared!");
        }
    }

    update(deltaTime: number) {
        if(!this.inited) this.init();
    }

    public onBtnAddClicked(){
        console.log("onBtnAddClicked clicked!");
        window.increment?.();
    }
    public onBtnAddRoomClicked(){
        console.log("onBtnAddRoomClicked clicked!");
        window.createRoom?.();
    }
}

