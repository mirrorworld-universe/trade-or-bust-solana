import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { ponzi_config } from '../../enums/ponzi_config';
import { ponzi_controller } from '../../ponzi-controller';
import { ccc_msg } from '../../enums/ccc_msg';
import { object_utils } from '../../utils/object_utils';
import { warn } from 'cc';
import { rule_utils } from '../../utils/rule_utils';
import { string_utils } from '../../utils/string_utils';
import { log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('right_player_list_item')
export class right_player_list_item extends Component {
    @property({type:Label})
    private labelName:Label;

    @property({type:Label})
    private labelItem1:Label;
    @property({type:Label})
    private labelItem2:Label;
    @property({type:Label})
    private labelItem3:Label;
    @property({type:Label})
    private labelItem4:Label;
    @property({type:Label})
    private labelItem5:Label;
    @property({type:Label})
    private labelItem6:Label;

    @property({type:Label})
    private labelPoints:Label;

    private itemPlayerEntity;

    start() {

    }

    update(deltaTime: number) {
        if(!this._inited) this._init();
    }

    public init(itemPlayerEntity:string){
        this.itemPlayerEntity = itemPlayerEntity;
    }

    private _inited:boolean = false;
    private async _init(){
        const playerEntity = this.itemPlayerEntity;
        if(!playerEntity) return;

        this._inited = true;

        this.labelName.string = string_utils.truncateString(playerEntity);
        
        //query self assetsList
        this.updateUI();
        
        //register lis
        this._registerListeners();
    }

    private async updateUI(){
        let assetsList = null;
        try{
            assetsList = await window.queryValue?.(window.env.components.AssetsList, this.itemPlayerEntity);
        }catch{
            log("Can not find AssetsList on entity");
            return;
        }
        this.labelItem1.string = assetsList.gpu;
        this.labelItem2.string = assetsList.bitcoin;
        this.labelItem3.string = assetsList.battery;
        this.labelItem4.string = assetsList.leiter;
        this.labelItem5.string = assetsList.gold;
        this.labelItem6.string = assetsList.oil;

        let totalScore = rule_utils.calculateScore(assetsList.gpu)+
        rule_utils.calculateScore(assetsList.bitcoin)+
        rule_utils.calculateScore(assetsList.battery)+
        rule_utils.calculateScore(assetsList.leiter)+
        rule_utils.calculateScore(assetsList.gold)+
        rule_utils.calculateScore(assetsList.oil);
        this.labelPoints.string = totalScore.toString();
    }

    private _registerListeners(){
        const self = this;
        ponzi_controller.instance.on(ccc_msg.on_assetslist_update,async (update)=>{
            const [nextValue, prevValue] = update.value;
            if(self.itemPlayerEntity != update.entity) return;
            await self.updateUI();
        })
    }
}

