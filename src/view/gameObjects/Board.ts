import { Scene } from 'phaser';
import BoardSquare, { SquareColour } from './BoardSquare';
import { BoardModel } from '../../model/board/boardModel';
import Piece from './Piece';
import { BoardCoordinate } from '../../model/board/board.types';
import { PieceColour } from '../../model/board/pieces/pieces.types';

export default class Board extends Phaser.GameObjects.Container {
  rows: number = 8;
  columns: number = 8;
  boardWidth: number;
  board: BoardSquare[][];
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
    this.board = Array.from({ length: this.rows }, () =>
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
        this.board[row][col] = boardSquare;
        this.add(boardSquare);
      }
    }
  }

  drawPieces(): void {
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
            pieceModel.colour
          );
          this.board[row][col].addPiece(piece);
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
    this.board.flat().forEach((square) => square.clearHighlight());
  }

  enableSquareInteractions(
    callback: (coordinate: BoardCoordinate) => any,
    coordinates?: BoardCoordinate[]
  ): void {
    if (coordinates) {
      coordinates.forEach((coordinate) => {
        this.board[coordinate.row][coordinate.col].setInteractive({
          useHandCursor: true,
        });
        this.board[coordinate.row][coordinate.col].on('pointerdown', () =>
          callback(coordinate)
        );
      });
      return;
    }
    this.board.flat().forEach((square) => {
      square.setInteractive({ useHandCursor: true });
      square.on('pointerdown', () => callback(square.coordinate));
    });
  }

  enablePieceInteractions(
    color: PieceColour,
    callback: (coordinate: BoardCoordinate) => any
  ): void {
    this.board.flat().forEach((square) => {
      if (!square._piece || square._piece.colour !== color) {
        return;
      }
      square.setInteractive({ useHandCursor: true });
      square.on('pointerdown', () => callback(square.coordinate));
    });
  }

  disableInteractive(): this {
    this.board.flat().forEach((square) => {
      square.disableInteractive();
      square.off('pointerdown');
    });
    return this;
  }

  movePiece(from: BoardCoordinate, to: BoardCoordinate): void {
    const piece = this.board[from.row][from.col]._piece;
    if (!piece) {
      return;
    }
    this.board[from.row][from.col].remove(piece);
    this.board[to.row][to.col].addPiece(piece);
  }

  getBoardSquare(coordinate: BoardCoordinate): BoardSquare {
    return this.board[coordinate.row][coordinate.col];
  }

  getPiece(coordinate: BoardCoordinate): Piece | undefined {
    return this.board[coordinate.row][coordinate.col].piece;
  }
}
