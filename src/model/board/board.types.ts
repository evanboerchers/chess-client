import { PieceData } from './pieces/pieces.types';

export interface BoardCoordinate {
  col: number;
  row: number;
}

export interface SquareData {
  piece: PieceData | null;
  coordinate: BoardCoordinate;
}
