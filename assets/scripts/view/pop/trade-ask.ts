import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { ponzi_controller } from '../../ponzi-controller';
import { ccc_msg } from '../../enums/ccc_msg';
import { string_utils } from '../../utils/string_utils';
const { ccclass, property } = _decorator;

@ccclass('trade_ask')
export class trade_ask extends Component {
    @property({type:Label})
    private labelLine1:Label;
    @property({type:Label})
    private labelLine2:Label;
    @property({type:Node})
    private iconParent:Node;

    start() {

    }

    update(deltaTime: number) {
        
    }

    public init(presenterName:string,offerMoney:number,assetNumber:number){
        for(let i=0;i<this.iconParent.children.length;i++){
            this.iconParent.children[i].active = i === assetNumber - 1;
        }
        
        this.labelLine1.string = "User "+ string_utils.sliceLastN(presenterName,6) +" wants to buy your "+this.getAssetName(assetNumber)+" for";
        this.labelLine2.string = "$"+offerMoney;
    }

    public async onBtnAcceptClicked(){
        ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,true);
        try{
            await window.acceptTrade?.();
        }catch{
            ponzi_controller.instance.sendCCCMsg(ccc_msg.single_button_dialog,{content:"Accept failed",btnText:"OK"});
        }finally{
            ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,false);
        }
        this.node.active = false;
    }

    public async onBtnRejectClicked(){
        ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,true);
        try{
            await window.rejectTrade?.();
        }catch{
            ponzi_controller.instance.sendCCCMsg(ccc_msg.single_button_dialog,{content:"Accept failed",btnText:"OK"});
        }finally{
            ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,false);
        }
        this.node.active = false;
    }


    private getAssetName(number:number){
        if(number === 1){
            return "GPU";
        }else if(number === 2){
            return "bitcoin";
        }else if(number === 3){
            return "battery";
        }else if(number === 4){
            return "leiter";
        }else if(number === 5){
            return "gold";
        }else if(number === 6){
            return "oil";
        }else{
            return "unknown asset";
        }
    }
}

