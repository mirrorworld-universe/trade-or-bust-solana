import { log } from "cc";
import { TradeListItem } from "./TradeListItem";

export class bytes_utils{
      
      public static decodeTradeListItem(encodedBytes: string): TradeListItem {
        log("encodedBytes is ",encodedBytes);
        if(!encodedBytes) return null;
        const hexString = encodedBytes.slice(2);
        // const bytes = hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16));
      
        if (!hexString) {
          return null;
        }
        let length = hexString.length;
        log(length);

        let lll = 64;
        let idx = 0;
      
        //这个数字是0000020，十进制32，猜测表示每一位的长度
        const bytes1 = hexString.substring(idx, idx + lll);
        // log("from ",idx," to ",idx + lll," is:",bytes1);
        idx += lll;

        //猜测这个值表示之后的值在当前list中的index
        const bytes2 = hexString.substring(idx, idx + lll);
        // log("from ",idx," to ",idx + lll," is:",bytes2);
        idx += lll;
        const bytes3 = hexString.substring(idx, idx + lll);
        // log("from ",idx," to ",idx + lll," is:",bytes3);
        idx += lll;

        const bytes4 = hexString.substring(idx, idx + lll);
        // log("from ",idx," to ",idx + lll," is:",bytes4);
        idx += lll;
        
        const bytes5 = hexString.substring(idx, idx + lll);
        // log("from ",idx," to ",idx + lll," is:",bytes5);
        // const partner = this.byteArrayToHexString(partnerBytes);
      
        const tradeListItem: TradeListItem = {
            index:Number(this.hexToBinary(bytes2)),
          isPresenter:Number(this.hexToBinary(bytes3)) === 1,
          isSuccess:Number(this.hexToBinary(bytes4)) === 1,
          partner:'0x' + bytes5,
        };
      
        return tradeListItem;
      }
      

      private static hexToBinary(hexString: string): string {
        // 去除开头的 "0x"
        const hexWithoutPrefix = hexString.slice(2);
      
        let binaryString = '';
      
        for (let i = 0; i < hexWithoutPrefix.length; i++) {
          const hexChar = hexWithoutPrefix[i];
          const nibbleValue = parseInt(hexChar, 16);
      
          // 将每个十六进制字符转换为对应的 4 位二进制
          const nibbleBinary = nibbleValue.toString(2);
      
          // 补零，使得每个四位二进制数长度都为 4
          const paddedNibbleBinary = '0'.repeat(4 - nibbleBinary.length) + nibbleBinary;
      
          binaryString += paddedNibbleBinary;
        }
      
        return binaryString;
      }

      private static byteArrayToHexString(bytes: number[]): string {
        return bytes.map(byte => byte.toString(16).length % 2 === 0 ? byte.toString(16) : `0${byte.toString(16)}`).join('');
      }
      
      
      
}