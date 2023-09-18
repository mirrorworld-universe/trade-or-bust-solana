
export class list_utils {
    public static getExtraStrings(list1: string[], list2: string[]): string[] {
        if(!list1) return list2;
        const set = new Set(list1);
        const extras: string[] = [];
    
        for (const str of list2) {
            if (!set.has(str)) {
                extras.push(str);
            }
        }
    
        return extras;
    }
    
    
}

