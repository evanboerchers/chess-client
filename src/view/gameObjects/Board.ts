import { Scene } from 'phaser';
import BoardSquare, { SquareColour } from './BoardSquare';
import { BoardModel } from '../../model/board/boardModel';
import Piece from './Piece';
import { BoardCoordinate } from '../../model/board/board.types';
import { PieceColour, PieceType } from '../../model/board/pieces/pieces.types';

export enum OnEvents {
  HIGHLIGHT = 'Board:highlightSquare',
  HIGHLIGHT_CAPTURE = 'Board:highlightCaptureSquare',
  HIGHLIGHT_MOVE = 'Board:highlightMoveSquare',
  CLEAR_HIGHLIGHTS = 'Board:clearHighlights',
  ENABLE_WHITE_INTERACTIONS = 'Board:enableWhiteInteractions',
  ENABLE_BLACK_INTERACTIONS = 'Board:enableBlackInteractions',
}

export default class Board extends Phaser.GameObjects.Container {
  rows: number = 8;
  columns: number = 8;
  boardWidth: number;
  squares: BoardSquare[][];
  pieces: Piece[]
  boardModel: BoardModel;
  selectedPiece: [number, number] | null = null;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    boardWidth: number,
    boardModel: BoardModel
  ) {
    super(scene, x, y);
    this.boardModel = boardModel;
    this.boardWidth = boardWidth;
    this.squares = Array.from({ length: this.rows }, () =>
      Array(this.columns).fill(null)
    );
    scene.add.existing(this);
    this.drawBoard();
    this.drawPieces();
  }

//   createPieces() {
//     const createPieces = (type: PieceType, count: number, color: PieceColour) =>
//         Array.from({ length: count }, () => new Piece(this.scene, 0, 0, type, color));

//     this.pieces = {
//         [PieceColour.White]: {
//             [PieceType.Wizard]: createPieces(PieceType.Wizard, 1, PieceColour.White),
//             [PieceType.Queen]: createPieces(PieceType.Queen, 1, PieceColour.White),
//             [PieceType.Rook]: createPieces(PieceType.Rook, 2, PieceColour.White),
//             [PieceType.Bishop]: createPieces(PieceType.Bishop, 2, PieceColour.White),
//             [PieceType.Knight]: createPieces(PieceType.Knight, 2, PieceColour.White),
//             [PieceType.Pawn]: createPieces(PieceType.Pawn, 10, PieceColour.White),
//         },
//         [PieceColour.Black]: {
//             [PieceType.Wizard]: createPieces(PieceType.Wizard, 1, PieceColour.Black),
//             [PieceType.Queen]: createPieces(PieceType.Queen, 1, PieceColour.Black),
//             [PieceType.Rook]: createPieces(PieceType.Rook, 2, PieceColour.Black),
//             [PieceType.Bishop]: createPieces(PieceType.Bishop, 2, PieceColour.Black),
//             [PieceType.Knight]: createPieces(PieceType.Knight, 2, PieceColour.Black),
//             [PieceType.Pawn]: createPieces(PieceType.Pawn, 10, PieceColour.Black),
//         }
//     };
// }


  drawBoard(): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const squareWidth = this.boardWidth / this.rows;
        const x = squareWidth * col + squareWidth / 2;
        const y = squareWidth * row + squareWidth / 2;
        const isWhite = (row + col) % 2 === 0;
        const color = isWhite ? SquareColour.Light : SquareColour.Dark;
        const boardSquare = new BoardSquare(
          this.scene,
          x,
          y,
          squareWidth,
          color,
          { row, col }
        );
        this.squares[row][col] = boardSquare;
        this.add(boardSquare);
      }
    }
  }

  clearBoard(): void {
    this.pieces.forEach((piece) => piece.destroy())
  }

  drawPieces(): void {
    this.pieces = []
    const board = this.boardModel.board;
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const pieceModel = board[row][col].piece;
        if (pieceModel) {
          const piece = new Piece(
            this.scene,
            0,
            0,
            pieceModel.type,
            pieceModel.colour,
            `${pieceModel.colour}${pieceModel.type}_${col},${row}`
          );
          this.pieces.push(piece)
          this.squares[row][col].addPiece(piece);
        }
      }
    }
  }

  highlightSquare(coordinate: BoardCoordinate): void {
    this.getBoardSquare(coordinate).highlight();
  }

  highlightCaptureSquare(coordinate: BoardCoordinate): void {
    this.getBoardSquare(coordinate).highlightCapture();
  }

  highlightMoveSquare(coordinate: BoardCoordinate): void {
    this.getBoardSquare(coordinate).highlightMove();
  }

  clearHighlights(): void {
    this.squares.flat().forEach((square) => square.clearHighlight());
  }

  enableSquareInteractions(
    callback: (coordinate: BoardCoordinate) => any,
    coordinates?: BoardCoordinate[]
  ): void {
    if (coordinates) {
      coordinates.forEach((coordinate) => {
        this.squares[coordinate.row][coordinate.col].setInteractive({
          useHandCursor: true,
        });
        this.squares[coordinate.row][coordinate.col].on('pointerdown', () =>
          callback(coordinate)
        );
      });
      return;
    }
    this.squares.flat().forEach((square) => {
      square.setInteractive({ useHandCursor: true });
      square.on('pointerdown', () => callback(square.coordinate));
    });
  }

  enablePieceInteractions(color: PieceColour): void {
    this.squares.flat().forEach((square) => {
      if (!square._piece || square._piece.colour !== color) {
        return;
      }
      square.setInteractive({ useHandCursor: true });
    });
  }

  disableInteractive(): this {
    this.squares.flat().forEach((square) => {
      square.disableInteractive();
    });
    return this;
  }

  movePiece(from: BoardCoordinate, to: BoardCoordinate): void {
    const piece = this.squares[from.row][from.col]._piece;
    if (!piece) {
      return;
    }
    this.squares[from.row][from.col].remove(piece);
    this.squares[to.row][to.col].addPiece(piece);
  }

  capturePiece(from: BoardCoordinate, to: BoardCoordinate): void {
    const piece = this.squares[from.row][from.col]._piece;
    const capturedPiece = this.squares[to.row][to.col]._piece;
    if (!piece || !capturedPiece) {
      return;
    }
    this.squares[from.row][from.col].remove(piece);
    this.squares[to.row][to.col].remove(capturedPiece);
    this.squares[to.row][to.col].addPiece(piece);
  }

  getBoardSquare(coordinate: BoardCoordinate): BoardSquare {
    return this.squares[coordinate.row][coordinate.col];
  }

  getPiece(coordinate: BoardCoordinate): Piece | undefined {
    return this.squares[coordinate.row][coordinate.col].piece;
  }
}
