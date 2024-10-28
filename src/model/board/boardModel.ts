import { PieceColour, PieceType } from './pieces/pieces.types';
import { BoardCoordinate, Move, SquareData } from './board.types';
import { PotentialMoves } from './pieces/movement/movement.types';
import { movementStrategyMap } from './pieces/movement/movementStrategies';

export class BoardModel {
  private _board: SquareData[][];
  private _lastMove: Move;

  constructor() {
    this._board = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.init();
  }

  public init() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        this._board[row][col] = { piece: null, coordinate: { row, col } };
      }
    }
    this.initStartingPeices();
  }

  public initStartingPeices() {
    const pieceSetup: PieceType[] = [
      PieceType.Rook,
      PieceType.Knight,
      PieceType.Bishop,
      PieceType.Queen,
      PieceType.Wizard,
      PieceType.Bishop,
      PieceType.Knight,
      PieceType.Rook,
    ];

    for (let col = 0; col < 8; col++) {
      this._board[0][col].piece = {
        type: pieceSetup[col],
        colour: PieceColour.Black,
      };
      this._board[1][col].piece = {
        type: PieceType.Pawn,
        colour: PieceColour.Black,
      };
    }

    for (let col = 0; col < 8; col++) {
      this._board[7][col].piece = {
        type: pieceSetup[col],
        colour: PieceColour.White,
      };
      this._board[6][col].piece = {
        type: PieceType.Pawn,
        colour: PieceColour.White,
      };
    }
  }

  getPotentialMoves(coordinate: BoardCoordinate): PotentialMoves {
    const piece = this._board[coordinate.row][coordinate.col].piece;
    if (!piece) {
      return { moves: [], captures: [], castles: [] };
    }
    return movementStrategyMap[piece.type](coordinate, this._board);
  }

  movePiece(
    pieceCoordinate: BoardCoordinate,
    targetCoordinate: BoardCoordinate
  ) {
    this._lastMove = { from: pieceCoordinate, to: targetCoordinate }
    this._board[targetCoordinate.row][targetCoordinate.col].piece =
      this._board[pieceCoordinate.row][pieceCoordinate.col].piece;
    this._board[pieceCoordinate.row][pieceCoordinate.col].piece = null;
  }

  capturePiece(
    pieceCoordinate: BoardCoordinate,
    targetCoordinate: BoardCoordinate
  ) {
    this._board[targetCoordinate.row][targetCoordinate.col].piece =
      this._board[pieceCoordinate.row][pieceCoordinate.col].piece;
    this._board[pieceCoordinate.row][pieceCoordinate.col].piece = null;
  }

  public get board(): SquareData[][] {
    return this._board;
  }

  public set board(value: SquareData[][]) {
    this._board = value;
  }
}
