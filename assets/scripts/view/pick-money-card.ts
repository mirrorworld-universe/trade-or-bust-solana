import { _decorator, Component, Node } from 'cc';
import { fond_card } from './widgets/fond_card';
import { ponzi_controller } from '../ponzi-controller';
import { ccc_msg } from '../enums/ccc_msg';
import { log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('pick_money_card')
export class pick_money_card extends Component {

    @property({type:Node})
    private cardParent:Node;

    start() {
        let children:Node[] = this.cardParent.children;
        children.forEach((ele:Node)=>{
            let script:fond_card = ele.getComponent(fond_card);
            script.setChosen(false);
        });
    }

    update(deltaTime: number) {
        
    }

    public onItemClicked(event:Event){
        let itemNode:Node = event.target.parent;
        log("click item:",itemNode.name);
        let children:Node[] = this.cardParent.children;
        children.forEach((ele:Node)=>{
            let script:fond_card = ele.getComponent(fond_card);
            script.setChosen(ele == itemNode);
        });
    }

    public async onButtonClicked(){
        ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,true);
        await window.pickFund?.();
        ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,false);
        this.node.active = false;
    }
}

