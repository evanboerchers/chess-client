import { BoardCoordinate, SquareData } from '../../board.types';
import { PieceType } from '../pieces.types';

export interface PotentialMoves {
  moves: BoardCoordinate[];
  captures: BoardCoordinate[];
  castles: BoardCoordinate[];
}

export type MovementStrategy = (
  coordinate: BoardCoordinate,
  board: SquareData[][]
) => PotentialMoves;

export type MovementStrategyMap = {
  [key in PieceType]: MovementStrategy;
};
