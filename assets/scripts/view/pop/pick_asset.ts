import { _decorator, Component, Node } from 'cc';
import { ponzi_controller } from '../../ponzi-controller';
import { ccc_msg } from '../../enums/ccc_msg';
import { pick_asset_item } from '../widgets/pick_asset_item';
import { log } from 'cc';
import { warn } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('pick_asset')
export class pick_asset extends Component {
    @property({type:Node})
    private itemParent:Node;

    private pickAsset:number = 0;
    
    start() {
        this.reset();
    }

    update(deltaTime: number) {
        
    }

    public reset(){
        this.pickAsset = 0;
        let children:Node[] = this.itemParent.children;
        children.forEach((node:Node)=>{
            let script:pick_asset_item = node.getComponent(pick_asset_item);
            script.chosen(false);
        });
    }

    public onCloseClicked(){
        this.node.active = false;
    }

    public onItemClicked(event:Event){
        let clickNode:Node = event.target;
        let children:Node[] = this.itemParent.children;
        let index = children.indexOf(clickNode);
        children.forEach((node:Node)=>{
            let script:pick_asset_item = node.getComponent(pick_asset_item);
            script.chosen(node === clickNode);
        });

        let assetNumber = index + 1;
        this.pickAsset = assetNumber;
    }

    public async onPickClicked(){
        warn("User wants to pick ",this.pickAsset);
        if(this.pickAsset == 0){
            ponzi_controller.instance.sendCCCMsg(ccc_msg.single_button_dialog,{content:"Please choose an asset first!",btnText:"OK"});
            return;
        }

        ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,true);
        try{
            await window.solanaPickAsset(this.pickAsset);
            await this.delay(4000);
            let assetsList = null;
            let allPlayers = globalThis.ponzi.players;
            for(let i=0;i<allPlayers.length;i++){
                let p = allPlayers[i];
                if(p.player.toBase58() == globalThis.ponzi.currentPlayer){
                    assetsList = {
                        gpu:p.gpu,
                        bitcoin:p.bitcoin,
                        battery:p.battery,
                        leiter:p.leiter,
                        gold:p.gold,
                        oil:p.oil,
                    };
                    break;
                }
            }
            
            if(!assetsList){
                log("Can not find AssetsList on entity");
                let aaa = null;
                aaa.aaa = 1;
            }else{
                ponzi_controller.instance.sendCCCMsg(ccc_msg.on_assetslist_update,{entity:globalThis.ponzi.currentPlayer});
            }
        }catch{
            ponzi_controller.instance.sendCCCMsg(ccc_msg.single_button_dialog,{content:"pick failed",btnText:"OK"});
        }finally{
            ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,false);
            this.node.active = false;
            ponzi_controller.instance.sendCCCMsg(ccc_msg.show_pick_fund,true);
        }
    }

     delay(ms: number): Promise<void> {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
}

