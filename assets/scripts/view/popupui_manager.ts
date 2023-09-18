import { _decorator, Component, Node } from 'cc';
import { ponzi_controller } from '../ponzi-controller';
import { ccc_msg } from '../enums/ccc_msg';
import { single_button_pop } from './pop/single-button-pop';
import { test } from '../../../@types/packages/scene/@types/cce/export/undo/test';
import { pick_asset } from './pop/pick_asset';
import { pick_money_card } from './pick-money-card';
import { rules } from './widgets/rules';
import { trade } from './trade';
import { trade_ask } from './pop/trade-ask';
import { trade_input_price } from './pop/trade_input_price';
import { rank } from './pop/rank';
import { popeffect } from './widgets/popeffect';
const { ccclass, property } = _decorator;

@ccclass('popupui_manager')
export class popupui_manager extends Component {
    @property({type:Node})
    public networkBlock:Node;

    @property({type:single_button_pop})
    public singleDialog:single_button_pop;

    @property({type:pick_asset})
    public pickAsset:pick_asset;

    @property({type:pick_money_card})
    public pickFund:pick_money_card;

    @property({type:rules})
    public rules:rules;

    @property({type:trade})
    public trade:trade;

    @property({type:trade_ask})
    public tradeAsk:trade_ask;

    @property({type:trade_input_price})
    public tradeInput:trade_input_price;

    @property({type:rank})
    public rank:rank;

    start() {
        const self = this;
        self.pickAsset.node.active = false;
        self.pickFund.node.active = false;
        self.rules.node.active = false;
        self.trade.node.active = false;
        self.tradeAsk.node.active = false;
        self.tradeInput.node.active = false;
        self.rank.node.active = false;

        ponzi_controller.instance.on(ccc_msg.network_block_ui,(show)=>{
            self.networkBlock.active = show;
        });
        ponzi_controller.instance.on(ccc_msg.single_button_dialog,({content,btnText})=>{
            self.popupWindow(self.singleDialog.node);
            self.singleDialog.init(content,btnText);
        });
        ponzi_controller.instance.on(ccc_msg.show_pick_asset,()=>{
            self.popupWindow(self.pickAsset.node);
            self.pickAsset.reset();
        });
        ponzi_controller.instance.on(ccc_msg.show_pick_fund,()=>{
            self.popupWindow(self.pickFund.node);
        });
        ponzi_controller.instance.on(ccc_msg.show_rules,()=>{
            self.popupWindow(self.rules.node);
        });
        ponzi_controller.instance.on(ccc_msg.show_trade,()=>{
            self.trade.show();
            self.trade.reset();
        });
        ponzi_controller.instance.on(ccc_msg.show_trade_ask,(obj)=>{
            self.popupWindow(self.tradeAsk.node);
            const {presenterName,offerMoney,assetNumber} = obj;
            self.tradeAsk.init(presenterName,offerMoney,assetNumber);
        });
        ponzi_controller.instance.on(ccc_msg.show_trade_input,()=>{
            self.popupWindow(self.tradeInput.node);
        });
        ponzi_controller.instance.on(ccc_msg.show_rank,(obj:any)=>{
            let show:boolean = obj.show;
            let rank:number = obj.rank;
            let points:number = obj.points;

            if(show){
                self.popupWindow(self.rank.node);
                self.rank.init(rank,points);
            }else{
                self.rank.node.active = false;
            }
        });
        
    }

    private popupWindow(window:Node){
        window.active = true;
        let script:popeffect = window.getComponent(popeffect);
        if(script) {
            script.show();
        }
    }

    private hidePopupWindow(window:Node){

    }

    update(deltaTime: number) {
        
    }
}

