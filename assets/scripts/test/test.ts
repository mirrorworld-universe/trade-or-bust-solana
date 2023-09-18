import { _decorator, Component, Node } from 'cc';
import { ponzi_controller } from '../ponzi-controller';
import { bytes_utils } from '../utils/bytes_utils';
const { ccclass, property } = _decorator;

@ccclass('test')
export class test extends Component {
    start() {
        // const testBytes = "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000ef5f8c47df0897a040417c39d38b9251240474bc";
        // const tradeListItem = bytes_utils.decodeTradeListItem(testBytes);
        // console.log(tradeListItem);
    }

    update(deltaTime: number) {
        
    }
}

