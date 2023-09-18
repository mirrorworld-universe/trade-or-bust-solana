import { _decorator, Component, Node } from 'cc';
import { NONE } from '../../../@types/packages/scene/@types/cce/3d/manager/physics-2d/marching-squares';
import { trade_asset_item } from './widgets/trade-asset-item';
import { warn } from 'cc';
import { ponzi_controller } from '../ponzi-controller';
import { ccc_msg } from '../enums/ccc_msg';
import { log } from 'cc';
import { instantiate } from 'cc';
import { trade_parter_item } from './widgets/trade_parter_item';
import { string_utils } from '../utils/string_utils';
import { Vec3 } from 'cc';
import { item_asset } from './widgets/item_asset';
import { temp_data } from './data/temp_data';
import { popeffect } from './widgets/popeffect';
const { ccclass, property } = _decorator;

@ccclass('trade')
export class trade extends Component {
    @property({type:Node})
    private assetsParent:Node;
    @property({type:Node})
    private partnerParent:Node;
    @property({type:Node})
    private tradeItemModel:Node;


    private assetIndex:number = -1;
    private partnerEntity;


    start() {
        this.tradeItemModel.active = false;
    }

    update(deltaTime: number) {
        if(!this._inited) this.init();
    }

    public onCloseClicked(){
        this.hide();
    }

    public show(){
        this.node.active = true;
        let script:popeffect = this.node.getComponent(popeffect);
        if(script) {
            script.show();
        }
    }

    public hide(){
        let script:popeffect = this.node.getComponent(popeffect);
        if(script) {
            script.hide();
        }else{
            this.node.active = false;
        }
    }

    public reset(){
        this._inited = false;
        this.partnerEntity = null;
        this.assetIndex = -1;

        this._resetAssets();
    }

    public async onTradeClicked(){
        if(this.assetIndex === -1){
            ponzi_controller.instance.sendCCCMsg(ccc_msg.single_button_dialog,{content:"Please choose an asset first.",btnText:"OK"});
            return;
        }

        if(!this.partnerEntity){
            ponzi_controller.instance.sendCCCMsg(ccc_msg.single_button_dialog,{content:"Please choose an trade partner first.",btnText:"OK"});
            return;
        }

        temp_data.instance.setTradeInfo(this.assetIndex,this.partnerEntity);
        this.node.active = false;
        this.reset();
        ponzi_controller.instance.sendCCCMsg(ccc_msg.show_trade_input,null);
    }

    public onAssetItemClicked(event:Event){
        let node:Node = event.target;
        let children:Node[] = this.assetsParent.children;
        children.forEach((ele:Node)=>{
            let script:trade_asset_item = ele.getComponent(trade_asset_item);
            script.setSelected(node === ele);
            if(node === ele){
                this.assetIndex = children.indexOf(node) + 1;
            }
        });
    }

    public onParterBoxClicked(event:Event){
        let node:Node = event.target.parent;
        let children:Node[] = this.partnerParent.children;
        children.forEach((ele:Node)=>{
            let script:trade_parter_item = ele.getComponent(trade_parter_item);
            script.setSelected(node === ele);

            if(node === ele){
                this.partnerEntity = script.entity;
            }
        });
    }


    private _inited:boolean = false;
    private async init(){
        this._inited = true;
        this.partnerParent.removeAllChildren();
        const matchingEntities = await window.queryAssetsList?.();
        let me = globalThis.ponzi.currentPlayer;
        
        for (const playerEntity of matchingEntities) {
            if(me == string_utils.getHashFromSymbol(playerEntity)) continue;
            let al = null;
            try{
                al = await window.queryValue?.(globalThis.env.components.AssetsList, playerEntity)
            }catch{
                log("Can not find assetslist on entity");
                continue;
            }
            
            let newNode:Node = instantiate(this.tradeItemModel);
            newNode.active = true;
            newNode.parent = this.partnerParent;
            newNode.position = Vec3.ZERO;
            let script:trade_parter_item = newNode.getComponent(trade_parter_item);
            script.entity = playerEntity;

            let name:string = string_utils.truncateString(string_utils.getHashFromSymbol(playerEntity));
            script.init(name,al.gpu,al.bitcoin,al.battery,al.leiter,al.gold,al.oil);
        }
    }

    
    private _resetAssets(){
        let children:Node[] = this.assetsParent.children;
        children.forEach((ele:Node)=>{
            let script:trade_asset_item = ele.getComponent(trade_asset_item);
            script.setSelected(false);
        });
    }

    // private _
}

