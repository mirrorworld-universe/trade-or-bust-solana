
export class object_utils {
    public static isNull(obj: any){
        if (typeof obj === "undefined" || obj === null) {
            return true;
        }
        return false;
    }

    public static compareObjects(obj1, obj2) {
        // 定义一个空数组来存储变动的参数名称
        let changedParams = {};
        if(!obj1 && obj2){
            for (let key in obj2) {
                changedParams[key] = obj2[key];
            }
        }else{
            // 遍历obj1的所有属性
            for (let key in obj1) {
                // 如果obj2没有该属性，或者obj2的属性值与obj1不同，则说明该属性发生了变动
                if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
                    // 将变动的属性名称添加到数组中
                    changedParams[key] = obj2[key];
                }
            }
            // 遍历obj2的所有属性
            for (let key in obj2) {
                // 如果obj1没有该属性，则说明该属性是新增的，也属于变动
                if (!obj1.hasOwnProperty(key)) {
                    // 将变动的属性名称添加到数组中
                    changedParams[key] = obj2[key];
                }
            }
            // 返回变动的参数名称数组
            return changedParams;
        }
    }
}

