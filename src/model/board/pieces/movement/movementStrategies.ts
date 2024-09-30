import { BoardCoordinate, SquareData } from '../../board.types';
import { PieceType } from '../pieces.types';
import { MovementStrategy, MovementStrategyMap } from './movement.types';

export const mergeMovementStrategies = (
  strategies: MovementStrategy[]
): MovementStrategy => {
  return (coordinate, board) => {
    const moves: BoardCoordinate[] = [];
    const captures: BoardCoordinate[] = [];
    const castles: BoardCoordinate[] = [];

    strategies.forEach((strategy) => {
      const {
        moves: newMoves,
        captures: newCaptures,
        castles: newCastles,
      } = strategy(coordinate, board);
      moves.push(...newMoves);
      captures.push(...newCaptures);
      castles.push(...newCastles);
    });
    return { moves, captures, castles };
  };
};

export const diagonalMovement: MovementStrategy = (
  coordinate: BoardCoordinate,
  board: SquareData[][]
) => {
  const { row, col } = coordinate;
  const moves: BoardCoordinate[] = [];
  const captures: BoardCoordinate[] = [];

  const directions = [
    { row: 1, col: 1 },
    { row: 1, col: -1 },
    { row: -1, col: 1 },
    { row: -1, col: -1 },
  ];

  directions.forEach((direction) => {
    let newRow = row + direction.row;
    let newCol = col + direction.col;

    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      if (board[newRow][newCol].piece) {
        if (
          board[newRow][newCol].piece?.colour !== board[row][col].piece?.colour
        ) {
          captures.push({ row: newRow, col: newCol });
        }
        break;
      }
      moves.push({ row: newRow, col: newCol });
      newRow += direction.row;
      newCol += direction.col;
    }
  });

  return { moves, captures, castles: [] };
};

export const linearMovement: MovementStrategy = (
  coordinate: BoardCoordinate,
  board: SquareData[][]
) => {
  const { row, col } = coordinate;
  const moves: BoardCoordinate[] = [];
  const captures: BoardCoordinate[] = [];

  const directions = [
    { row: 1, col: 0 },
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: -1 },
  ];

  directions.forEach((direction) => {
    let newRow = row + direction.row;
    let newCol = col + direction.col;

    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      if (
        board[newRow][newCol].piece &&
        board[newRow][newCol].piece?.colour !== board[row][col].piece?.colour
      ) {
        captures.push({ row: newRow, col: newCol });
        break;
      }
      moves.push({ row: newRow, col: newCol });
      newRow += direction.row;
      newCol += direction.col;
    }
  });

  return { moves, captures, castles: [] };
};

export const knightMovement: MovementStrategy = (
  coordinage: BoardCoordinate,
  board: SquareData[][]
) => {
  const { row, col } = coordinage;
  const moves: BoardCoordinate[] = [];
  const captures: BoardCoordinate[] = [];

  const directions = [
    { row: 2, col: 1 },
    { row: 2, col: -1 },
    { row: -2, col: 1 },
    { row: -2, col: -1 },
    { row: 1, col: 2 },
    { row: 1, col: -2 },
    { row: -1, col: 2 },
    { row: -1, col: -2 },
  ];

  directions.forEach((direction) => {
    const newRow = row + direction.row;
    const newCol = col + direction.col;

    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      if (board[newRow][newCol].piece) {
        if (
          board[newRow][newCol].piece?.colour !== board[row][col].piece?.colour
        ) {
          captures.push({ row: newRow, col: newCol });
        }
      } else {
        moves.push({ row: newRow, col: newCol });
      }
    }
  });

  return { moves, captures, castles: [] };
};

export const movementStrategyMap: MovementStrategyMap = {
  [PieceType.Pawn]: diagonalMovement,

  [PieceType.Rook]: linearMovement,
  [PieceType.Knight]: knightMovement,
  [PieceType.Bishop]: diagonalMovement,
  [PieceType.Wizard]: mergeMovementStrategies([
    diagonalMovement,
    linearMovement,
  ]),
  [PieceType.Queen]: mergeMovementStrategies([
    diagonalMovement,
    linearMovement,
  ]),
};
