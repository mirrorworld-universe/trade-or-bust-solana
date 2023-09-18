
export class time_utils {

    public static calculateRemainingTime(nowTime: number, endTime: number, startTime: number, blockRange: number): string {
        const remainingSeconds = endTime - nowTime;
        const remainingHours = Math.floor(remainingSeconds / 3600);
        const remainingMinutes = Math.ceil((remainingSeconds % 3600) / 60); // 使用 ceil() 向上取整
      
        const elapsedBlocks = Math.floor((nowTime - startTime) / blockRange);
        const totalBlocks = Math.floor((endTime - startTime) / blockRange);
      
        return `${remainingHours}H ${remainingMinutes}M (${elapsedBlocks}/${totalBlocks} BLOCKS)`;
    }
      
    public static calculateRemainingTimeOnlyMinutes(nowTime: number, endTime: number, startTime: number, blockRange: number): string {
        const remainingSeconds = endTime - nowTime;
        const remainingMinutes = Math.ceil(remainingSeconds / 60); // 使用 ceil() 向上取整
      
        const elapsedBlocks = Math.floor((nowTime - startTime) / blockRange);
        const totalBlocks = Math.floor((endTime - startTime) / blockRange);
      
        return `${remainingMinutes}M (${elapsedBlocks}/${totalBlocks} BLOCKS)`;
    }
      
    // 定义一个函数，接受一个秒数作为参数，返回一个字符串表示转换后的结果
    public static formatSeconds(seconds: number): string {
        let dayStr = " Day ";
        let hourStr = " Hour ";
        let minuteStr = " Minute ";
        let secondStr = " Second ";
        // 定义一个空字符串，用于存储结果
        let result = "";
        // 定义一天、一小时、一分钟的秒数
        const day = 24 * 60 * 60;
        const hour = 60 * 60;
        const minute = 60;
        // 计算天数，并添加到结果中，如果为零，则不显示
        let days = Math.floor(seconds / day);
        if (days > 0) {
        result += days + dayStr;
        }
        // 计算小时数，并添加到结果中，如果为零，则不显示
        let hours = Math.floor((seconds % day) / hour);
        if (hours > 0) {
        result += hours + hourStr;
        }
        // 计算分钟数，并添加到结果中，如果为零，则不显示
        let minutes = Math.floor((seconds % hour) / minute);
        if (minutes > 0) {
        result += minutes + minuteStr;
        }
        // 计算秒数，并添加到结果中，如果为零，则不显示
        let showSeconds = Math.floor(seconds % minute);
        if (showSeconds > 0) {
        result += showSeconds + secondStr;
        }
        // 返回结果字符串
        return result;
    }
}

