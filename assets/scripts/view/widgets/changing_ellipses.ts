import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('changing_ellipses')
export class changing_ellipses extends Component {
    @property(Label)
    label: Label = null;

    private ellipsisCount: number = 0;
    private timer: number = null;

    public onEnable() {
        this.startEllipsisAnimation();
    }

    public onDisable() {
        this.stopEllipsisAnimation();
    }

    public updateLabel(myString: string) {
        this.label.string = myString + ".".repeat(this.ellipsisCount);
    }

    private startEllipsisAnimation() {
        this.timer = setInterval(() => {
            this.ellipsisCount = (this.ellipsisCount + 1) % 4;
            this.updateLabel(this.label.string.replace(/\.*$/, ""));
        }, 500);
    }

    private stopEllipsisAnimation() {
        clearInterval(this.timer);
        this.timer = null;
    }
}