import { _decorator, Component, Node } from 'cc';
import PonziModel from './ponzi-model';
import { find } from 'cc';
import { NodeEventType } from 'cc';
import { __private } from 'cc';
import { log } from 'cc';
import { PlayerData } from './models/PlayerData';
import { ccc_msg } from './enums/ccc_msg';
import { object_utils } from './utils/object_utils';
import { list_utils } from './utils/list_utils';
import { UnsolicitedTransactionObj } from './view/data/UnsolicitedTransactionObj';
import { bytes_utils } from './utils/bytes_utils';
import { TradeListItem } from './utils/TradeListItem';
import { string_utils } from './utils/string_utils';
import { component_state } from './enums/component_state';
import { data_center } from './models/data_center';
import { GameData } from './models/GameData';
import { warn } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ponzi_controller')
export class ponzi_controller extends Component{

    private static _instance: ponzi_controller;
    public static get instance(): ponzi_controller {
        if (!ponzi_controller._instance) {
            ponzi_controller._instance = find("ponzi-controller").getComponent(ponzi_controller);
        }
        return ponzi_controller._instance;
    }

    private players:PlayerData[];
    private Game:any;
    private GameMap:any;

    start(): void {
        this.players = [];
        this.init();
    }

    public on(msgName:string,func:any){
        this.node.on(msgName,func);
    }

    private init(){
        if(!globalThis.ponzi){
            globalThis.ponzi = {};
        }

        this.registerJsLiseners();
    }

    private registerJsLiseners(){
        log("ccc registerJsLiseners");

        const self = this;
        globalThis.ponzi.gamestate_update = (oldValue,newValue)=>{
            self.gameStateUpdate(oldValue,newValue);
        }
        globalThis.ponzi.game_update = (oldValue,newValue)=>{
            self.gameUpdate(oldValue,newValue);
        }
        globalThis.ponzi.counter_update = (oldValue,newValue)=>{
            self.counterUpdate(oldValue,newValue);
        }
        globalThis.ponzi.isplayer_update = (update)=>{
            self.onIsPlayerUpdate(update.entity,update.value[0]);
        }
        globalThis.ponzi.transactionlist_update = (update)=>{
            self.transactionListUpdate(update);
        }
        globalThis.ponzi.assetslist_update = (update)=>{
            self.onAssetsListUpdate(update);
        }
        globalThis.ponzi.player_update = (update)=>{
            const [nextValue, prevValue] = update.value;
            self.onPlayerChanged(update.entity,prevValue,nextValue);
        }
        globalThis.ponzi.gamemap_update = (oldValue,newValue)=>{
            self.onGameMapChanged(oldValue,newValue);
        }
        globalThis.ponzi.mapitems_update = (oldValue,newValue)=>{
            self.onMapItemsChanged(oldValue,newValue);
        }
        globalThis.ponzi.raiseColddown_update = (update)=>{
            self.onRaiseColddownUpdate(update);
        }
        globalThis.ponzi.tradelist_update = (update)=>{
            self.onTradeListUpdate(update);
        }
        globalThis.ponzi.passivetransaction_update = (update)=>{
            self.onPassiveTransactionUpdate(update);
        }
        globalThis.ponzi.playergameresult_update = (update)=>{
            self.onPlayerGameResultUpdate(update);
        }
        
    }

    sendCCCMsg(msgName:string,msgData:any){
        this.node.emit(msgName, msgData);
    }

    private onPlayerGameResultUpdate(update:any){
        log("onPlayerGameResultUpdate",update);
        if(update.entity != globalThis.ponzi.currentPlayer) return;

        const [nextValue, prevValue] = update.value;
        if(!nextValue){
            let show = false;
            ponzi_controller.instance.sendCCCMsg(ccc_msg.show_rank,{show});
            return;
        }

        let data = nextValue;

        let rank = data.rank + 1;
        let points = data.points;
        let gpu = data.gpu;
        let bitcoin = data.bitcoin;
        let battery = data.battery;
        let leiter = data.leiter;
        let gold = data.gold;
        let oil = data.oil;

        let show = true;
        ponzi_controller.instance.sendCCCMsg(ccc_msg.show_rank,{show,rank,points});
    }

    private onPassiveTransactionUpdate(update:any){
        if(update.entity != globalThis.ponzi.currentPlayer) return;
        const [nextValue, prevValue] = update.value;

        if(!nextValue) return;

        let obj:UnsolicitedTransactionObj = nextValue;
        let presenterName = obj.from;
        let offerMoney = obj.money;
        let assetNumber = obj.asset;
        ponzi_controller.instance.sendCCCMsg(ccc_msg.show_trade_ask,{presenterName,offerMoney,assetNumber});
    }

    private onTradeListUpdate(update:any){
        const me = globalThis.ponzi.currentPlayer;
        if(update.entity != me) return;

        const [nextValue, prevValue] = update.value;
        if(!nextValue){
            log("TradeList components reset");
            return;
        }

        // let oldValue:TradeListItem = bytes_utils.decodeTradeListItem(prevValue);
        log("nextValue.list:",nextValue.list);
        let newValue:TradeListItem = bytes_utils.decodeTradeListItem(nextValue.list);
        if(!newValue) return;

        let content:string = "";
        let optStr:string = newValue.isSuccess ? "accept":"counter-buy";
        if(newValue.isPresenter){
            content = "Your trade partner "+string_utils.sliceLastN(newValue.partner,6)+ " "+optStr+" your trade. Please check your asset and money update.";
        }else{
            content = "You "+optStr+" the trade offered by "+string_utils.sliceLastN(newValue.partner,6)+ ". Please check your asset and money update.";
        }
        // if(oldValue.index != newValue.index)
        
        ponzi_controller.instance.sendCCCMsg(ccc_msg.single_button_dialog,{content,btnText:"OK"});
    }

    private onRaiseColddownUpdate(update:any){
        this.sendCCCMsg(ccc_msg.on_raisecolddown_update,update);
    }

    onMapItemsChanged(oldObj:any,newObj:any) {
        ponzi_controller.instance.sendCCCMsg(ccc_msg.on_mapitem_update,{oldObj,newObj});
    }

    onGameMapChanged(oldObj:any,newObj:any) {
        // 调用函数，传入两个对象，得到结果
        let result = this.compareObjects(oldObj, newObj);
        if(!result){
            log("There is no changes on GameMap");
            return;
        }
        
        log("on game map changed:",result);
        ponzi_controller.instance.sendCCCMsg(ccc_msg.on_gamemap_update,result);
    }

    onIsPlayerUpdate(entity:any, newObj:any){
        ponzi_controller.instance.sendCCCMsg(ccc_msg.on_isplayer_update,{entity,newObj});
    }

    onPlayerChanged(entity:any, oldObj:any,newObj:any){
        if(object_utils.isNull(oldObj) && newObj){
            ponzi_controller.instance.sendCCCMsg(ccc_msg.on_player_add,entity);
        }else if(object_utils.isNull(oldObj) || object_utils.isNull(newObj)){
            log("Player components reset");
        }else{
            let result = this.compareObjects(oldObj, newObj);
            // console.log(result); // ["name", "age"]
            if(result['x'] || result['y'] || result['money']){
                ponzi_controller.instance.sendCCCMsg(ccc_msg.on_player_update,{entity,oldObj,newObj});
            }
        }
    }

    onAssetsListUpdate(update:any){
        this.sendCCCMsg(ccc_msg.on_assetslist_update,update);
    }

    transactionListUpdate(update:any) {
        const entity = update.entity;
        const [nextValue, prevValue] = update.value;
        if(!nextValue){
            log("TransactionList component clear");
            return;
        }

        const playerEntity = globalThis.ponzi.currentPlayer;
        if(entity == playerEntity){
            const extraStrings = list_utils.getExtraStrings(prevValue?.list,nextValue.list);
            if(extraStrings.length > 0){
                log("transactionListUpdate extraStrings:",extraStrings);

                ponzi_controller.instance.sendCCCMsg(ccc_msg.single_button_dialog,{content:"You've got a new trading partner",btnText:"OK"});
            }
        }
    }

    counterUpdate(oldObj:any,newObj:any) {
        // 调用函数，传入两个对象，得到结果
        let result = this.compareObjects(oldObj, newObj);
        if(!result) return;
        let counterValue = result['value']
        if(counterValue){
            this.sendCCCMsg('ccc_counter_value',counterValue)
        }
        // 打印结果
        console.log(result); // ["name", "age"]
    }
    
    gameInit(game:any){

    }

    gameUpdate(oldObj:any,newObj:any) {
        this.sendCCCMsg(ccc_msg.on_game_update,{oldObj,newObj})
    }
    gameStateUpdate(oldObj:number,newObj:number) {
        this.sendCCCMsg(ccc_msg.on_gamestate_update,{oldObj,newObj})
        let bool1:boolean = oldObj != newObj;
        let bool2:boolean = newObj == component_state.game_ingame;
        log("check delete walk record1:",bool1);
        log("check delete walk record2:",bool2);
        if(bool1 && bool2){
            let lastGameId:string = data_center.instance.getLastRecordGameId();
            const gameObj:GameData = globalThis.ponzi.game;
            if(!gameObj){
                warn("No gameobj when loading map record");
                return null;
            }

            if((lastGameId != "" && lastGameId) && lastGameId != gameObj.gameId){
                console.log("start delete walk record");
                data_center.instance.deleteMapWalkRecord();
                this.sendCCCMsg(ccc_msg.on_gamemap_walkrecord_update,null)
            }
        }
    }

    // 定义一个函数来比较两个对象，并返回一个数组，包含变动的参数名称
    compareObjects(obj1, obj2) {
        // 定义一个空数组来存储变动的参数名称
        let changedParams = {};
        if(!obj1 && obj2){
            for (let key in obj2) {
                changedParams[key] = obj2[key];
            }
        }else{
            // 遍历obj1的所有属性
            for (let key in obj1) {
                // 如果obj2没有该属性，或者obj2的属性值与obj1不同，则说明该属性发生了变动
                if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
                    // 将变动的属性名称添加到数组中
                    changedParams[key] = obj2[key];
                }
            }
            // 遍历obj2的所有属性
            for (let key in obj2) {
                // 如果obj1没有该属性，则说明该属性是新增的，也属于变动
                if (!obj1.hasOwnProperty(key)) {
                    // 将变动的属性名称添加到数组中
                    changedParams[key] = obj2[key];
                }
            }
            // 返回变动的参数名称数组
            return changedParams;
        }
    }
}

