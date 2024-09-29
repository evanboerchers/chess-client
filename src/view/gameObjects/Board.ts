import { Scene } from 'phaser';
import BoardSquare from './BoardSquare';
import { BoardModel } from '../../model/board/boardModel';
import Piece from './Piece';
import ThemeManager from '../ThemeManager';
import { PieceColour } from '../../model/board/entities/pieces';

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
        const color = isWhite
          ? ThemeManager.getTheme().board.lightSquareColour
          : ThemeManager.getTheme().board.darkSquareColour;
        const boardSquare = new BoardSquare(
          this.scene,
          x,
          y,
          squareWidth,
          color,
          row,
          col
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

  highlightSquare(row: number, col: number): void {
    this.board[row][col].highlight();
  }

  highlightAttackSquare(row: number, col: number): void {
    this.board[row][col].highlightAttack();
  }

  highlightMoveSquare(row: number, col: number): void {
    this.board[row][col].highlightMove();
  }

  handlePieceClick(row: number, col: number): void {
    this.selectedPiece = [row, col];
    console.log('Selected piece:', this.selectedPiece);
    this.enableSquareInteractions();
  }

  handleMoveClick(row: number, col: number): void {
    if (!this.selectedPiece) {
      return;
    }
    this.movePiece(this.selectedPiece[0], this.selectedPiece[0], row, col);
    this.selectedPiece = null;
  }

  enableSquareInteractions(): void {
    this.board.flat().forEach((square) => {
      square.setInteractive({ useHandCursor: true });
      square.on('pointerdown', () =>
        this.handleMoveClick(square.row, square.col)
      );
    });
  }

  enablePieceInteractions(color: PieceColour): void {
    this.board.flat().forEach((square) => {
      if (!square._piece || square._piece.colour !== color) {
        return;
      }
      square._piece?.interactive(true, () =>
        this.handlePieceClick(square.row, square.col)
      );
    });
  }

  movePiece(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): void {
    const piece = this.board[fromRow][fromCol]._piece;
    if (!piece) {
      return;
    }
    this.board[fromRow][fromCol].remove(piece);
    this.board[toRow][toCol].addPiece(piece);
  }
}
