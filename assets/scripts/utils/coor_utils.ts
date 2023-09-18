import { RowCol } from "../view/data/RowCol";

export class coor_utils {
    public static getNeighboringHexes(row, col): RowCol[] {
    
        // 根据当前行数选择相应的方向数组
        const directions = row % 2 === 0 ? 
            [
                { rowOff: 0, colOff: 1 },  // 右
                { rowOff: 0, colOff: -1 },// 左
                { rowOff: 1, colOff: -1 }, // 左上
                { rowOff: -1, colOff: -1 },  // 左下
                { rowOff: 1, colOff: 0 }, // 右上
                { rowOff: -1, colOff: 0 }   // 右下
            ] :
            [
                { rowOff: 0, colOff: -1 }, // 左
                { rowOff: 0, colOff: 1 }, // 右

                { rowOff: 1, colOff: 0 },// 左上
                { rowOff: -1, colOff: 0 }, // 左下

                { rowOff: 1, colOff: 1 }, // 右上
                { rowOff: -1, colOff: 1 }   // 右下
            ];
    
        const neighboringHexes: RowCol[] = [];
        for (let i = 0; i < directions.length; i++) {
            const dir = directions[i];
            const neighborQ = row + dir.rowOff;
            const neighborR = col + dir.colOff;
            neighboringHexes.push({ row: neighborQ, col: neighborR });
        }
    
        return neighboringHexes;
    }
}

