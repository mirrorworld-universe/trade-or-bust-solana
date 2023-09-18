import { sys } from "cc";
import { PlayerData } from "./PlayerData";
import { GameData } from "./GameData";
import { warn } from "cc";
import { log } from "cc";

export class data_center{
    private static _instance: data_center;
    public static get instance(): data_center {
        // 如果实例不存在，就创建一个新的实例并赋值给静态属性
        if (!data_center._instance) {
            data_center._instance = new data_center();
        }
        // 返回静态属性
        return data_center._instance;
    }
    data_center(){

    }
    
    private _mapRecordKey:string = "map_record_key_";
    // 存储二维数组
    public saveMapWalkRecord(data:number[][]) {
        const gameObj:GameData = globalThis.ponzi.game;
        if(!gameObj){
            warn("No gameobj when saving map record");
            return;
        }
        
        sys.localStorage.setItem(this._lastRecordGameIdKey,gameObj.gameId);
        var jsonString = JSON.stringify(data);
        // log("Save map record:"+this._mapRecordKey + gameObj.gameId+ jsonString);
        sys.localStorage.setItem(this._mapRecordKey + gameObj.gameId, jsonString);
    }

    // 获取二维数组
    public loadMapWalkRecord():number[][] {
        const gameObj:GameData = globalThis.ponzi.game;
        if(!gameObj){
            warn("No gameobj when loading map record");
            return null;
        }

        var jsonString = sys.localStorage.getItem(this._mapRecordKey + gameObj.gameId);
        if (jsonString) {
            let recordArray:number[][] = JSON.parse(jsonString);
            // log("load map record:"+this._mapRecordKey + gameObj.gameId+ jsonString);
            return recordArray;
        } else {
            let newArray:number[][] = [];
            this.saveMapWalkRecord(newArray);
            return newArray;
        }
    }

    public deleteMapWalkRecord(){
        console.log("deleteMapWalkRecord enter function");
        const gameObj:GameData = globalThis.ponzi.game;
        if(!gameObj){
            warn("No gameobj when loading map record");
            return null;
        }
        
        console.log("Delete map walk record ",this._mapRecordKey + gameObj.gameId);
        sys.localStorage.removeItem(this._mapRecordKey + gameObj.gameId);
    }

    private _lastRecordGameIdKey:string = "_lastRecordGameId";
    public getLastRecordGameId(){
        return sys.localStorage.getItem(this._lastRecordGameIdKey);
    }
}

