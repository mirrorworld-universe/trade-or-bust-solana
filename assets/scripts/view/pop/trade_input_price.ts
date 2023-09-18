import { log } from 'cc';
import { EditBox } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { ccc_msg } from '../../enums/ccc_msg';
import { ponzi_controller } from '../../ponzi-controller';
import { temp_data } from '../data/temp_data';
const { ccclass, property } = _decorator;

@ccclass('trade_input_price')
export class trade_input_price extends Component {
    @property({type:EditBox})
    private editBox:EditBox;

    start() {

    }

    update(deltaTime: number) {
        
    }

    public onBtnCloseClicked(){
        this.node.active = false;
    }

    public async onConfirmClicked(){
        log("Confirm",this.editBox.textLabel.string);

        ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,true);
        try{
            let data = temp_data.instance.getTradeInfo();
            await window.trade?.(data[1],data[0],this.editBox.textLabel.string);
            ponzi_controller.instance.sendCCCMsg(ccc_msg.single_button_dialog,{content:"Trade has been sent, please wait.",btnText:"OK"});
            this.node.active = false;
        }catch{
            ponzi_controller.instance.sendCCCMsg(ccc_msg.single_button_dialog,{content:"Trade failed, conditions not met.",btnText:"OK"});
        }finally{
            ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,false);
        }
    }
}

