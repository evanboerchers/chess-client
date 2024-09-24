import { Scene } from "phaser";
import BoardSquare from "./BoardSquare";
import { BoardModel } from "../../model/board/boardModel";
import Piece from "./Piece";

export default class Board extends Phaser.GameObjects.Container {
  rows: number = 8;
  columns: number = 8; 
  boardWidth: number;
  board: BoardSquare[][];
  boardModel: BoardModel;

  constructor(scene: Scene, x: number, y: number, boardWidth: number, boardModel: BoardModel) {
    super(scene, x, y);
    this.boardModel = boardModel;
    this.boardWidth = boardWidth;
    this.board = Array.from({ length: this.rows }, () => Array(this.columns).fill(null));
    scene.add.existing(this);
    this.drawBoard();
    this.drawPieces();
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
    const board = this.boardModel.board;
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const pieceModel = board[row][col].piece;
        if (pieceModel) {
          const piece = new Piece(this.scene, 0, 0, pieceModel.type, pieceModel.colour);
          this.board[row][col].piece = piece;
        }
      }
    }
  }
}
