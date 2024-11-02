import { BoardCoordinate, SquareData } from '../../board.types';
import { PieceColour, PieceType } from '../pieces.types';
import { MovementStrategy, MovementStrategyMap } from './movement.types';

// ToDo: Refactor so common logic like checking for same piece colour etc is handled by a shared function

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
        board[newRow][newCol].piece
      ) {
        if (board[newRow][newCol].piece?.colour !== board[row][col].piece?.colour) {
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

export const pawnMovement: MovementStrategy = (
  coordinate: BoardCoordinate,
  board: SquareData[][]
) => {
  const { row, col } = coordinate;
  const piece = board[row][col].piece
  const moves: BoardCoordinate[] = [];
  const captures: BoardCoordinate[] = [];

  console.log(coordinate)
  const direction =
    piece?.colour === PieceColour.White ? -1 : 1;

  let newRow = row + direction;
  if (newRow >= 0 && newRow < 8 && !board[newRow][col].piece) {
    moves.push({ row: newRow, col });
  }

  if ((row === 6 && piece?.colour === PieceColour.White) || (row === 1 && piece?.colour === PieceColour.Black)) {
    newRow += direction
    if (newRow >= 0 && newRow < 8 && !board[newRow][col].piece) {
      moves.push({ row: newRow, col });
    }
  }

  return { moves, captures, castles: [] };
};

export const pawnCapture: MovementStrategy = (
  coordinate: BoardCoordinate,
  board: SquareData[][]
) => {
  const { row, col } = coordinate;
  const moves: BoardCoordinate[] = [];
  const captures: BoardCoordinate[] = [];

  const direction =
    board[row][col].piece?.colour === PieceColour.White ? -1 : 1;

  const directions = [
    { row: direction, col: 1 },
    { row: direction, col: -1 },
  ];

  directions.forEach((direction) => {
    const newRow = row + direction.row;
    const newCol = col + direction.col;

    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      if (
        board[newRow][newCol].piece &&
        board[newRow][newCol].piece?.colour !== board[row][col].piece?.colour
      ) {
        captures.push({ row: newRow, col: newCol });
      }
    }
  });

  return { moves, captures, castles: [] };
};

export const kingMovement: MovementStrategy = (
  coordingate: BoardCoordinate,
  board: SquareData[][]
) => {
  const { row, col } = coordingate;
  const moves: BoardCoordinate[] = [];
  const captures: BoardCoordinate[] = [];

  const directions = [
    { row: 1, col: 0 },
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: -1 },
    { row: 1, col: 1 },
    { row: 1, col: -1 },
    { row: -1, col: 1 },
    { row: -1, col: -1 },
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

export const kingCastle: MovementStrategy = (
  coordinate: BoardCoordinate,
  board: SquareData[][]
) => {
  const { row, col } = coordinate;
  const moves: BoardCoordinate[] = [];
  const captures: BoardCoordinate[] = [];
  const castles: BoardCoordinate[] = [];

  if (board[row][col].piece?.hasMoved) {
    return { moves, captures, castles };
  }

  const direction =
    board[row][col].piece?.colour === PieceColour.White ? 1 : -1;

  const kingSideCastle = board[row][7].piece;
  const queenSideCastle = board[row][0].piece;

  if (
    kingSideCastle &&
    !kingSideCastle.hasMoved &&
    !board[row][5].piece &&
    !board[row][6].piece
  ) {
    castles.push({ row, col: 6 });
  }

  if (
    queenSideCastle &&
    !queenSideCastle.hasMoved &&
    !board[row][1].piece &&
    !board[row][2].piece &&
    !board[row][3].piece
  ) {
    castles.push({ row, col: 2 });
  }

  return { moves, captures, castles };
};

export const movementStrategyMap: MovementStrategyMap = {
  [PieceType.Pawn]: mergeMovementStrategies([pawnMovement, pawnCapture]),
  [PieceType.Rook]: linearMovement,
  [PieceType.Knight]: knightMovement,
  [PieceType.Bishop]: diagonalMovement,
  [PieceType.Wizard]: mergeMovementStrategies([kingMovement, kingMovement]),
  [PieceType.Queen]: mergeMovementStrategies([
    diagonalMovement,
    linearMovement,
  ]),
};
