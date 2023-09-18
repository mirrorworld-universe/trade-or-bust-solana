import { _decorator, Component, Node } from "cc";

import Singleton from "./Singleton";

const { ccclass, property } = _decorator;

@ccclass("PonziModel")
// 声明一个单例类
export default class PonziModel extends Singleton(){
  // 定义一个私有的静态属性，它是类的唯一实例
  private static _instance: PonziModel;

  // 定义一个私有的构造函数，使得外部不能直接创建类的实例
  private PonziModel() {
    this.counterValue = 0;
  }

  // 定义一个公共的静态方法，用于获取类的唯一实例
  public static get instance(): PonziModel {
    // 如果实例不存在，就创建一个新的实例并赋值给静态属性
    if (!PonziModel._instance) {
        PonziModel._instance = new PonziModel();
    }
    // 返回静态属性
    return PonziModel._instance;
  }

  public counterValue : number;
}