import { Scene } from "phaser";

export enum PieceType {
    Wizard, Queen, Knight, Bishop, Rook, Pawn
}

export enum PieceColour {
    White, Black
}

const getPieceTexture = (type: PieceType, colour: PieceColour): string => {
    let colourPrefix;
    let typeName;
    switch (colour) {
        case (PieceColour.Black):
            colourPrefix = 'black'
            break
        default:
            colourPrefix = 'white'
    }

    switch (type) {
        case (PieceType.Wizard):
            typeName = 'King'
            break
        case (PieceType.Queen):
            typeName = 'Queen'
            break
        case (PieceType.Knight):
            typeName = 'Knight'
            break
        case (PieceType.Bishop):
            typeName = 'Bishop'
            break
        case (PieceType.Rook):
            typeName = 'Rook'
            break
        default:
            typeName = 'Pawn'
    }

    return colourPrefix + typeName

}

export default class Piece extends Phaser.GameObjects.Sprite {
    public pieceType: PieceType;
    public colour: PieceType;
    constructor(scene: Scene, x: number, y: number, type: PieceType, colour: PieceColour) {
        super(scene, x, y, getPieceTexture(type, colour))
    }
}