import { DaigonaleMovementStrategy, MovemenetStrategy } from "../../../control/pieces/movement/MovementStrategy";

export enum PieceType {
    Wizard, Queen, Knight, Bishop, Rook, Pawn
}

export enum PieceColour {
    White, Black
}
export const getDefaultMovementStrategy = (type: PieceType): [MovemenetStrategy] => {
    switch(type) {
        case PieceType.Wizard:
            return [new DaigonaleMovementStrategy()];
        case PieceType.Queen:
            return [new DaigonaleMovementStrategy()];
        case PieceType.Knight:
            return [new DaigonaleMovementStrategy()];
        case PieceType.Bishop:
            return [new DaigonaleMovementStrategy()];
        case PieceType.Rook:
            return [new DaigonaleMovementStrategy()];
        case PieceType.Pawn:
            return [new DaigonaleMovementStrategy()];
    }
}

export interface Piece { 
    type: PieceType;
    colour: PieceColour;    
    movementStrategy: [MovemenetStrategy];
}