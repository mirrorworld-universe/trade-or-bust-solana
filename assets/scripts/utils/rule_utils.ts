
export class rule_utils {
    public static calculateSingleAssetScore(arr: any[]): number {
        let score = 0;
        for (let i = 0; i < arr.length; i++) {
          score += (i + 1);
        }
        return score;
    }
    public static calculateScore(num: number): number {
        let score = 0;
        for (let i = 1; i <= num; i++) {
          score += i;
        }
        return score;
      }
}

