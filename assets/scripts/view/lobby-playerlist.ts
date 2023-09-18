import { _decorator, Component, Node } from 'cc';
import { data_utils } from '../utils/data_utils';
import { instantiate } from 'cc';
import { lobby_playerlist_model } from './lobby-playerlist-model';
import { ponzi_controller } from '../ponzi-controller';
import { ccc_msg } from '../enums/ccc_msg';
import { lobby_controller } from '../controllers/lobby-controller';
import { string_utils } from '../utils/string_utils';
import { log } from 'cc';
import { Label } from 'cc';
import { component_state } from '../enums/component_state';
const { ccclass, property } = _decorator;

@ccclass('lobby_playerlist')
export class lobby_playerlist extends Component {
    @property({type:Node})
    private model:Node;

    @property({type:Node})
    private gridParent:Node

    @property({ type:Label })
    private peopleLabel:Label;

    private lobbyPlayers:string[];

    start() {

    }

    update(deltaTime: number) {
        if(!this.inited) this.init();
    }

    private inited:boolean = false;
    private init(){
        let players = window.getPlayers?.();
        if(!players){
            return;
        }

        log("lobby-playerlist start init...");
        this.inited = true;
        this.lobbyPlayers = [];
        for (let key in players) {
            let map = players[key];
            for (let [entity, value] of map) {
                //   console.log(key, entity, value);
                let hash:string = string_utils.getHashFromSymbol(entity);
                string_utils.addStringToArray(this.lobbyPlayers,hash);
            }
        }

        this.peopleLabel.string = this.lobbyPlayers.length + " Players Login...";

        this.lobbyPlayers.forEach(ele=>{
            this.addNewNode(ele);
        });

        this.registerListeners();
    }

    private registerListeners(){
        const self = this;
        ponzi_controller.instance.on(ccc_msg.on_player_add,(entity)=>{
            string_utils.addStringToArray(self.lobbyPlayers,entity);
            self.peopleLabel.string = self.lobbyPlayers.length + " Players Login...";
            self.addNewNode(entity);
        });
        
        ponzi_controller.instance.on(ccc_msg.on_gamestate_update,(obj)=>{
            let oldObj = obj.oldObj;
            let newObj = obj.newObj;
            let bool1:boolean = oldObj != newObj;
            let bool2:boolean = newObj == component_state.game_waiting;

            if(bool1 && bool2){
                this.inited = false;
            }
        })
    }

    private addNewNode(hash:string){
        return;
        let str = hash.toString();
        let newNode = instantiate(this.model);
        newNode.active = true;
        newNode.parent = this.gridParent;

        let modelScript:lobby_playerlist_model = newNode.getComponent(lobby_playerlist_model);
        modelScript.init(string_utils.sliceLastN(str,4));
    }
}

