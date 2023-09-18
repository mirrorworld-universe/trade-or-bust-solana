import { _decorator, Component, Node } from 'cc';
import { ponzi_controller } from '../ponzi-controller';
import { ccc_msg } from '../enums/ccc_msg';
import { log } from 'cc';
import { instantiate } from 'cc';
import { Vec3 } from 'cc';
import { mapblock } from './mapblock';
import { string_utils } from '../utils/string_utils';
import { component_state } from '../enums/component_state';
import { player_model } from './player-model';
import { HexMapTile } from './data/HexMapTile';
import { RoleLocalObj } from './data/RoleLocalObj';
import { ponzi_config } from '../enums/ponzi_config';
import { data_center } from '../models/data_center';
import { RowCol } from './data/RowCol';
import { coor_utils } from '../utils/coor_utils';
import { mapitem } from './widgets/mapitem';
import { object_utils } from '../utils/object_utils';
const { ccclass, property } = _decorator;

@ccclass('map_controller')
export class map_controller extends Component {

    @property({type:Node})
    private mapParent:Node;

    @property({type:Node})
    private itemParent:Node;

    @property({type:Node})
    private playerParent:Node;

    @property({type:Node})
    private mapBlockModel:Node;

    @property({type:Node})
    private mapItemModel:Node;

    @property({type:Node})
    private playerModel:Node;


    private terrainArray:any[][];

    start() {
        this.mapBlockModel.active = false;
        this.mapItemModel.active = false;
        this.playerModel.active = false;
    }

    update(deltaTime: number) {
        if(!this.inited) this.init();
    }

    private inited:boolean = false;
    private init(){
        let gameState = globalThis.ponzi.gameState;
        if(gameState != component_state.game_ingame) return;

        let map = globalThis.ponzi.gameMap?.mapArray;
        if(!map) return;
        let items = window.getMapItems?.();
        if(!items) return;
        
        this.tmpCoorArray = null;

        this.inited = true;
        this.updateMap();
        this.drawItem();
        this.drawPlayers();

        this.registerListeners();
    }

    private registerListeners(){
        const self = this;
        ponzi_controller.instance.on(ccc_msg.on_gamemap_update,(changeResult)=>{
            if(!changeResult) return;

            let newMap = changeResult['mapArray'];
            let width = Number(globalThis.ponzi.gameMap?.width);
            let height = Number(globalThis.ponzi.gameMap?.height);

            self.drawMap(width,height,newMap);
        });
        ponzi_controller.instance.on(ccc_msg.on_gamemap_walkrecord_update,()=>{
            self.updateMap();
        });

        ponzi_controller.instance.on(ccc_msg.on_mapitem_update,()=>{
            self.drawItem();
        });

        ponzi_controller.instance.on(ccc_msg.on_player_update,(obj)=>{
            self.drawPlayers();

            const {entity,oldObj,newObj} = obj;
            if(!newObj) return;

            if(oldObj){
                let change = object_utils.compareObjects(oldObj,newObj);
                if(change["x"] || change["y"]){
                    console.warn("Role walk record save:",newObj.x,newObj.y);
                    self.updateMapWalkRecord(Number(newObj.x),Number(newObj.y));
                    ponzi_controller.instance.sendCCCMsg(ccc_msg.on_gamemap_walkrecord_update,null);
                    ponzi_controller.instance.sendCCCMsg(ccc_msg.on_mapitem_update,null);
                }
            }
        });

        ponzi_controller.instance.on(ccc_msg.on_gamestate_update,(obj)=>{
            let oldObj = obj.oldObj;
            let newObj = obj.newObj;
            let bool1:boolean = oldObj != newObj;
            let bool2:boolean = newObj == component_state.game_waiting;

            if(bool1 && bool2){
                self.inited = false;
            }
        });
    }

    private updateMapWalkRecord(row:number,col:number){
        let recordMap:number[][] = data_center.instance.loadMapWalkRecord();
        this.giveValue(recordMap,row,col);
        // warn("Hex center:"+row+" "+col);

        let arround = coor_utils.getNeighboringHexes(row,col);
        arround.forEach((ele:RowCol)=>{
            // warn("Hex:"+ele.row+" "+ele.col);
            this.giveValue(recordMap,ele.row,ele.col);
        });
        data_center.instance.saveMapWalkRecord(recordMap);
    }

    private updateMap(){
        let width = Number(globalThis.ponzi.gameMap?.width);
        let height = Number(globalThis.ponzi.gameMap?.height);
        let map = globalThis.ponzi.gameMap?.mapArray;
        if(!map){
            log("No map data!!!!!!");
            return;
        }

        this.drawMap(width,height,map);
    }

    // private 
    private drawPlayers(){
        let players = window.getPlayers?.();
        if(!players){
            return;
        }

        let array = {};
        for (let key in players) {
            let map = players[key];
            for (let [entity, value] of map) {
                //   console.log(key, entity, value);
                let hash = string_utils.getHashFromSymbol(entity);
                if(!array[hash]){
                    array[hash] = new RoleLocalObj();
                }
                let obj:RoleLocalObj = array[hash];
                array[hash] = obj;
                if(key == 'x'){
                    let valueNum = Number(value);
                    obj.row = valueNum;
                }else if(key == 'y'){
                    let valueNum = Number(value);
                    obj.col = valueNum;
                }else if(key == 'money'){
                    let valueNum = Number(value);
                    obj.money = valueNum;
                }
            }
        }

        // log("role array:",array);
        const self = this;
        self.playerParent.removeAllChildren();

        for (let key in array) {
            let value:RoleLocalObj = array[key];

            let newNode:Node = instantiate(self.playerModel);
            newNode.setParent(self.playerParent);
            newNode.active = true;

            let pos:HexMapTile = self.tmpCoorArray[value.row][value.col];
            newNode.position = new Vec3(pos.x,pos.y,0);

            let script:player_model = newNode.getComponent(player_model);
            script.init(key);
        }
    }

    private drawItem(){
        let items = window.getMapItems?.();
        if(!items){
            return;
        }
        let array = [];
        for (let key in items) {
            let map = items[key];
            for (let [entity, value] of map) {
                //   console.log(key, entity, value);
                let index = string_utils.getNumberFromSymbol(entity) - 1;
                let valueNum = string_utils.getNumberFromSymbol(value);
                if(!array[index]){
                    array[index] = new MapItemLocalObj();
                }
                let obj:MapItemLocalObj = array[index];
                array[index] = obj;
                if(key == 'x'){
                    obj.row = valueNum;
                }else if(key == 'y'){
                    obj.col = valueNum;
                }
            }
        }
        let recordMap:number[][] = data_center.instance.loadMapWalkRecord();
        // log("item.values:",array);
        const self = this;
        self.itemParent.removeAllChildren();
        array.forEach((ele:MapItemLocalObj)=>{
            let newNode:Node = instantiate(self.mapItemModel);
            newNode.setParent(self.itemParent);
            newNode.active = true;

            let pos:HexMapTile = self.tmpCoorArray[ele.row][ele.col];
            newNode.position = new Vec3(pos.x,pos.y,0);

            let script:mapitem = newNode.getComponent(mapitem);
            script.init(recordMap[ele.row] && (recordMap[ele.row][ele.col] == 1));
        });
    }


    private tmpCoorArray:HexMapTile[][];
    private drawMap(width:number,height:number,newMap:any){
        if(!newMap){
            log("No map data to draw!");
            return;
        }
        
        this.terrainArray = window.mudutils?.hexToArray(width,height,newMap);
        // 示例使用
        const centerX = width/2; // 中心点的 X 坐标
        const centerY = height/2; // 中心点的 Y 坐标
        
        const hexMap = this.generateHexMap(110,100);
        const coordinationArray = this.moveAllTiles(hexMap, centerX, centerY);
        this.tmpCoorArray = coordinationArray;
        // log("coordinationArray 111:",coordinationArray);
        const coorMap = this.generateHexCoorMap();

        //check player
        let nowRoleObj:RoleLocalObj = new RoleLocalObj();
        let players = window.getPlayers?.();
        for (let key in players) {
            let map = players[key];
            for (let [entity, value] of map) {
                //   console.log(key, entity, value);
                let hash = string_utils.getHashFromSymbol(entity);
                if(hash != globalThis.ponzi.currentPlayer) continue;

                if(key == 'x'){
                    let valueNum = Number(value);
                    nowRoleObj.row = valueNum;
                }else if(key == 'y'){
                    let valueNum = Number(value);
                    nowRoleObj.col = valueNum;
                }
            }
        }

        let recordMap:number[][] = data_center.instance.loadMapWalkRecord();
        console.warn("Role walk record save:",nowRoleObj);
        this.giveValue(recordMap,nowRoleObj.row,nowRoleObj.col);    
        let arround = coor_utils.getNeighboringHexes(nowRoleObj.row,nowRoleObj.col);
        arround.forEach((ele:RowCol)=>{
            this.giveValue(recordMap,ele.row,ele.col);
        });
        data_center.instance.saveMapWalkRecord(recordMap);

        let surround:RowCol[] = [];
        if(nowRoleObj){
            surround = coor_utils.getNeighboringHexes(nowRoleObj.row,nowRoleObj.col);
        }
        
        this.mapParent.removeAllChildren();
        for (let row = 0; row < coordinationArray.length; row++) {
          for (let col = 0; col < coordinationArray[row].length; col++) {
            const tile = coordinationArray[row][col];
            const coor = coorMap[row][col];
            // 在这里访问和操作每个地图块（tile）
            // console.log(`Tile at (${tile.x}, ${tile.y}): ${tile.emoji}`);
            let newNode:Node = instantiate(this.mapBlockModel);
            newNode.setParent(this.mapParent);
            newNode.active = true;

            newNode.position = new Vec3(tile.x,tile.y,0);
            let script:mapblock = newNode.getComponent(mapblock);
            script.init(coor,recordMap[row]&&(recordMap[row][col] == 1));
            let isSurround:boolean = this.isSurround(surround,row,col);
            if(isSurround){
                log("isSurround:",isSurround);
            }
            script.setSurround(isSurround);
            if(ponzi_config.showCoor) script.showLabel(coor.row + ","+coor.col);
          }
        }
    }

    private isSurround(surround:RowCol[],targetRow,targetCol):boolean{
        if(!surround) return false;

        log("cell start");
        for(let i=0;i<surround.length;i++){
            let rc = surround[i];
            if(rc.row == targetRow && rc.col == targetCol) return true;
        }
        // surround.forEach((rc:RowCol)=>{
        //     log("com:",rc,targetRow,targetCol);
        //     if(rc.row == targetRow && rc.col == targetCol) return true;
        // });
        return false;
    }


    private generateHexCoorMap(): RowCol[][] {
        const mapArray: RowCol[][] = [];
      
        for (let i = 0; i < ponzi_config.mapWH; i++) {
          const row: RowCol[] = [];
      
          for (let j = 0; j < ponzi_config.mapWH; j++) {
            // const x = j;
            // const y = i;
            let tmp:RowCol = new RowCol();
            tmp.row = i;
            tmp.col = j;
      
            row.push(tmp);
          }
      
          mapArray.push(row);
        }
      
        return mapArray;
    }

    generateHexMap(size:number,hSize:number): HexMapTile[][] {
        const mapArray: HexMapTile[][] = [];
      
        for (let rowIdx = 0; rowIdx < ponzi_config.mapWH; rowIdx++) {
          const row: HexMapTile[] = [];
          const evenRowOffset = rowIdx % 2 === 0 ? 0 : size / 2;
      
          for (let colIdx = 0; colIdx < ponzi_config.mapWH; colIdx++) {
            const x = size * colIdx + evenRowOffset;
            const y = hSize * rowIdx;
            const emoji = "▲"; // 这里使用 ▲ 作为示例地图块的表现形式，你可以根据需求修改
      
            row.push({ x, y, emoji });
          }
      
          mapArray.push(row);
        }
      
        return mapArray;
    }

    private moveAllTiles(mapArray: HexMapTile[][],centerX: number, centerY: number){
        // 平移整个地图，使中心位于给定的点
        const centerTile = mapArray[centerY][centerX];
        const offsetX = centerX - Math.floor(mapArray.length / 2);
        const offsetY = centerY - Math.floor(mapArray[0].length / 2);
        
        const shiftedMapArray: HexMapTile[][] = mapArray.map((row) =>
            row.map((tile) => ({
                ...tile,
                x: tile.x - centerTile.x + offsetX,
                y: tile.y - centerTile.y + offsetY,
            }))
        );
        
        return shiftedMapArray;
    }

    private giveValue(recordMap:number[][],row,col){
        if(!recordMap[row]) recordMap[row] = [];
        recordMap[row][col] = 1;
    }
}



class MapItemLocalObj{
    row:number;
    col:number;
}
