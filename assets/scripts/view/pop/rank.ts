import { log } from 'cc';
import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { ponzi_controller } from '../../ponzi-controller';
import { ccc_msg } from '../../enums/ccc_msg';
const { ccclass, property } = _decorator;

@ccclass('rank')
export class rank extends Component {
    @property({type:Label})
    private labelRank:Label;
    @property({type:Label})
    private labelPoints:Label;
    @property({type:Label})
    private labelNotice:Label;

    start() {

    }

    update(deltaTime: number) {
        
    }

    public init(rank:number,points:number){
        this.labelPoints.string = points.toString();
        this.labelRank.string = rank.toString();
        this.labelNotice.string = this.getNoticeByRank(rank).toString();
    }

    public onShareClicked(){
        ponzi_controller.instance.sendCCCMsg(ccc_msg.single_button_dialog,{content:"This feature is under development",btnText:"OK"});
    }

    public onPlayerAgainClicked(){
        ponzi_controller.instance.sendCCCMsg(ccc_msg.single_button_dialog,{content:"This feature is under development",btnText:"OK"});
    }

    public onBtnCloseClicked(){
        this.node.active = false;
    }

    private getNoticeByRank(rank:number){
        if(rank === 1){
            return "CONGRATS!! YOU ARE NOW THE MAN WHO BEAT THE MARKET!!";
        }else{
            return "CONGRATS ON SURVIVING THE BEAR! YOU WILL THRIVE IN THE NEXT CYCLE!";
        }
    }
}

