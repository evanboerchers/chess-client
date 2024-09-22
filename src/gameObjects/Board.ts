import { Scene } from "phaser";
import BoardSquare from "./BoardSquare";

export default class Board extends Phaser.GameObjects.Container {
  rows: number = 8;
  columns: number = 8; // Added columns definition
  boardWidth: number;
  board: BoardSquare[][];

  constructor(scene: Scene, x: number, y: number, boardWidth: number) {
    super(scene, x, y);
    this.boardWidth = boardWidth;
    this.board = Array.from({ length: this.rows }, () => Array(this.columns).fill(null));
    scene.add.existing(this);
    this.drawBoard();
  }

  drawBoard(): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const squareWidth = this.boardWidth / this.rows;
        const x = (squareWidth * col) + squareWidth / 2;
        const y = (squareWidth * row) + squareWidth / 2; 
        const isWhite = (row + col) % 2 === 0;
        const color = isWhite ? 0xffffff : 0x000000;
        const boardSquare = new BoardSquare(this.scene, x, y, squareWidth, color);
        this.board[row][col] = boardSquare;
        this.add(boardSquare);
      }
    }
  }

  drawPieces(): void {
    // This is where you can add chess pieces later
  }
}
