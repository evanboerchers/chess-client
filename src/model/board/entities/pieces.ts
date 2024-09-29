import { DaigonalMovementStrategy, MovemenetStrategy } from "../../../control/pieces/movement/MovementStrategy";

export enum PieceType {
    Wizard, Queen, Knight, Bishop, Rook, Pawn
}

export enum PieceColour {
    White, Black
}
export const getDefaultMovementStrategy = (type: PieceType): [MovemenetStrategy] => {
    switch(type) {
        case PieceType.Wizard:
            return [new DaigonalMovementStrategy()];
        case PieceType.Queen:
            return [new DaigonalMovementStrategy()];
        case PieceType.Knight:
            return [new DaigonalMovementStrategy()];
        case PieceType.Bishop:
            return [new DaigonalMovementStrategy()];
        case PieceType.Rook:
            return [new DaigonalMovementStrategy()];
        case PieceType.Pawn:
            return [new DaigonalMovementStrategy()];
    }
}

export interface Piece { 
    type: PieceType;
    colour: PieceColour;    
    movementStrategy: [MovemenetStrategy];
}