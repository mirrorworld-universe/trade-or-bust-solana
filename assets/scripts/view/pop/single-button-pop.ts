import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('single_button_pop')
export class single_button_pop extends Component {
    @property({type:Label})
    private contentLabel:Label;
    @property({type:Label})
    private buttonLabel:Label;

    start() {

    }

    update(deltaTime: number) {
        
    }

    public init(content:string,btnText:string){
        this.contentLabel.string = content;
        this.buttonLabel.string = btnText;
    }

    public onBtnClicked(){
        this.node.active = false;
    }
}

