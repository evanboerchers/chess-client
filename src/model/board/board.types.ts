import { PieceData } from './pieces/pieces.types';

export interface BoardCoordinate {
  col: number;
  row: number;
}

export interface Move {
  from: BoardCoordinate;
  to: BoardCoordinate;
}

export interface SquareData {
  piece: PieceData | null;
  coordinate: BoardCoordinate;
}
