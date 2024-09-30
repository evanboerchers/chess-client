import { PieceData } from './pieces/pieces.types';

export interface BoardCoordinate {
  row: number;
  col: number;
}

export interface SquareData {
  piece: PieceData | null;
  coordinate: BoardCoordinate;
}
