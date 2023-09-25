export class Game{
    public gameId:number;
    public startTime:number;
    public endTime:number;
}

export class GameState{
    public value:number;
}

export class GameMap{
    public width: number;
    public height: number;
    public mapArray:"bytes";
}

export class MapItem{
    public x:number;
    public y:number;
}

export class Player{
    public gameId:number;
    public state:number;
    public money:number;
    public x:number;
    public y:number;
}

export class IsPlayer{
    public value:boolean;
}

export class RaiseColddown{
    public start:number;
    public end:number;
}

export class AssetsList{
    public gpu:number
    public bitcoin:number
    public battery:number
    public leiter:number
    public gold:number
    public oil:number
}

export class TransactionList{
    public list:'bytes32[]';
}

export class TradeList{
    public list:'bytes';
}

export class IsTrading{
    public value:boolean;
}

export class PlayerGameResult{
    public rank:number
    public points:number
    public gpu:number
    public bitcoin:number
    public battery:number
    public leiter:number
    public gold:number
    public oil:number
}

export class PassiveTransaction{
    public asset:number
    public money:number
    public from:string
}