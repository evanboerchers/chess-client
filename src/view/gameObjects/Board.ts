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
  selectedPiece: [number, number] | null = null;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    boardWidth: number,
    boardModel: BoardModel
  ) {
    super(scene, x, y);
    this.boardWidth = boardWidth;
    this.squares = Array.from({ length: this.rows }, () =>
      Array(this.columns).fill(null)
    );
    scene.add.existing(this);
    this.drawBoard();
    this.drawPieces();
  }

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
        boardSquare.name = `square_${row},${col}`
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
            `${pieceModel.colour}${pieceModel.type}_${row},${col}`
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
    this.squares[from.row][from.col].removePiece();
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

  flip(): void {
    if (this.angle !== 0) {
      this.angle = 0
      this.setPosition(this.x - this.getBounds().width, this.y - this.getBounds().height)
      this.squares.flat().forEach(square => {
        if (square._piece) {
          square._piece.angle = 0
        }
      })
    } else {
      this.angle = 180
      this.setPosition(this.x + this.getBounds().width,
        this.y + this.getBounds().height)
      this.squares.flat().forEach(square => {
        if (square._piece) {
          square._piece.angle = 180
        }
      })
    }

  }

}
