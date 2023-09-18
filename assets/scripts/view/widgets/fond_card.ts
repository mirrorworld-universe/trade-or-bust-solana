import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('foud_card')
export class fond_card extends Component {

    @property({type:Label})
    private labelFund:Label;
    @property({type:Label})
    private labelTime:Label;
    @property({type:Label})
    private labelRepay:Label;
    @property({type:Label})
    private labelRate:Label;
    @property({type:Node})
    private chosenTag:Node;

    
    start() {

    }

    update(deltaTime: number) {
        
    }

    public init(){
        
    }

    public setChosen(isChosen:boolean){
        this.chosenTag.active = isChosen;
    }
}

