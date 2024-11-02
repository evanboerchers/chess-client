export class PlayerModel {
    private _name: string;
    private _mana: number;
    private _cards: string[];
    
    constructor(name: string, mana: number, cards: string[]) {
        this._name = name;
        this._mana = mana;
        this._cards = cards;
    }
    
    get name(): string {
        return this._name;
    }
    
    get score(): number {
        return this._mana;
    }
    
    set score(score: number) {
        this._mana = score;
    }

    public get cards(): string[] {
        return this._cards;
    }
    public set cards(value: string[]) {
        this._cards = value;
    }
}