import { _decorator, Component, Node } from 'cc';
import { right_player_list_item } from './right-player-list-item';
import { string_utils } from '../../utils/string_utils';
import { RoleLocalObj } from '../data/RoleLocalObj';
import { instantiate, Vec3 } from 'cc';
import { HexMapTile } from '../data/HexMapTile';
import { player_model } from '../player-model';
import { log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('right_player_list')
export class right_player_list extends Component {
    @property({type:Node})
    private itemModel:Node;

    @property({type:Node})
    private itemParent:Node;

    start() {
        this.itemModel.active = false;
    }

    update(deltaTime: number) {
        if(!this._inited) this.init();
    }

    private _inited:boolean = false;
    private init(){
        let assetsListArray = globalThis.ponzi.players;
        if(!assetsListArray){
            return;
        }

        let array = [];
        for (let i=0;i<assetsListArray.length;i++) {
            let map = assetsListArray[i];
            if(array.indexOf(map.player) === -1){
                array.push(map.player);
            }
        }

        // log("role array:",array);
        if(array.length === 0){
            return;
        }
        this._inited = true;
        const self = this;
        // self.itemParent.removeAllChildren();

        for (let key in array) {
            let hash:string = array[key];

            let newNode:Node = instantiate(self.itemModel);
            newNode.setParent(self.itemParent);
            newNode.active = true;

            let script:right_player_list_item = newNode.getComponent(right_player_list_item);
            script.init(hash);
        }
    }

    
}

