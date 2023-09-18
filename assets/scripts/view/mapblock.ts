import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { HexMapTile } from './data/HexMapTile';
import { log } from 'cc';
import { ponzi_controller } from '../ponzi-controller';
import { ccc_msg } from '../enums/ccc_msg';
import { warn } from 'cc';
import { data_center } from '../models/data_center';
import { RowCol } from './data/RowCol';
import { coor_utils } from '../utils/coor_utils';
const { ccclass, property } = _decorator;

@ccclass('mapblock')
export class mapblock extends Component {
    @property({type:Label})
    private label:Label;
    @property({type:Node})
    private walkedImage:Node;
    @property({type:Node})
    private newImage:Node;
    @property({type:Node})
    private surroundImage:Node;

    private mapTile:RowCol;

    start() {
        // this.label.node.active = false;
    }

    update(deltaTime: number) {
        
    }

    public init(mapTile:RowCol,isWalked:boolean){
        this.mapTile = mapTile;
        this.label.node.active = false;
        this.walkedImage.active = isWalked;
        this.newImage.active = !isWalked;
    }

    public setSurround(isSurroundPlayer:boolean){
        this.surroundImage.active = isSurroundPlayer;
    }

    public showLabel(content:string){
        this.label.string = content;
        this.label.node.active = true;

        // this.walkedImage.active = false;
        // this.newImage.active = true;
    }

    public async onBlockClicked(){
        const self = this;
        log("click block:",this.mapTile.row,this.mapTile.col);
        ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,true);
        try{
            await window.move?.(self.mapTile.row,self.mapTile.col);
            self.updateMapWalkRecord(this.mapTile.row,this.mapTile.col);
            // console.warn("Role walk record save:",self.mapTile);
            // self.updateMapWalkRecord(self.mapTile.row,self.mapTile.col);
            // ponzi_controller.instance.sendCCCMsg(ccc_msg.on_gamemap_walkrecord_update,null);
            // ponzi_controller.instance.sendCCCMsg(ccc_msg.on_mapitem_update,null);
        }catch{
            ponzi_controller.instance.sendCCCMsg(ccc_msg.single_button_dialog,{content:"You can't go there",btnText:"OK"});
        }
        
        ponzi_controller.instance.sendCCCMsg(ccc_msg.network_block_ui,false);
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

    private giveValue(recordMap:number[][],row,col){
        if(!recordMap[row]) recordMap[row] = [];
        recordMap[row][col] = 1;
    }
    
}

