import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FakeMessageCenter')
export class FakeMessageCenter{
    
    static instance = null;
    // 定义一个静态方法，用来获取该实例
    static getInstance() {
        // 如果实例不存在，就创建一个新的实例
        if (!this.instance) {
            this.instance = new FakeMessageCenter();
        }
        // 返回实例
        return this.instance;
    }
    
    FakeMessageCenter() {
        // ...
    }

    Broardcast

    public game:Game;
    public gameMap:GameMap;
}

class Game{
    state:number;
    gameId:number;
    startTime:number;
    endTime:number;
}

class GameMap{
    mapArray:any;
}

class Player{
    gameId:number;
    state:number;
    money:number;
    assets:number;
    transactions:[any];
}