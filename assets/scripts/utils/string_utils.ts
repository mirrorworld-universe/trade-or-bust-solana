import { log } from "cc";

export class string_utils {

    public static removeLeadingZeros(address: string): string {
      if (!address.startsWith("0x")) {
        return address; // 不以 "0x" 开头，不做处理
      }
    
      let cleanedAddress = address.slice(2); // 去掉 "0x" 前缀
    
      // 去掉前导零
      while (cleanedAddress.length > 0 && cleanedAddress[0] === "0") {
        cleanedAddress = cleanedAddress.slice(1);
      }
    
      // 添加 "0x" 前缀
      cleanedAddress = "0x" + cleanedAddress;
    
      return cleanedAddress;
    }
    
    public static truncateString(str: string): string {
        if (str.length <= 7) {
          return str; // 字符串长度不足以进行截断，直接返回原字符串
        }
      
        const leftPart = str.slice(0, 3); // 左边剩下的3位字符
        const rightPart = str.slice(-4); // 右边剩下的4位字符
      
        return leftPart + "..." + rightPart;
    }

    
    public static sliceLastN(str: string, n: number): string {
        // 如果n小于等于0，或者大于等于字符串的长度，返回空字符串
        if (n <= 0 || n >= str.length) {
          return "";
        }
        // 否则，使用slice方法，从字符串的长度减去n的位置开始，到字符串的末尾结束，返回截取的子字符串
        else {
          return str.slice(str.length - n);
        }
    }

    public static getNumberFromSymbol(sym:string){
      const hexValue = this.getHashFromSymbol(sym);
      const decimalValue = BigInt(hexValue);
      const numberValue = Number(decimalValue);
      return numberValue;
    }

    public static getHashFromSymbol(sym:string){
        let str = sym.toString();
        let index = str.indexOf("Symbol(");
        if(index !== 0){
            // log("This is not a symble string:",sym);
            return sym;
        }
        let hash = str.slice(7, -1); // 调用slice方法，去掉前面的"Symbol("和后面的")"
        return hash;
    }

    public static addStringToArray(arr: string[], str: string): void {
        // 如果数组中已经包含了这个字符串，不做任何操作
        let index = arr.indexOf(str);
        if (index !== -1) {
          return;
        }
        // 否则，将这个字符串推入数组的末尾
        else {
          arr.push(str);
        }
      }
}

