import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JsCaller')
export class JsCaller {
    // 定义一个静态变量，用来存储该类的唯一实例
    static instance = null;
    // 定义一个静态方法，用来获取该实例
    static getInstance() {
        // 如果实例不存在，就创建一个新的实例
        if (!this.instance) {
            this.instance = new JsCaller();
        }
        // 返回实例
        return this.instance;
    }
    // 定义其他属性和方法
    JsCaller() {
        // ...
    }
    
    // public out
}

