import { BoardModel } from "../../../model/board/boardModel";
import { PieceType } from "../../../model/board/entities/pieces";

export type Movement = {
    type: 'move' | 'capture';
    row: number;
    col: number;
}

export interface MovemenetStrategy {
    possibleMovements: (board: BoardModel) => Movement[];
}

export class DaigonaleMovementStrategy implements MovemenetStrategy {
    possibleMovements(board: BoardModel): Movement[] {
        return [];
    }
}