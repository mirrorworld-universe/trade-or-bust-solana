import { instantiate } from 'cc';
import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import log from '../../../../@types/packages/scene/@types/cce/3d/manager/startup/log';
import { string_utils } from '../../utils/string_utils';
import { right_player_list_item } from '../widgets/right-player-list-item';
import { ponzi_controller } from '../../ponzi-controller';
import { ccc_msg } from '../../enums/ccc_msg';
const { ccclass, property } = _decorator;

@ccclass('assets')
export class assets extends Component {
    @property({type:Node})
    private labelParent:Node;

    start() {

    }

    update(deltaTime: number) {
        if(!this._inited) this.init();
    }

    private _inited:boolean = false;
    private init(){
        let assetsListArray = window.getAssetsList?.();
        if(!assetsListArray){
            return;
        }

        this._inited = true;
        this.updateUI();
        this.registerListeners();
    }

    private registerListeners(){
        let self = this;
        ponzi_controller.instance.on(ccc_msg.on_assetslist_update,()=>{
            self.updateUI();
        })
    }

    private updateUI(){
        let assetsListArray = window.getAssetsList?.();
        if(!assetsListArray){
            return;
        }

        let myObj:AssetsListObj = new AssetsListObj();
        let me = globalThis.ponzi.currentPlayer;
        for (let key in assetsListArray) {
            let map = assetsListArray[key];
            for (let [entity, value] of map) {
                console.log(key, entity, value);
                
                let hash = string_utils.getHashFromSymbol(entity);
                if(me != hash) continue;

                if(key == 'gpu'){
                    let valueNum = Number(value);
                    myObj.gpu = valueNum;
                }else if(key == 'bitcoin'){
                    let valueNum = Number(value);
                    myObj.bitcoin = valueNum;
                }else if(key == 'battery'){
                    let valueNum = Number(value);
                    myObj.battery = valueNum;
                }else if(key == 'leiter'){
                    let valueNum = Number(value);
                    myObj.leiter = valueNum;
                }else if(key == 'gold'){
                    let valueNum = Number(value);
                    myObj.gold = valueNum;
                }else if(key == 'oil'){
                    let valueNum = Number(value);
                    myObj.oil = valueNum;
                }
            }
        }

        this.initWithObj(myObj);
    }


    private initWithObj(myObj:AssetsListObj){
        console.log("myObj:",myObj);
        let children:Node[] = this.labelParent.children;
        let gpuLabel:Label = children[0].getComponent(Label);
        gpuLabel.string = myObj.gpu;
        let bitcoinLabel:Label = children[1].getComponent(Label);
        bitcoinLabel.string = myObj.bitcoin;
        let batteryLabel:Label = children[2].getComponent(Label);
        batteryLabel.string = myObj.battery;
        let leiterLabel:Label = children[3].getComponent(Label);
        leiterLabel.string = myObj.leiter;
        let goldLabel:Label = children[4].getComponent(Label);
        goldLabel.string = myObj.gold;
        let oilLabel:Label = children[5].getComponent(Label);
        oilLabel.string = myObj.oil;
    }
}


class AssetsListObj {
    public gpu;
    public bitcoin;
    public battery;
    public leiter;
    public gold;
    public oil;
}

