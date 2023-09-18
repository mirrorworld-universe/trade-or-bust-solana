import { _decorator, Component, Node } from 'cc';
import { ponzi_config } from '../enums/ponzi_config';
import { ponzi_controller } from '../ponzi-controller';
import { ccc_msg } from '../enums/ccc_msg';
import { single_button_pop } from './pop/single-button-pop';
import { warn } from 'cc';
import { fake } from './fake';
import { sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('game_ui_controller')
export class game_ui_controller extends Component {
    @property({type:fake})
    private fakeMgr:fake;

    start() {
        this.fakeMgr.node.active = false;
    }

    update(deltaTime: number) {
        
    }

    public onRuleClicked(){
        let url = "https://www.notion.so/mirrorworldfun/Trade-or-Bust-Rules-953378b93b8f4d73b586d44e678bd9d8";
        sys.openURL(url);
        // ponzi_controller.instance.sendCCCMsg(ccc_msg.show_rules,true);
    }

    public onCovertTradeClicked(){
        ponzi_controller.instance.sendCCCMsg(ccc_msg.show_trade,true);
    }

    public async onGameFinishClicked(){
        ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,true);
        try{
            await window.finishGame?.();
        }catch{
            ponzi_controller.instance.sendCCCMsg(ccc_msg.single_button_dialog,{content:"The end game encountered a problem.",btnText:"OK"});
        }finally{
            ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,false);
        }
    }

    public onTitleIconsClicked(event:Event){
        let button:Node = event.target;
        let name:string = button.name;
        if(name == "account"){
            this.fakeMgr.showFakeWindow(button,0);
        }else if(name == "partners"){
            this.fakeMgr.showFakeWindow(button,4);
        }else if(name == "repay"){
            this.fakeMgr.showFakeWindow(button,3);
        }else if(name == "fund"){
            this.fakeMgr.showFakeWindow(button,2);
        }else if(name == "assets"){
            this.fakeMgr.showFakeWindow(button,1);
        }else{
            warn("Unknown title button name:",name);
        }
    }
}

